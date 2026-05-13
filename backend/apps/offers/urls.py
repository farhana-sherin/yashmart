from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OfferViewSet, ActiveOffersView, ExpiredOffersView, OfferStatisticsView

router = DefaultRouter()
router.register(r'', OfferViewSet, basename='offer')

urlpatterns = [
    path('active/', ActiveOffersView.as_view(), name='active-offers'),
    path('expired/', ExpiredOffersView.as_view(), name='expired-offers'),
    path('statistics/', OfferStatisticsView.as_view(), name='offer-statistics'),
    path('', include(router.urls)),
]
