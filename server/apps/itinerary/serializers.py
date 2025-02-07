from rest_framework import serializers
from .models import Itinerary

class ItinerarySerializer(serializers.ModelSerializer):
    # Import ActivitySerializer only when needed to avoid circular import
    activities = None

    class Meta:
        model = Itinerary
        fields = ['user', 'title', 'city', 'start_date', 'end_date', 'description', 'activities', 'created_at', 'updated_at']

    def __init__(self, *args, **kwargs):
        # Delay the import of ActivitySerializer
        from server.apps.activity.serializers import ActivitySerializer
        self.fields['activities'] = ActivitySerializer(many=True, read_only=True)
        super().__init__(*args, **kwargs)

    def validate(self, data):
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError("Start date cannot be later than end date.")
        return data
