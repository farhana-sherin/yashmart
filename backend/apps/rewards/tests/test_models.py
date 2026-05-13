from django.test import TestCase
from apps.accounts.models import User
from apps.customers.models import Customer
from apps.rewards.models import RewardTransaction
from apps.settings_app.models import SystemSettings
from decimal import Decimal

class RewardModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(email="test2@customer.com", role="CUSTOMER")
        self.customer = Customer.objects.get(user=self.user)
        SystemSettings.objects.create(point_conversion_rate=10.00)

    def test_transaction_creation(self):
        txn = RewardTransaction.objects.create(
            customer=self.customer,
            transaction_type='POINT_ADD',
            points=10
        )
        self.assertTrue(txn.reference_id.startswith('TXN-'))
        self.assertEqual(txn.points, 10)
