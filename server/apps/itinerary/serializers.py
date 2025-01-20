# itinerary/serializers.py
from rest_framework import serializers
from .models import Itinerary

class ItinerarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Itinerary
        fields = ['user', 'title', 'city', 'start_date', 'end_date', 'description', 'created_at', 'updated_at']
