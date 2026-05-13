from django.urls import path
from .views import (
    AddPointsView, AddBalanceView, ConvertBalanceView,
    RewardHistoryView, CustomerRewardSummaryView, RewardStatisticsView
)

urlpatterns = [
    path('add-points/', AddPointsView.as_view(), name='add-points'),
    path('add-balance/', AddBalanceView.as_view(), name='add-balance'),
    path('convert/', ConvertBalanceView.as_view(), name='convert-balance'),
    path('history/', RewardHistoryView.as_view(), name='reward-history'),
    path('customer/<uuid:pk>/', CustomerRewardSummaryView.as_view(), name='customer-reward-summary'),
    path('statistics/', RewardStatisticsView.as_view(), name='reward-statistics'),
]
