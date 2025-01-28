# location/views.py
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Location  # Assuming your Location model is in models.py
from .serializers import LocationSerializer  # Assuming you have a serializer for Location
from .filters import LocationFilter  # Import your custom filter
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import JsonResponse
from rest_framework.renderers import JSONRenderer
from .models import Activity  # Assuming your Activity model is in models.py
from .serializers import ActivitySerializer  # Assuming you have a serializer for Activity
from .serializers import LocationSerializer
from .models import Location
# Location List View - to get all locations
# List view with filters for Location
class LocationListView(generics.ListAPIView):
    queryset = Location.objects.all()
    permission_classes = [AllowAny] # uncomment if we want to see results without being logged in
    serializer_class = LocationSerializer
    filter_backends = [DjangoFilterBackend]  # Enable filtering
    filterset_class = LocationFilter  # Use the custom filter class

# Locations by City View - to filter locations based on the city
class LocationsByCityView(APIView):
    def get(self, request, city_name):
        """Returns a list of locations filtered by the city."""
        locations = Location.objects.filter(city__iexact=city_name)
        serializer = LocationSerializer(locations, many=True)
        return Response(serializer.data)
    

def get_options_by_city(request):
    city = request.GET.get('city')  # Get city from query parameter

    if not city:
        return JsonResponse({'error': 'City parameter is required'}, status=400)

    # Fetch locations and activities in the city
    locations = Location.objects.filter(city__iexact=city)
    activities = Activity.objects.filter(city__iexact=city)

    # Use serializers to format the data
    location_data = LocationSerializer(locations, many=True).data
    activity_data = ActivitySerializer(activities, many=True).data

    return JsonResponse({
        'locations': location_data,
        'activities': activity_data,
    })