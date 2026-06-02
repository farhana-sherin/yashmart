from .selectors import DashboardSelectors

class DashboardService:
    @staticmethod
    def get_full_dashboard_stats():
        from apps.staff.models import Staff
        att_summary = DashboardSelectors.get_attendance_summary()
        return {
            'customers': DashboardSelectors.get_customer_summary(),
            'offers': DashboardSelectors.get_offer_summary(),
            'rewards': DashboardSelectors.get_reward_summary(),
            'attendance': att_summary,
            'staff': {
                'total_staff': att_summary.get('total_staff', 0),
                'active_staff': Staff.objects.filter(is_active=True).count(),
                'present_today': att_summary.get('present_count', 0),
                'absent_today': att_summary.get('absent_count', 0)
            }
        }

    @staticmethod
    def get_graph_data():
        return DashboardSelectors.get_graph_data()

    @staticmethod
    def get_recent_activities():
        return DashboardSelectors.get_recent_activities()
