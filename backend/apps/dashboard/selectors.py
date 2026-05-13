from django.db.models import Count, Sum, Q
from django.db.models.functions import TruncMonth, TruncDate
from django.utils import timezone
from datetime import timedelta
from apps.customers.models import Customer
from apps.rewards.models import RewardTransaction
from apps.offers.models import Offer
from apps.attendance.models import Attendance
from decimal import Decimal

class DashboardSelectors:
    @staticmethod
    def get_customer_summary():
        total = Customer.objects.count()
        active = Customer.objects.filter(is_active=True).count()
        return {'total_customers': total, 'active_customers': active}

    @staticmethod
    def get_offer_summary():
        now = timezone.now()
        total = Offer.objects.count()
        active = Offer.objects.filter(is_active=True, start_date__lte=now, end_date__gte=now).count()
        return {'total_offers': total, 'active_offers': active}

    @staticmethod
    def get_reward_summary():
        stats = RewardTransaction.objects.aggregate(
            total_points_awarded=Sum('points', filter=Q(transaction_type='POINT_ADD')),
            total_balance_awarded=Sum('balance', filter=Q(transaction_type='BALANCE_ADD')),
            total_points_converted=Sum('points', filter=Q(transaction_type='CONVERT'))
        )
        total_pending_balance = Customer.objects.aggregate(total=Sum('pending_balance'))['total']
        return {
            'total_points_awarded': stats['total_points_awarded'] or 0,
            'total_pending_balance': total_pending_balance or Decimal('0.00'),
            'reward_conversion_summary': stats['total_points_converted'] or 0
        }

    @staticmethod
    def get_attendance_summary():
        today = timezone.now().date()
        stats = Attendance.objects.filter(date=today).aggregate(
            present_count=Count('id', filter=Q(status='PRESENT')),
            absent_count=Count('id', filter=Q(status='ABSENT')),
            total=Count('id')
        )
        return {
            'todays_attendance': stats['total'],
            'present_count': stats['present_count'],
            'absent_count': stats['absent_count']
        }

    @staticmethod
    def get_recent_activities():
        transactions = RewardTransaction.objects.select_related('customer').order_by('-created_at')[:10]
        return [
            {
                'id': str(t.id),
                'type': t.transaction_type,
                'customer': t.customer.loyalty_id,
                'date': t.created_at,
                'details': f"Points: {t.points}, Balance: {t.balance}"
            } for t in transactions
        ]

    @staticmethod
    def get_graph_data():
        now = timezone.now()
        six_months_ago = now - timedelta(days=180)
        thirty_days_ago = now.date() - timedelta(days=30)

        # Customer growth by month (last 6 months)
        customer_growth = Customer.objects.filter(joined_at__gte=six_months_ago)\
            .annotate(month=TruncMonth('joined_at'))\
            .values('month')\
            .annotate(count=Count('id'))\
            .order_by('month')
            
        # Attendance trend by day (last 30 days)
        attendance_trend = Attendance.objects.filter(date__gte=thirty_days_ago)\
            .annotate(day=TruncDate('date'))\
            .values('day')\
            .annotate(present=Count('id', filter=Q(status='PRESENT')))\
            .order_by('day')

        return {
            'customer_growth': [{'month': c['month'].strftime('%Y-%m'), 'count': c['count']} for c in customer_growth],
            'attendance_trend': [{'day': a['day'].strftime('%Y-%m-%d'), 'present': a['present']} for a in attendance_trend],
        }
