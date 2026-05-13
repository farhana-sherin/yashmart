from rest_framework import views
from .services import DashboardService
from .selectors import DashboardSelectors
from apps.common.responses import success_response
from .permissions import IsDashboardViewer

class DashboardStatsView(views.APIView):
    permission_classes = [IsDashboardViewer]

    def get(self, request):
        stats = DashboardService.get_full_dashboard_stats()
        return success_response(data=stats, message="Dashboard statistics retrieved successfully.")

class AttendanceSummaryView(views.APIView):
    permission_classes = [IsDashboardViewer]

    def get(self, request):
        data = DashboardSelectors.get_attendance_summary()
        return success_response(data=data, message="Attendance summary retrieved.")

class RewardSummaryView(views.APIView):
    permission_classes = [IsDashboardViewer]

    def get(self, request):
        data = DashboardSelectors.get_reward_summary()
        return success_response(data=data, message="Reward summary retrieved.")

class CustomerSummaryView(views.APIView):
    permission_classes = [IsDashboardViewer]

    def get(self, request):
        data = DashboardSelectors.get_customer_summary()
        return success_response(data=data, message="Customer summary retrieved.")

class OfferSummaryView(views.APIView):
    permission_classes = [IsDashboardViewer]

    def get(self, request):
        data = DashboardSelectors.get_offer_summary()
        return success_response(data=data, message="Offer summary retrieved.")

class DashboardGraphView(views.APIView):
    permission_classes = [IsDashboardViewer]

    def get(self, request):
        data = DashboardService.get_graph_data()
        return success_response(data=data, message="Graph data retrieved.")

class RecentActivitiesView(views.APIView):
    permission_classes = [IsDashboardViewer]

    def get(self, request):
        data = DashboardService.get_recent_activities()
        return success_response(data=data, message="Recent activities retrieved.")
