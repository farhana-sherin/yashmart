from .selectors import DashboardSelectors

class DashboardService:
    @staticmethod
    def get_full_dashboard_stats():
        return {
            'customers': DashboardSelectors.get_customer_summary(),
            'offers': DashboardSelectors.get_offer_summary(),
            'rewards': DashboardSelectors.get_reward_summary(),
            'attendance': DashboardSelectors.get_attendance_summary()
        }

    @staticmethod
    def get_graph_data():
        return DashboardSelectors.get_graph_data()

    @staticmethod
    def get_recent_activities():
        return DashboardSelectors.get_recent_activities()
