from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Location
from server.apps.activity.models import Activity
from server.apps.itinerary.models import Itinerary
from .serializers import LocationSerializer
from server.apps.activity.serializers import ActivitySerializer
from math import radians, sin, cos, sqrt, atan2
from datetime import datetime, timedelta
from rest_framework.permissions import AllowAny, IsAuthenticated
import random
import googlemaps
from django.conf import settings

# Initialize the Google Maps client with the API key from the environment variable
gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)

# ✅ Function to calculate distance using Haversine formula
def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c  # Distance in km

# Function to get place details from Google Places API
def get_place_details(place_name, city):
    """Retrieve place details from Google Places API."""
    query = f"{place_name}, {city}"
    places_result = gmaps.places(query=query)
    if places_result['status'] == 'OK' and places_result['results']:
        place_id = places_result['results'][0]['place_id']
        place_details = gmaps.place(place_id=place_id)
        return place_details.get('result', {})
    return {}

# Function to generate itinerary based on number of days
def generate_itinerary(locations, num_days):
    """Distribute locations evenly over the number of days (3-4 locations per day)."""
    itinerary = []
    used = set()
    locations = list(locations)

    # Ensure locations are shuffled to avoid clustering the same type of spots
    locations.sort(key=lambda loc: (loc.latitude, loc.longitude))  

    daily_limit = 4  # ⬅ Increase max locations per day to 4
    locations_per_day = max(3, min(daily_limit, len(locations) // num_days))

    day = 1
    while len(used) < len(locations) and day <= num_days:
        day_locations = []
        start_loc = next((loc for loc in locations if loc.id not in used), None)
        if not start_loc:
            break
        day_locations.append(start_loc)
        used.add(start_loc.id)

        for loc in locations:
            if loc.id not in used:
                dist = calculate_distance(
                    float(start_loc.latitude), float(start_loc.longitude),
                    float(loc.latitude), float(loc.longitude)
                )
                if dist < 15:  # ⬅ Increase distance threshold for diversity
                    day_locations.append(loc)
                    used.add(loc.id)
                if len(day_locations) >= locations_per_day:
                    break

        itinerary.append({
            "day": day,
            "locations": LocationSerializer(day_locations, many=True).data
        })
        day += 1

    return itinerary

# Function to generate itinerary with activities
def generate_itinerary_with_activities(user, city, start_date, end_date, locations):
    """Generates an itinerary and auto-populates activities."""
    itinerary = Itinerary.objects.create(
        user=user,
        title=f"{city} Trip {start_date} - {end_date}",
        city=city,
        start_date=start_date,
        end_date=end_date,
        description=f"Generated itinerary for {city}."
    )

    num_days = (end_date - start_date).days + 1
    used = set()
    locations = list(locations)
    locations.sort(key=lambda loc: (float(loc.latitude), float(loc.longitude)))  

    daily_limit = 4  # Max 4 locations per day
    locations_per_day = max(3, min(daily_limit, len(locations) // num_days))

    day = 1
    itinerary_data = []

    while len(used) < len(locations) and day <= num_days:
        day_locations = []
        start_loc = next((loc for loc in locations if loc.id not in used), None)
        if not start_loc:
            break
        day_locations.append(start_loc)
        used.add(start_loc.id)

        for loc in locations:
            if loc.id not in used:
                dist = calculate_distance(
                    float(start_loc.latitude), float(start_loc.longitude),
                    float(loc.latitude), float(loc.longitude)
                )
                if dist < 15:
                    day_locations.append(loc)
                    used.add(loc.id)
                if len(day_locations) >= locations_per_day:
                    break

        activities = []
        for loc in day_locations:
            activity_desc = random.choice(ACTIVITY_TEMPLATES.get(loc.category, ["Explore {name}"])).format(name=loc.name)
            place_details = get_place_details(loc.name, city)
            price_level = place_details.get('price_level', random.randint(1, 4))  # Random price level if not available
            activity = Activity.objects.create(
                itinerary=itinerary,
                location=loc,
                description=activity_desc,
                date=start_date + timedelta(days=day - 1),
                start_time="10:00",
                end_time="18:00",
                cost=price_level * 10,  # Example: Convert price level to cost
                category=loc.category,
                city=city
            )
            activities.append(activity)

        itinerary_data.append({
            "day": day,
            "locations": LocationSerializer(day_locations, many=True).data,
            "activities": ActivitySerializer(activities, many=True).data
        })
        day += 1

    return itinerary_data

# ✅ API to Generate Itinerary
@method_decorator(csrf_exempt, name='dispatch')  # Disable CSRF for API requests
class GenerateItinerary(APIView):
    permission_classes = [AllowAny]  # Allow public access

    def get(self, request):
        city = request.GET.get('city')
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')

        if not city or not start_date or not end_date:
            return Response({'error': 'City, start_date, and end_date are required'}, status=400)

        try:
            start_date_obj = datetime.strptime(start_date, "%Y-%m-%d")
            end_date_obj = datetime.strptime(end_date, "%Y-%m-%d")
            num_days = (end_date_obj - start_date_obj).days + 1  # Calculate trip duration
        except ValueError:
            return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=400)

        if num_days <= 0:
            return Response({'error': 'End date must be after start date'}, status=400)

        locations = Location.objects.filter(city__iexact=city)
        if not locations.exists():
            return Response({'error': f'No locations found in {city}'}, status=404)

        itinerary = generate_itinerary(locations, num_days)
        return Response({"itinerary": itinerary}, status=200)

    def post(self, request):
        city = request.data.get("city")
        start_date = request.data.get("start_date")
        end_date = request.data.get("end_date")

        if not city or not start_date or not end_date:
            return Response({'error': 'City, start_date, and end_date are required'}, status=400)

        try:
            start_date_obj = datetime.strptime(start_date, "%Y-%m-%d")
            end_date_obj = datetime.strptime(end_date, "%Y-%m-%d")
            num_days = (end_date_obj - start_date_obj).days + 1  # Calculate trip duration
        except ValueError:
            return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=400)

        if num_days <= 0:
            return Response({'error': 'End date must be after start date'}, status=400)

        locations = Location.objects.filter(city__iexact=city)
        if not locations.exists():
            return Response({'error': f'No locations found in {city}'}, status=404)

        itinerary = generate_itinerary(locations, num_days)
        return Response({"itinerary": itinerary}, status=200)