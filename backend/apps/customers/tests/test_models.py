from django.test import TestCase
from apps.accounts.models import User
from apps.customers.models import Customer
from decimal import Decimal

class CustomerModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(email="test@customer.com", role="CUSTOMER")
        self.customer = Customer.objects.get(user=self.user)

    def test_customer_creation(self):
        self.assertTrue(self.customer.loyalty_id.startswith('YM-'))
        self.assertEqual(self.customer.total_points, 0)
        self.assertEqual(self.customer.pending_balance, Decimal('0.00'))

    def test_add_points(self):
        self.customer.add_points(50)
        self.assertEqual(self.customer.total_points, 50)

    def test_add_balance(self):
        self.customer.add_balance(Decimal('100.50'))
        self.assertEqual(self.customer.pending_balance, Decimal('100.50'))
