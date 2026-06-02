import logging
from django.db.models import Count, Sum, Q
from django.db.models.functions import TruncMonth
from django.utils import timezone
from datetime import timedelta
from apps.customers.models import Customer
from apps.rewards.models import RewardTransaction
from apps.offers.models import Offer
from apps.attendance.models import Attendance
from decimal import Decimal

logger = logging.getLogger(__name__)

class DashboardSelectors:
    @staticmethod
    def get_customer_summary():
        total = Customer.objects.count()
        active = Customer.objects.filter(is_active=True).count()
        logger.info(f"DEBUG: Customer summary - Total: {total}, Active: {active}")
        return {'total_customers': total, 'active_customers': active}

    @staticmethod
    def get_offer_summary():
        now = timezone.now()
        total = Offer.objects.count()
        active = Offer.objects.filter(is_active=True, start_date__lte=now, end_date__gte=now).count()
        logger.info(f"DEBUG: Offer summary - Total: {total}, Active: {active}")
        return {'total_offers': total, 'active_offers': active}

    @staticmethod
    def get_reward_summary():
        stats = RewardTransaction.objects.aggregate(
            total_points_awarded=Sum('points', filter=Q(transaction_type='POINT_ADD')),
            total_balance_awarded=Sum('balance', filter=Q(transaction_type='BALANCE_ADD')),
            total_points_converted=Sum('points', filter=Q(transaction_type='CONVERT'))
        )
        total_pending_balance = Customer.objects.aggregate(total=Sum('pending_balance'))['total']
        
        result = {
            'total_points_awarded': stats['total_points_awarded'] or 0,
            'total_pending_balance': total_pending_balance or Decimal('0.00'),
            'reward_conversion_summary': stats['total_points_converted'] or 0
        }
        logger.info(f"DEBUG: Reward summary - {result}")
        return result

    @staticmethod
    def get_attendance_summary():
        # Get today's local date
        today = timezone.localtime(timezone.now()).date()
        
        from django.contrib.auth import get_user_model
        User = get_user_model()
        total_staff = User.objects.filter(role='STAFF', is_active=True).count()
        
        # Filter attendance records for today of staff members
        attendance_qs = Attendance.objects.filter(date=today, staff__role='STAFF')
        
        stats = attendance_qs.aggregate(
            present_cnt=Count('id', filter=Q(status='PRESENT')),
            late_cnt=Count('id', filter=Q(status='LATE')),
            halfday_cnt=Count('id', filter=Q(status='HALFDAY')),
            absent_cnt=Count('id', filter=Q(status='ABSENT')),
            active_cnt=Count('id', filter=Q(check_out__isnull=True))
        )
        
        present_count = (stats['present_cnt'] or 0) + (stats['late_cnt'] or 0) + (stats['halfday_cnt'] or 0)
        absent_count = max(0, total_staff - present_count)
        
        result = {
            'todays_attendance': f"{present_count}/{total_staff}" if total_staff > 0 else "0/0",
            'present_count': present_count,
            'absent_count': absent_count,
            'late_count': stats['late_cnt'] or 0,
            'halfday_count': stats['halfday_cnt'] or 0,
            'active_attendance': stats['active_cnt'] or 0,
            'total_staff': total_staff
        }
        
        logger.info(f"DEBUG: Attendance summary for {today} - {result}")
        print(f"DEBUG: Attendance summary for {today} - {result}")
        return result

    @staticmethod
    def get_recent_activities():
        transactions = RewardTransaction.objects.select_related('customer').order_by('-created_at')[:10]
        attendances = Attendance.objects.select_related('staff').order_by('-created_at')[:10]
        
        activities = []
        for t in transactions:
            activities.append({
                'id': str(t.id),
                'type': 'REWARD',
                'user': t.customer.user.name or t.customer.user.email,
                'action': f"Points: {t.points}, Balance: {t.balance}",
                'date': t.created_at,
                'details': f"Points: {t.points}, Balance: {t.balance}",
                'status': 'Success'
            })
            
        for a in attendances:
            activities.append({
                'id': str(a.id),
                'type': 'ATTENDANCE',
                'user': a.staff.name or a.staff.email,
                'action': f"Attendance Marked: {a.status}",
                'date': a.created_at or a.check_in,
                'details': f"Check-in: {a.check_in.strftime('%I:%M %p') if a.check_in else '--:--'}, Check-out: {a.check_out.strftime('%I:%M %p') if a.check_out else '--:--'}",
                'status': 'Success'
            })
            
        # Sort by date descending
        activities.sort(key=lambda x: x['date'] if x['date'] else timezone.now(), reverse=True)
        recent_list = activities[:10]
        
        # Convert date to ISO string for API compatibility
        for act in recent_list:
            if isinstance(act['date'], timezone.datetime):
                act['date'] = act['date'].isoformat()
                
        logger.info(f"DEBUG: Recent activities returned {len(recent_list)} items")
        print(f"DEBUG: Recent activities returned {len(recent_list)} items")
        return recent_list

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
            
        # Attendance trend by day (last 30 days) for all staff members
        attendance_trend = Attendance.objects.filter(date__gte=thirty_days_ago, staff__role='STAFF')\
            .values('date')\
            .annotate(present=Count('id', filter=Q(status__in=['PRESENT', 'LATE', 'HALFDAY'])))\
            .order_by('date')

        result = {
            'customer_growth': [{'month': c['month'].strftime('%Y-%m') if c['month'] else '', 'count': c['count']} for c in customer_growth if c['month']],
            'attendance_trend': [{'day': a['date'].strftime('%Y-%m-%d') if a['date'] else '', 'present': a['present']} for a in attendance_trend if a['date']],
        }
        
        logger.info(f"DEBUG: Graph data generated - {result}")
        print(f"DEBUG: Graph data generated - {result}")
        return result
