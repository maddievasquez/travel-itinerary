from rest_framework import serializers
from .models import Itinerary
from server.apps.activity.serializers import ActivitySerializer

class ItinerarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Itinerary
        fields = ['id', 'user', 'title', 'city', 'start_date', 'end_date', 'description', 
                 'activities', 'created_at', 'updated_at', 'is_bookmarked', 'bookmark_count']
        read_only_fields = ('user',)  # User should be auto-set
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Delay the import of ActivitySerializer
        self.fields['activities'] = ActivitySerializer(many=True, read_only=True)
    
    def validate(self, data):
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError("Start date cannot be later than end date.")
        return data
    
    is_bookmarked = serializers.SerializerMethodField()
    bookmark_count = serializers.SerializerMethodField()
    
    def get_is_bookmarked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.is_bookmarked_by(request.user)
        return False
        
    def get_bookmark_count(self, obj):
        return obj.bookmarks.count()