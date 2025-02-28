import openai
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from datetime import datetime, timedelta
import random
from math import radians, sin, cos, sqrt, atan2


from server import settings
from server.apps.activity.activity_templates import ACTIVITY_TEMPLATES  # Import templates
from server.apps.activity.models import Activity
from server.apps.itinerary.models import Itinerary
from server.apps.location.models import Location  # Assuming Location is in a separate app
from server.apps.activity.serializers import ActivitySerializer
from server.apps.itinerary.serializers import ItinerarySerializer
from server.apps.location.serializers import LocationSerializer


# ✅ Utility Function: Haversine Formula for Distance Calculation
def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat, dlon = lat2 - lat1, lon2 - lon1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c  # Distance in km


# ✅ Utility Function: Generate Itinerary
def generate_itinerary(locations, num_days):
    """Distribute locations over days (max 3-4 per day)."""
    itinerary, used = [], set()
    locations = list(locations)

    daily_limit = 4  # Maximum locations per day
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
                if dist < 15:  # Locations within 15 km
                    day_locations.append(loc)
                    used.add(loc.id)
                if len(day_locations) >= locations_per_day:
                    break

        itinerary.append({"day": day, "locations": LocationSerializer(day_locations, many=True).data})
        day += 1

    return itinerary


# ✅ Utility Function: Generate Itinerary with Activities




def generate_itinerary_with_activities(user, city, start_date, end_date, locations):
    """Creates an itinerary and assigns activities using predefined templates."""
    start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
    end_date = datetime.strptime(end_date, "%Y-%m-%d").date()

    itinerary = Itinerary.objects.create(
        user=user,
        title=f"{city} Trip {start_date} - {end_date}",
        city=city,
        start_date=start_date,
        end_date=end_date,
        description=f"Auto-generated itinerary for {city}."
    )

    num_days = (end_date - start_date).days + 1
    itinerary_data, used = [], set()
    locations = list(locations)

    daily_limit = 4
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
                if dist < 15:
                    day_locations.append(loc)
                    used.add(loc.id)
                if len(day_locations) >= locations_per_day:
                    break

        activities = []
        for loc in day_locations:
            # ✅ Ensure `loc.category` exists, otherwise use a default category
            category = loc.category if hasattr(loc, "category") and loc.category in ACTIVITY_TEMPLATES else "general"
            template_choices = ACTIVITY_TEMPLATES.get(category, ["Explore {name}"])
            activity_desc = random.choice(template_choices).format(name=loc.name)

            activity = Activity.objects.create(
                itinerary=itinerary,
                location=loc,
                description=activity_desc,  # ✅ Now correctly formatted
                date=start_date + timedelta(days=day - 1),
                start_time="10:00",
                end_time="18:00",
                cost=random.randint(10, 50),
                category=category,
                city=city
            )
            activities.append(activity)

        itinerary_data.append({
            "day": day,
            "locations": LocationSerializer(day_locations, many=True).data,
            "activities": ActivitySerializer(activities, many=True).data
        })
        day += 1

    return itinerary, itinerary_data




# ✅ Class-Based API View: Generate Itinerary
class GenerateItineraryAPIView(APIView):
    """Handles itinerary generation."""

    def post(self, request):
        user = request.user
        city = request.data.get("city")
        start_date = request.data.get("start_date")
        end_date = request.data.get("end_date")
        is_premium = user.is_premium  # Assuming you have a field to check premium status

        if not city or not start_date or not end_date:
            return Response({"error": "City, start_date, and end_date are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if is_premium:
                itinerary_text = generate_itinerary_with_chatgpt(city, start_date, end_date)
                if itinerary_text:
                    return Response({
                        "itinerary_text": itinerary_text,
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "Failed to generate itinerary"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                itinerary, itinerary_data = generate_itinerary_with_activities(
    user, city, start_date, end_date, Location.objects.filter(city__iexact=city)
)

                return Response({
                    "itinerary": ItinerarySerializer(itinerary).data,
                    "days": itinerary_data
                }, status=status.HTTP_201_CREATED)
        except Exception as e:
            print("Error:", e)
            return Response({"error": "Invalid date format. Use YYYY-MM-DD"}, status=status.HTTP_400_BAD_REQUEST)



# ✅ Class-Based API View: Get Itinerary Details
class ItineraryDetailAPIView(APIView):
    """Fetch itinerary details along with activities."""
    permission_classes = [IsAuthenticated]

    def get(self, request, itinerary_id):
        try:
            itinerary = Itinerary.objects.get(id=itinerary_id, user=request.user)
        except Itinerary.DoesNotExist:
            return Response({"error": "Itinerary not found"}, status=status.HTTP_404_NOT_FOUND)

        activities = itinerary.activities.all()
        return Response({
            "itinerary": ItinerarySerializer(itinerary).data,
            "activities": ActivitySerializer(activities, many=True).data
        })
# Set your OpenAI API key (secure it in settings)
openai.api_key = settings.OPENAI_API_KEY

# Function to generate itinerary using ChatGPT
def generate_itinerary_with_chatgpt(city, start_date, end_date):
    # Construct prompt for ChatGPT
    prompt = f"Create a detailed itinerary for a trip to {city} from {start_date} to {end_date}. Include recommended activities, their time slots, and estimated costs for each activity. Provide a structured format for each day of the trip."

    try:
        # Call OpenAI's ChatGPT API
        response = openai.Completion.create(
            model="text-davinci-003",  # Or the latest available model
            prompt=prompt,
            max_tokens=1500,  # Adjust based on how detailed you want the response
            temperature=0.7,  # Control randomness
        )
        # Extract the generated text from the response
        itinerary_text = response.choices[0].text.strip()
        return itinerary_text
    except Exception as e:
        print(f"Error with OpenAI API: {e}")
        return None
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator
# from rest_framework.permissions import IsAuthenticated, AllowAny
# from rest_framework.decorators import api_view, permission_classes

# from server.apps.activity.activity_templates import ACTIVITY_TEMPLATES
# from .models import Location
# from server.apps.activity.models import Activity
# from server.apps.itinerary.models import Itinerary
# from .serializers import LocationSerializer
# from server.apps.activity.serializers import ActivitySerializer
# from server.apps.itinerary.serializers import ItinerarySerializer
# from math import radians, sin, cos, sqrt, atan2
# from datetime import datetime, timedelta
# import random


# # ✅ Function to calculate distance using Haversine formula
# def calculate_distance(lat1, lon1, lat2, lon2):
#     R = 6371  # Earth radius in km
#     lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
#     dlat = lat2 - lat1
#     dlon = lon2 - lon1
#     a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
#     c = 2 * atan2(sqrt(a), sqrt(1 - a))
#     return R * c  # Distance in km


# # ✅ Function to evenly distribute locations across days
# def generate_itinerary(locations, num_days):
#     """Distribute locations over days (max 3-4 per day)."""
#     itinerary = []
#     used = set()
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
#                 if dist < 15:  # Locations within 15 km of each other
#                     day_locations.append(loc)
#                     used.add(loc.id)
#                 if len(day_locations) >= locations_per_day:
#                     break

#         itinerary.append({
#             "day": day,
#             "locations": LocationSerializer(day_locations, many=True).data
#         })
#         day += 1

#     return itinerary


# # ✅ Function to generate an itinerary with activities
# def generate_itinerary_with_activities(user, city, start_date, end_date, locations):
#     """Creates an itinerary and auto-populates activities."""
    
#     start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
#     end_date = datetime.strptime(end_date, "%Y-%m-%d").date()

#     itinerary = Itinerary.objects.create(
#         user=user,
#         title=f"{city} Trip {start_date} - {end_date}",
#         city=city,
#         start_date=start_date,
#         end_date=end_date,
#         description=f"Auto-generated itinerary for {city}."
#     )

#     num_days = (end_date - start_date).days + 1
#     itinerary_data = []
#     used = set()
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
#             # ✅ Generate activity based on category
#             # Modify how activity descriptions are generated using templates
#             activity_desc = random.choice(ACTIVITY_TEMPLATES.get(loc.category, ["Explore {name}"])).format(name=loc.name)


#             activity = Activity.objects.create(
#                 itinerary=itinerary,
#                 location=loc,
#                 description=activity_desc,
#                 date=start_date + timedelta(days=day - 1),
#                 start_time="10:00",
#                 end_time="18:00",
#                 cost=random.randint(10, 50),  # Generate a random cost for variety
#                 category=loc.category,
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


# # ✅ API to Generate Itinerary

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])  # Requires authentication
# def generate_itinerary_api(request):
#     """Handles POST request to create an itinerary with activities."""
#     print('user: ', request.user)
#     city = request.data.get("city")
#     start_date = request.data.get("start_date")
#     end_date = request.data.get("end_date")
#     user = request.user  

#     if not city or not start_date or not end_date:
#         return Response({'error': 'City, start_date, and end_date are required'}, status=400)

#     try:
#         itinerary, itinerary_data = generate_itinerary_with_activities(user, city, start_date, end_date, Location.objects.filter(city__iexact=city))
#     except ValueError:
#         return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=400)

#     return Response({
#         "itinerary": ItinerarySerializer(itinerary).data,
#         "days": itinerary_data
#     }, status=200)


# # ✅ API to Get Itinerary Details (For frontend display)
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_itinerary_details(request, itinerary_id):
#     """Fetch itinerary details along with activities."""
#     try:
#         itinerary = Itinerary.objects.get(id=itinerary_id, user=request.user)
#     except Itinerary.DoesNotExist:
#         return Response({'error': 'Itinerary not found'}, status=404)

#     activities = itinerary.activities.all()
    
#     return Response({
#         "itinerary": ItinerarySerializer(itinerary).data,
#         "activities": ActivitySerializer(activities, many=True).data
#     })
