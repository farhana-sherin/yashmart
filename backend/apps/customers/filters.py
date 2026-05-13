import django_filters
from .models import Customer

class CustomerFilter(django_filters.FilterSet):
    min_points = django_filters.NumberFilter(field_name="total_points", lookup_expr='gte')
    max_points = django_filters.NumberFilter(field_name="total_points", lookup_expr='lte')
    joined_after = django_filters.DateFilter(field_name="joined_at", lookup_expr='date__gte')
    joined_before = django_filters.DateFilter(field_name="joined_at", lookup_expr='date__lte')
    is_active = django_filters.BooleanFilter(field_name="is_active")

    class Meta:
        model = Customer
        fields = ['is_active', 'min_points', 'max_points', 'joined_after', 'joined_before']
