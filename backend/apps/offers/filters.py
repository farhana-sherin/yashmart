import django_filters
from .models import Offer

class OfferFilter(django_filters.FilterSet):
    start_date = django_filters.DateFilter(field_name="start_date", lookup_expr='date__gte')
    end_date = django_filters.DateFilter(field_name="end_date", lookup_expr='date__lte')
    is_active = django_filters.BooleanFilter(field_name="is_active")

    class Meta:
        model = Offer
        fields = ['is_active', 'start_date', 'end_date']
