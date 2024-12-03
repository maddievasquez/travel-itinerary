import django_filters
from .models import Location

class LocationFilter(django_filters.FilterSet):
    city = django_filters.CharFilter(lookup_expr='icontains')  # Filter by city name

    class Meta:
        model = Location
        fields = ['city']  # Available filter fields
