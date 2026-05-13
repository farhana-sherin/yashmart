from rest_framework import views, generics, status
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from django_filters.rest_framework import DjangoFilterBackend
from .models import RewardTransaction
from .serializers import (
    AddPointsSerializer, AddBalanceSerializer, ConvertBalanceSerializer,
    RewardHistorySerializer, RewardTransactionSerializer
)
from .services import RewardService
from .permissions import IsRewardManager
from .filters import RewardTransactionFilter
from apps.common.pagination import StandardResultsSetPagination

class AddPointsView(views.APIView):
    permission_classes = [IsRewardManager]

    @swagger_auto_schema(request_body=AddPointsSerializer)
    def post(self, request, *args, **kwargs):
        serializer = AddPointsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            transaction = RewardService.add_points(
                customer_id=serializer.validated_data['customer_id'],
                points=serializer.validated_data['points'],
                remarks=serializer.validated_data.get('remarks', ''),
                user=request.user
            )
            return Response({
                'success': True,
                'message': 'Points added successfully',
                'data': RewardTransactionSerializer(transaction).data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e),
                'errors': {}
            }, status=status.HTTP_400_BAD_REQUEST)

class AddBalanceView(views.APIView):
    permission_classes = [IsRewardManager]

    @swagger_auto_schema(request_body=AddBalanceSerializer)
    def post(self, request, *args, **kwargs):
        serializer = AddBalanceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            transaction = RewardService.add_balance(
                customer_id=serializer.validated_data['customer_id'],
                amount=serializer.validated_data['amount'],
                remarks=serializer.validated_data.get('remarks', ''),
                user=request.user
            )
            return Response({
                'success': True,
                'message': 'Balance added successfully',
                'data': RewardTransactionSerializer(transaction).data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e),
                'errors': {}
            }, status=status.HTTP_400_BAD_REQUEST)

class ConvertBalanceView(views.APIView):
    permission_classes = [IsRewardManager]

    @swagger_auto_schema(request_body=ConvertBalanceSerializer)
    def post(self, request, *args, **kwargs):
        serializer = ConvertBalanceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            transaction = RewardService.convert_balance_to_points(
                customer_id=serializer.validated_data['customer_id'],
                remarks=serializer.validated_data.get('remarks', ''),
                user=request.user
            )
            return Response({
                'success': True,
                'message': 'Balance converted to points successfully',
                'data': RewardTransactionSerializer(transaction).data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e),
                'errors': {}
            }, status=status.HTTP_400_BAD_REQUEST)

class RewardHistoryView(generics.ListAPIView):
    queryset = RewardTransaction.objects.select_related('customer', 'created_by').all()
    serializer_class = RewardHistorySerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = RewardTransactionFilter
    permission_classes = [IsRewardManager]

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return Response({
            'success': True,
            'message': 'Reward history retrieved successfully',
            'data': response.data
        })

class CustomerRewardSummaryView(views.APIView):
    permission_classes = [IsRewardManager]

    def get(self, request, pk, *args, **kwargs):
        try:
            summary = RewardService.get_customer_reward_summary(customer_id=pk)
            return Response({
                'success': True,
                'message': 'Customer reward summary retrieved successfully',
                'data': summary
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e),
                'errors': {}
            }, status=status.HTTP_400_BAD_REQUEST)

class RewardStatisticsView(views.APIView):
    permission_classes = [IsRewardManager]

    def get(self, request, *args, **kwargs):
        stats = RewardService.get_reward_statistics()
        return Response({
            'success': True,
            'message': 'Reward statistics retrieved successfully',
            'data': stats
        })
