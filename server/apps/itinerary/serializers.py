from rest_framework import serializers
from .models import Itinerary
from server.apps.activity.serializers import ActivitySerializer

class ItinerarySerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)  # Important
    class Meta:
        model = Itinerary
        fields = ['id', 'user', 'title', 'city', 'start_date', 'end_date', 'description', 
                 'activities', 'created_at', 'updated_at', 'is_bookmarked', 'bookmark_count']
        # read_only_fields = ('user',) 
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Delay the import of ActivitySerializer
        self.fields['activities'] = ActivitySerializer(many=True, read_only=True)
    
    def validate(self, data):
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError("Start date cannot be later than end date.")
        return data
    def validate_start_date(self, value):
        if value is None:
             raise serializers.ValidationError("Start date cannot be null")
        return value

def validate_end_date(self, value):
    if value is None:
        raise serializers.ValidationError("End date cannot be null")
    return value
    is_bookmarked = serializers.SerializerMethodField()
    bookmark_count = serializers.SerializerMethodField()
    
    def get_is_bookmarked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.is_bookmarked_by(request.user)
        return False
        
    def get_bookmark_count(self, obj):
        return obj.bookmarks.count()