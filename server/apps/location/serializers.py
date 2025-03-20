# location/serializers.py
from rest_framework import serializers
from .models import Location

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['name', 'address', 'latitude', 'longitude', 'category', 'city']


# from server.apps.location.models import Location

# city_name = "Tokyo"
# locations = Location.objects.filter(city__iexact=city_name)

# for loc in locations:
#     print(f"Location: {loc.name}, Lat: {loc.latitude}, Lon: {loc.longitude}")
