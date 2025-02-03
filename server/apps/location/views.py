from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Location, Activity  # Assuming your Location and Activity models are in models.py
from .serializers import LocationSerializer, ActivitySerializer  # Assuming you have serializers for Location and Activity
from .filters import LocationFilter  # Import your custom filter
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import JsonResponse

# Location List View - to get all locations
class LocationListView(generics.ListAPIView):
    queryset = Location.objects.all()
    permission_classes = [AllowAny]  # Uncomment if we want to see results without being logged in
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

# Get options by city and date
def get_options_by_city(request):
    city = request.GET.get('city')  # Get city from query parameter
    start_date = request.GET.get('startDate')
    end_date = request.GET.get('endDate')

    if not city:
        return JsonResponse({'error': 'City parameter is required'}, status=400)

    # Fetch locations and activities in the city
    locations = Location.objects.filter(city__iexact=city)
    activities = Activity.objects.filter(city__iexact=city)

    # Optionally filter by date if provided
    if start_date and end_date:
        activities = activities.filter(date__range=[start_date, end_date])

    # Use serializers to format the data
    location_data = LocationSerializer(locations, many=True).data
    activity_data = ActivitySerializer(activities, many=True).data

    return JsonResponse({
        'locations': location_data,
        'activities': activity_data,
    })