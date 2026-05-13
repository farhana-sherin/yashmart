from rest_framework import viewsets, views, filters, status, permissions
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from .models import Offer
from .serializers import (
    OfferSerializer, OfferCreateSerializer, OfferUpdateSerializer,
    OfferListSerializer, OfferDetailSerializer
)
from .services import OfferService
from .filters import OfferFilter
from .permissions import IsOfferManager
from apps.common.pagination import StandardResultsSetPagination
from apps.common.responses import success_response, error_response

class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.select_related('created_by').all()
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = OfferFilter
    search_fields = ['title', 'description']
    ordering_fields = ['priority', 'start_date', 'end_date', 'created_at']
    ordering = ['-priority', '-start_date']
    permission_classes = [IsOfferManager]

    def get_serializer_class(self):
        if self.action == 'create':
            return OfferCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return OfferUpdateSerializer
        elif self.action == 'retrieve':
            return OfferDetailSerializer
        elif self.action == 'list':
            return OfferListSerializer
        return OfferSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            offer = OfferService.create_offer(serializer.validated_data, request.user)
            return success_response(data=OfferDetailSerializer(offer, context={'request': request}).data, message="Offer created successfully", status_code=status.HTTP_201_CREATED)
        return error_response(errors=serializer.errors, message="Failed to create offer", status_code=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            offer = OfferService.update_offer(instance, serializer.validated_data)
            return success_response(data=OfferDetailSerializer(offer, context={'request': request}).data, message="Offer updated successfully")
        return error_response(errors=serializer.errors, message="Failed to update offer", status_code=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        OfferService.deactivate_offer(instance)
        return success_response(message="Offer deactivated successfully")

class ActiveOffersView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(responses={200: OfferListSerializer(many=True)})
    def get(self, request):
        offers = OfferService.get_active_offers()
        serializer = OfferListSerializer(offers, many=True, context={'request': request})
        return success_response(data=serializer.data, message="Active offers retrieved successfully")

class ExpiredOffersView(views.APIView):
    permission_classes = [IsOfferManager]

    @swagger_auto_schema(responses={200: OfferListSerializer(many=True)})
    def get(self, request):
        offers = OfferService.get_expired_offers()
        serializer = OfferListSerializer(offers, many=True, context={'request': request})
        return success_response(data=serializer.data, message="Expired offers retrieved successfully")

class OfferStatisticsView(views.APIView):
    permission_classes = [IsOfferManager]

    def get(self, request):
        stats = OfferService.get_offer_statistics()
        return success_response(data=stats, message="Offer statistics retrieved successfully")
