from rest_framework import serializers
from .models import Activity
from server.apps.location.serializers import LocationSerializer
from server.apps.itinerary.models import Itinerary  # Avoid circular import here

class ActivitySerializer(serializers.ModelSerializer):
    location = LocationSerializer()
    itinerary = serializers.PrimaryKeyRelatedField(queryset=Itinerary.objects.all())
    date = serializers.DateField(format="%Y-%m-%d") 
    class Meta:
        model = Activity
        fields = ['description', 'date', 'start_time', 'end_time', 'cost', 'category', 'city', 'location', 'itinerary']

    def validate_cost(self, value):
        if value < 0:
            raise serializers.ValidationError("Cost must be a positive number.")
        return value
