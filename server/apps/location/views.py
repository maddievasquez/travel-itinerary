from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Location
from server.apps.activity.models import Activity  # Import Activity model from activity app
from .serializers import LocationSerializer
from server.apps.activity.serializers import ActivitySerializer  # Import ActivitySerializer from activity app
from .filters import LocationFilter  # Import your custom filter
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import JsonResponse
from math import radians, sin, cos, sqrt, atan2
from django.views.decorators.csrf import csrf_exempt
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

def calculate_distance(lat1, lon1, lat2, lon2):
    """Calculate the great-circle distance between two points using Haversine formula."""
    R = 6371  # Radius of the Earth in km
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c  # Distance in km
@csrf_exempt  # 👈 This disables CSRF verification for this endpoint
def generate_itinerary(locations):
    """Distribute locations across days based on proximity (max 3-4 locations per day)."""
    itinerary = []
    used = set()
    locations = sorted(locations, key=lambda loc: (loc.latitude, loc.longitude))  # Sort by lat/lon

    day = 1
    while len(used) < len(locations):
        day_locations = []
        start_loc = next((loc for loc in locations if loc.id not in used), None)
        if not start_loc:
            break
        day_locations.append(start_loc)
        used.add(start_loc.id)

        # Assign closest locations to the same day
        for loc in locations:
            if loc.id not in used:
                dist = calculate_distance(
                    start_loc.latitude, start_loc.longitude,
                    loc.latitude, loc.longitude
                )
                if dist < 10:  # Example: If within 10 km, assign same day
                    day_locations.append(loc)
                    used.add(loc.id)
                if len(day_locations) >= 4:
                    break

        itinerary.append({"day": day, "locations": LocationSerializer(day_locations, many=True).data})
        day += 1

    return itinerary

def get_itinerary(request):
    city = request.GET.get('city')
    if not city:
        return JsonResponse({'error': 'City parameter is required'}, status=400)

    locations = Location.objects.filter(city__iexact=city)
    itinerary = generate_itinerary(locations)

    return JsonResponse({"itinerary": itinerary})