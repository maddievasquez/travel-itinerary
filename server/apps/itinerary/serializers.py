# itinerary/serializers.py
from rest_framework import serializers
from .models import Itinerary

class ItinerarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Itinerary
        fields = '__all__'
