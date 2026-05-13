import django_filters
from .models import RewardTransaction

class RewardTransactionFilter(django_filters.FilterSet):
    date_from = django_filters.DateFilter(field_name="created_at", lookup_expr='date__gte')
    date_to = django_filters.DateFilter(field_name="created_at", lookup_expr='date__lte')
    customer_id = django_filters.UUIDFilter(field_name="customer__id")

    class Meta:
        model = RewardTransaction
        fields = ['customer_id', 'transaction_type', 'date_from', 'date_to']
