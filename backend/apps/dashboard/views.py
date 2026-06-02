import logging
from rest_framework import views
from .services import DashboardService
from .selectors import DashboardSelectors
from apps.common.responses import success_response
from .permissions import IsDashboardViewer

logger = logging.getLogger(__name__)

class DashboardStatsView(views.APIView):
    permission_classes = [IsDashboardViewer]

    def get(self, request):
        logger.info(f"API Request: GET /api/v1/dashboard/stats/ by user {request.user.email}")
        stats = DashboardService.get_full_dashboard_stats()
        logger.info(f"API Response: GET /api/v1/dashboard/stats/ - data retrieved")
        return success_response(data=stats, message="Dashboard statistics retrieved successfully.")

class AttendanceSummaryView(views.APIView):
    permission_classes = [IsDashboardViewer]

    def get(self, request):
        logger.info(f"API Request: GET /api/v1/dashboard/attendance-summary/ by user {request.user.email}")
        data = DashboardSelectors.get_attendance_summary()
        logger.info(f"API Response: GET /api/v1/dashboard/attendance-summary/ - data: {data}")
        return success_response(data=data, message="Attendance summary retrieved.")

class RewardSummaryView(views.APIView):
    permission_classes = [IsDashboardViewer]

    def get(self, request):
        logger.info(f"API Request: GET /api/v1/dashboard/reward-summary/ by user {request.user.email}")
        data = DashboardSelectors.get_reward_summary()
        logger.info(f"API Response: GET /api/v1/dashboard/reward-summary/ - data retrieved")
        return success_response(data=data, message="Reward summary retrieved.")

class CustomerSummaryView(views.APIView):
    permission_classes = [IsDashboardViewer]

    def get(self, request):
        logger.info(f"API Request: GET /api/v1/dashboard/customer-summary/ by user {request.user.email}")
        data = DashboardSelectors.get_customer_summary()
        logger.info(f"API Response: GET /api/v1/dashboard/customer-summary/ - data retrieved")
        return success_response(data=data, message="Customer summary retrieved.")

class OfferSummaryView(views.APIView):
    permission_classes = [IsDashboardViewer]

    def get(self, request):
        logger.info(f"API Request: GET /api/v1/dashboard/offer-summary/ by user {request.user.email}")
        data = DashboardSelectors.get_offer_summary()
        logger.info(f"API Response: GET /api/v1/dashboard/offer-summary/ - data retrieved")
        return success_response(data=data, message="Offer summary retrieved.")

class DashboardGraphView(views.APIView):
    permission_classes = [IsDashboardViewer]

    def get(self, request):
        logger.info(f"API Request: GET /api/v1/dashboard/graphs/ by user {request.user.email}")
        data = DashboardService.get_graph_data()
        logger.info(f"API Response: GET /api/v1/dashboard/graphs/ - data: {data}")
        return success_response(data=data, message="Graph data retrieved.")

class RecentActivitiesView(views.APIView):
    permission_classes = [IsDashboardViewer]

    def get(self, request):
        logger.info(f"API Request: GET /api/v1/dashboard/recent-activities/ by user {request.user.email}")
        data = DashboardService.get_recent_activities()
        logger.info(f"API Response: GET /api/v1/dashboard/recent-activities/ - count: {len(data)}")
        return success_response(data=data, message="Recent activities retrieved.")
