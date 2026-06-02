import django_filters
from .models import Staff

class StaffFilter(django_filters.FilterSet):
    department = django_filters.CharFilter(field_name="department", lookup_expr='iexact')
    designation = django_filters.CharFilter(field_name="designation", lookup_expr='iexact')
    is_active = django_filters.BooleanFilter(field_name="is_active")
    joining_after = django_filters.DateFilter(field_name="joining_date", lookup_expr='gte')
    joining_before = django_filters.DateFilter(field_name="joining_date", lookup_expr='lte')

    class Meta:
        model = Staff
        fields = ['department', 'designation', 'is_active', 'joining_after', 'joining_before']
