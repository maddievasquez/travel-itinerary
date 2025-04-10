# In serializers.py
from rest_framework import serializers
from .models import Bookmark, Itinerary

class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = ['id', 'user', 'itinerary', 'created_at']
        read_only_fields = ['id', 'created_at']