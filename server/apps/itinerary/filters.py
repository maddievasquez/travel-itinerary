import django_filters
from .models import Itinerary

class ItineraryFilter(django_filters.FilterSet):
    city = django_filters.CharFilter(lookup_expr='icontains')  # Case-insensitive city filter
    start_date = django_filters.DateFilter(field_name='start_date', lookup_expr='gte')  # Start date >=
    end_date = django_filters.DateFilter(field_name='end_date', lookup_expr='lte')  # End date <=

    class Meta:
        model = Itinerary
        fields = ['city', 'start_date', 'end_date']  # Fields available for filtering
