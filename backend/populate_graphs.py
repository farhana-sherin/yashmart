import os
import django
import random
from datetime import timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.customers.models import Customer
from apps.attendance.models import Attendance
from apps.staff.models import Staff
from apps.rewards.models import RewardTransaction

User = get_user_model()

def populate():
    now = timezone.now()
    
    # 1. Add some customers for the past 6 months to create customer_growth
    print("Creating customers...")
    for i in range(19):
        # random date within last 180 days
        days_ago = random.randint(1, 175)
        joined = now - timedelta(days=days_ago)
        
        email = f"cust_{i}_{random.randint(1000,9999)}@example.com"
        user = User.objects.create(
            email=email,
            name=f"Customer_{i}_{random.randint(1000,9999)}",
            role='CUSTOMER',
            is_active=True
        )
        user.set_password('password123')
        user.save()
        
        c, created = Customer.objects.get_or_create(
            user=user,
            defaults={'phone': f"90000{random.randint(10000,99999)}"}
        )
        # Force update joined_at since auto_now_add might override it on create
        Customer.objects.filter(id=c.id).update(joined_at=joined)
        
        # Add a reward transaction
        RewardTransaction.objects.create(
            customer=c,
            transaction_type='POINT_ADD',
            points=random.randint(10, 100),
            balance=random.randint(10, 50)
        )

    # 2. Add attendance for staff to create attendance_trend
    print("Creating attendance records...")
    staff_users = list(User.objects.filter(role='STAFF', is_active=True))
    if not staff_users:
        print("No active staff found. Creating one...")
        s_user = User.objects.create(
            email=f"staff_{random.randint(1000,9999)}@example.com",
            name="Test Staff",
            role='STAFF',
            is_active=True
        )
        s_user.set_password("password123")
        s_user.save()
        
        staff_members = [s_user]
    else:
        staff_members = staff_users[:3]

    for i in range(19):
        days_ago = random.randint(1, 28)
        att_date = (now - timedelta(days=days_ago)).date()
        
        for staff_user in staff_members:
            if random.choice([True, False, True]): # 66% chance to be present
                status = random.choice(['PRESENT', 'LATE', 'HALFDAY', 'PRESENT'])
            else:
                status = 'ABSENT'
                
            if not Attendance.objects.filter(staff=staff_user, date=att_date).exists():
                Attendance.objects.create(
                    staff=staff_user,
                    date=att_date,
                    status=status
                )

    print("10+ Temporary mixed data populated successfully.")

if __name__ == '__main__':
    populate()
