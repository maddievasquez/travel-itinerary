# activity/serializers.py
from rest_framework import serializers
from .models import Activity

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['description', 'date', 'start_time', 'end_time', 'cost', 'category', 'city']
