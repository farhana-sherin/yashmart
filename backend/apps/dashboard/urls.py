from django.urls import path
from .views import (
    DashboardStatsView, AttendanceSummaryView, RewardSummaryView, 
    CustomerSummaryView, OfferSummaryView, DashboardGraphView, 
    RecentActivitiesView
)

urlpatterns = [
    path('stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('attendance-summary/', AttendanceSummaryView.as_view(), name='dashboard-attendance'),
    path('reward-summary/', RewardSummaryView.as_view(), name='dashboard-reward'),
    path('customer-summary/', CustomerSummaryView.as_view(), name='dashboard-customer'),
    path('offer-summary/', OfferSummaryView.as_view(), name='dashboard-offer'),
    path('graphs/', DashboardGraphView.as_view(), name='dashboard-graphs'),
    path('recent-activities/', RecentActivitiesView.as_view(), name='dashboard-recent-activities'),
]
