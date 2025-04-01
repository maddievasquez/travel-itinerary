from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from math import radians, sin, cos, sqrt, atan2
import random
from datetime import datetime, timedelta

from .models import Location
from .serializers import LocationSerializer
from server.apps.activity.activity_templates import ACTIVITY_TEMPLATES
from server.apps.activity.models import Activity
from server.apps.itinerary.models import Itinerary
from server.apps.itinerary.serializers import ItinerarySerializer
from server.apps.activity.serializers import ActivitySerializer

class LocationListView(generics.ListAPIView):
    """List locations for a specific city with filtering"""
    serializer_class = LocationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        city = self.request.query_params.get('city', '').strip()
        category = self.request.query_params.get('category', '').strip()
        
        queryset = Location.objects.all()
        if city:
            queryset = queryset.filter(city__iexact=city)
        if category:
            queryset = queryset.filter(category__iexact=category)
        
        return queryset.order_by('name')

def calculate_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two points using Haversine formula"""
    R = 6371  # Earth radius in km
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    return R * (2 * atan2(sqrt(a), sqrt(1-a)))

class LocationClusterAPIView(APIView):
    """Group nearby locations for itinerary planning"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        city = request.query_params.get('city')
        if not city:
            return Response(
                {"error": "City parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        locations = Location.objects.filter(city__iexact=city)
        if not locations.exists():
            return Response(
                {"error": "No locations found for specified city"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Simple clustering - for production use a proper clustering algorithm
        clusters = []
        used_ids = set()
        
        for loc in locations:
            if loc.id in used_ids:
                continue
                
            cluster = [loc]
            used_ids.add(loc.id)
            
            for other in locations:
                if (other.id not in used_ids and 
                    calculate_distance(
                        float(loc.latitude), float(loc.longitude),
                        float(other.latitude), float(other.longitude)
                    ) < 5):  # 5km radius
                    cluster.append(other)
                    used_ids.add(other.id)
            
            clusters.append({
                "center": {
                    "latitude": sum(float(l.latitude) for l in cluster)/len(cluster),
                    "longitude": sum(float(l.longitude) for l in cluster)/len(cluster)
                },
                "locations": LocationSerializer(cluster, many=True).data
            })

        return Response({"clusters": clusters})

class GenerateItineraryAPIView(APIView):
    """Generate complete itinerary with optimized locations and activities"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        REQUIRED_FIELDS = ['city', 'start_date', 'end_date', 'location_ids']
        if any(field not in request.data for field in REQUIRED_FIELDS):
            return Response(
                {"error": f"Required fields: {', '.join(REQUIRED_FIELDS)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Validate and parse input
            location_ids = request.data['location_ids']
            if not isinstance(location_ids, list) or len(location_ids) == 0:
                raise ValueError("location_ids must be a non-empty list")

            start_date = datetime.strptime(request.data['start_date'], "%Y-%m-%d").date()
            end_date = datetime.strptime(request.data['end_date'], "%Y-%m-%d").date()
            if start_date > end_date:
                raise ValueError("Start date must be before end date")

            num_days = (end_date - start_date).days + 1
            locations = Location.objects.filter(id__in=location_ids)
            if locations.count() != len(location_ids):
                raise ValueError("Some location IDs were invalid")

            # Create itinerary
            itinerary = Itinerary.objects.create(
                user=request.user,
                title=f"{request.data['city']} Trip - {start_date} to {end_date}",
                city=request.data['city'],
                start_date=start_date,
                end_date=end_date
            )

            # Distribute locations across days
            itinerary_data = []
            locations_per_day = max(1, min(4, len(locations) // num_days))
            
            for day in range(num_days):
                date = start_date + timedelta(days=day)
                day_locations = locations[day*locations_per_day : (day+1)*locations_per_day]
                
                activities = []
                for loc in day_locations:
                    activity = Activity.objects.create(
                        itinerary=itinerary,
                        location=loc,
                        description=f"Visit {loc.name}",
                        date=date,
                        start_time="10:00",
                        end_time="16:00"
                    )
                    activities.append(activity)
                
                itinerary_data.append({
                    "day": day + 1,
                    "date": date,
                    "locations": LocationSerializer(day_locations, many=True).data,
                    "activities": ActivitySerializer(activities, many=True).data
                })

            return Response({
                "itinerary": ItinerarySerializer(itinerary).data,
                "days": itinerary_data
            }, status=status.HTTP_201_CREATED)

        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": "Failed to generate itinerary"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    """Group nearby locations for itinerary planning"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        city = request.query_params.get('city')
        if not city:
            return Response(
                {"error": "City parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        locations = Location.objects.filter(city__iexact=city)
        if not locations.exists():
            return Response(
                {"error": "No locations found for specified city"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Simple clustering - for production use a proper clustering algorithm
        clusters = []
        used_ids = set()
        
        for loc in locations:
            if loc.id in used_ids:
                continue
                
            cluster = [loc]
            used_ids.add(loc.id)
            
            for other in locations:
                if (other.id not in used_ids and 
                    calculate_distance(
                        float(loc.latitude), float(loc.longitude),
                        float(other.latitude), float(other.longitude)
                    ) < 5):  # 5km radius
                    cluster.append(other)
                    used_ids.add(other.id)
            
            clusters.append({
                "center": {
                    "latitude": sum(float(l.latitude) for l in cluster)/len(cluster),
                    "longitude": sum(float(l.longitude) for l in cluster)/len(cluster)
                },
                "locations": LocationSerializer(cluster, many=True).data
            })

        return Response({"clusters": clusters})

# import openai
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
# from rest_framework import status
# from datetime import datetime, timedelta
# import random
# from math import radians, sin, cos, sqrt, atan2

# from server import settings
# from server.apps.activity.activity_templates import ACTIVITY_TEMPLATES  # Import templates
# from server.apps.activity.models import Activity
# from server.apps.itinerary.models import Itinerary
# from server.apps.location.models import Location  # Assuming Location is in a separate app
# from server.apps.activity.serializers import ActivitySerializer
# from server.apps.itinerary.serializers import ItinerarySerializer
# from server.apps.location.serializers import LocationSerializer


# # ✅ Utility Function: Haversine Formula for Distance Calculation
# def calculate_distance(lat1, lon1, lat2, lon2):
#     """Calculate the distance between two points on Earth using the Haversine formula."""
#     R = 6371  # Earth radius in km
#     lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
#     dlat, dlon = lat2 - lat1, lon2 - lon1
#     a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
#     c = 2 * atan2(sqrt(a), sqrt(1 - a))
#     return R * c  # Distance in km


# # Utility Function: Generate Itinerary
# def generate_itinerary(locations, num_days):
#     """Distribute locations over days (max 3-4 per day)."""
#     if not locations or num_days <= 0:
#         return []

#     itinerary, used = [], set()
#     locations = list(locations)

#     daily_limit = 4  # Maximum locations per day
#     locations_per_day = max(3, min(daily_limit, len(locations) // num_days))

#     day = 1
#     while len(used) < len(locations) and day <= num_days:
#         day_locations = []
#         start_loc = next((loc for loc in locations if loc.id not in used), None)
#         if not start_loc:
#             break
#         day_locations.append(start_loc)
#         used.add(start_loc.id)

#         for loc in locations:
#             if loc.id not in used:
#                 dist = calculate_distance(
#                     float(start_loc.latitude), float(start_loc.longitude),
#                     float(loc.latitude), float(loc.longitude)
#                 )
#                 if dist < 15:  # Locations within 15 km
#                     day_locations.append(loc)
#                     used.add(loc.id)
#                 if len(day_locations) >= locations_per_day:
#                     break

#         itinerary.append({"day": day, "locations": LocationSerializer(day_locations, many=True).data})
#         day += 1

#     return itinerary


# # ✅ Utility Function: Generate Itinerary with Activities
# def generate_itinerary_with_activities(user, city, start_date, end_date, locations):
#     """Creates an itinerary and assigns activities using predefined templates."""
#     try:
#         start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
#         end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
#     except ValueError as e:
#         raise ValueError("Invalid date format. Use YYYY-MM-DD") from e

#     itinerary = Itinerary.objects.create(
#         user=user,
#         title=f"{city} Trip {start_date} - {end_date}",
#         city=city,
#         start_date=start_date,
#         end_date=end_date,
#         description=f"Auto-generated itinerary for {city}."
#     )

#     num_days = (end_date - start_date).days + 1
#     itinerary_data, used = [], set()
#     locations = list(locations)

#     daily_limit = 4
#     locations_per_day = max(3, min(daily_limit, len(locations) // num_days))

#     day = 1
#     while len(used) < len(locations) and day <= num_days:
#         day_locations = []
#         start_loc = next((loc for loc in locations if loc.id not in used), None)
#         if not start_loc:
#             break
#         day_locations.append(start_loc)
#         used.add(start_loc.id)

#         for loc in locations:
#             if loc.id not in used:
#                 dist = calculate_distance(
#                     float(start_loc.latitude), float(start_loc.longitude),
#                     float(loc.latitude), float(loc.longitude)
#                 )
#                 if dist < 15:
#                     day_locations.append(loc)
#                     used.add(loc.id)
#                 if len(day_locations) >= locations_per_day:
#                     break

#         activities = []
#         for loc in day_locations:
#             category = loc.category if hasattr(loc, "category") and loc.category in ACTIVITY_TEMPLATES else "general"
#             template_choices = ACTIVITY_TEMPLATES.get(category, ["Explore {name}"])
#             activity_desc = random.choice(template_choices).format(name=loc.name)

#             activity = Activity.objects.create(
#                 itinerary=itinerary,
#                 location=loc,
#                 description=activity_desc,
#                 date=start_date + timedelta(days=day - 1),
#                 start_time="10:00",
#                 end_time="18:00",
#                 cost=random.randint(10, 50),
#                 category=category,
#                 city=city
#             )
#             activities.append(activity)

#         itinerary_data.append({
#             "day": day,
#             "locations": LocationSerializer(day_locations, many=True).data,
#             "activities": ActivitySerializer(activities, many=True).data
#         })
#         day += 1

#     return itinerary, itinerary_data


# # Class-Based API View: Generate Itinerary
# class GenerateItineraryAPIView(APIView):
#     """Handles itinerary generation."""

#     def post(self, request):
#         print("Received request to generate itinerary")  # Debugging log
#         user = request.user
#         city = request.data.get("city")
#         start_date = request.data.get("start_date")
#         end_date = request.data.get("end_date")
#         is_premium = user.is_premium  # Assuming you have a field to check premium status

#         if not city or not start_date or not end_date:
#             return Response({"error": "City, start_date, and end_date are required"}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             if is_premium:
#                 itinerary_text = generate_itinerary_with_chatgpt(city, start_date, end_date)
#                 if itinerary_text:
#                     return Response({
#                         "itinerary_text": itinerary_text,
#                     }, status=status.HTTP_200_OK)
#                 else:
#                     return Response({"error": "Failed to generate itinerary"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#             else:
#                 locations = Location.objects.filter(city__iexact=city).only(
#     'id', 'name', 'latitude', 'longitude', 'address', 'category'
# )
#                 print("First location category:", locations.first().category)
#                 if not locations:
#                     return Response({"error": "No locations found for the specified city"}, status=status.HTTP_404_NOT_FOUND)

#                 itinerary, itinerary_data = generate_itinerary_with_activities(user, city, start_date, end_date, locations)
#                 print("Itinerary created:", itinerary.id)  # Debugging log
                

#                 print("FINAL OUTPUT CATEGORIES CHECK:")
#                 for day in itinerary_data:
#                     for loc in day['locations']:
#                         print(f"{loc['name']}: {loc.get('category', 'MISSING')}")

#             return Response({
#                 "itinerary": ItinerarySerializer(itinerary).data,
#                 "days": itinerary_data
#             }, status=status.HTTP_201_CREATED)
#         except ValueError as e:
#             print("Error:", e)
#             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             print("Error:", e)
#             return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# # ✅ Class-Based API View: Get Itinerary Details
# class ItineraryDetailAPIView(APIView):
#     """Fetch itinerary details along with activities."""
#     permission_classes = [IsAuthenticated]

#     def get(self, request, itinerary_id):
#         try:
#             itinerary = Itinerary.objects.get(id=itinerary_id, user=request.user)
#         except Itinerary.DoesNotExist:
#             return Response({"error": "Itinerary not found"}, status=status.HTTP_404_NOT_FOUND)

#         activities = itinerary.activities.all()
#         return Response({
#             "itinerary": ItinerarySerializer(itinerary).data,
#             "activities": ActivitySerializer(activities, many=True).data
#         })


# # Function to generate itinerary using ChatGPT
# def generate_itinerary_with_chatgpt(city, start_date, end_date):
#     """Generate an itinerary using OpenAI's ChatGPT API."""
#     # Construct prompt for ChatGPT
#     prompt = f"Create a detailed itinerary for a trip to {city} from {start_date} to {end_date}. Include recommended activities, their time slots, and estimated costs for each activity. Provide a structured format for each day of the trip."

#     try:
#         # Call OpenAI's ChatGPT API
#         response = openai.Completion.create(
#             model="text-davinci-003",  # Or the latest available model
#             prompt=prompt,
#             max_tokens=1500,  # Adjust based on how detailed you want the response
#             temperature=0.7,  # Control randomness
#         )
#         # Extract the generated text from the response
#         itinerary_text = response.choices[0].text.strip()
#         return itinerary_text
#     except Exception as e:
#         print(f"Error with OpenAI API: {e}")
#         return None


# # Set your OpenAI API key (secure it in settings)
# openai.api_key = settings.OPENAI_API_KEY