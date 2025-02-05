# location/serializers.py
from rest_framework import serializers
from .models import Location

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['name', 'address', 'latitude', 'longitude', 'category', 'city']
