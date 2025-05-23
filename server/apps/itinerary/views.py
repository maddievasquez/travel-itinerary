import random
import uuid
from django.http import JsonResponse
from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from datetime import datetime, timedelta
from django.db import transaction
from django.shortcuts import get_object_or_404
from uuid import UUID

from server.apps.activity.activity_templates import ACTIVITY_TEMPLATES
from server.apps.bookmark.models import Bookmark

from .models import Itinerary
from .serializers import ItinerarySerializer
from server.apps.activity.models import Activity
from server.apps.activity.serializers import ActivitySerializer
from server.apps.location.models import Location
from server.apps.location.serializers import LocationSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
# from server.apps.bookmark.models import Bookmark  # Import Bookmark model
from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class ItineraryViewSet(viewsets.ModelViewSet):
    pagination_class = StandardResultsSetPagination
    authentication_classes = [JWTAuthentication]
    serializer_class = ItinerarySerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    queryset = Itinerary.objects.all()

    def get_queryset(self):
        """Return only the current user's itineraries"""
        return Itinerary.objects.filter(user=self.request.user).order_by('-created_at')
    @action(detail=False, methods=['post'], url_path='generate')
    def generate_itinerary(self, request):

        def perform_create(self, serializer):
            serializer.save(user=self.request.user)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    def create(self, request, *args, **kwargs):
        """Create itinerary with activities using consistent time formatting"""
        required_fields = ['city', 'start_date', 'end_date']
        missing_fields = [field for field in required_fields if field not in request.data]
        if missing_fields:
            return Response(
                {"error": f"Missing required fields: {', '.join(missing_fields)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        city = request.data.get('city')
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        title = request.data.get('title', f"Trip to {city}")

        try:
            start_date_obj = datetime.strptime(start_date, "%Y-%m-%d").date()
            end_date_obj = datetime.strptime(end_date, "%Y-%m-%d").date()
        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if start_date_obj > end_date_obj:
            return Response(
                {"error": "Start date must be before end date"},
                status=status.HTTP_400_BAD_REQUEST
            )

        locations = Location.objects.filter(city__iexact=city)
        if not locations.exists():
            return Response(
                {"error": f"No locations found for city: {city}"},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            with transaction.atomic():
                itinerary = Itinerary.objects.create(
                    user=request.user,
                    title=title,
                    city=city,
                    start_date=start_date_obj,
                    end_date=end_date_obj
                )

                current_date = start_date_obj
                days_data = []
                used_location_ids = set()
                locations_list = list(locations)
                total_days = (end_date_obj - start_date_obj).days + 1
                max_locations_per_day = min(5, len(locations_list) // total_days + 1)

                while current_date <= end_date_obj:
                    available_locations = [loc for loc in locations_list if loc.id not in used_location_ids]
                    
                    if len(available_locations) < 3:
                        if len(used_location_ids) > 0:
                            available_locations = locations_list
                            used_location_ids = set()

                    min_locations = min(3, len(available_locations))
                    max_locs = max(min_locations, min(max_locations_per_day, len(available_locations)))
                    num_locations = random.randint(min_locations, max_locs)
                    day_locations = random.sample(available_locations, num_locations)

                    for loc in day_locations:
                        used_location_ids.add(loc.id)

                    day_activities = []
                    start_time = datetime.strptime("09:00", "%H:%M").time()

                    for location in day_locations:
                        location_category = getattr(location, 'category', 'general')
                        templates = ACTIVITY_TEMPLATES.get(location_category, ACTIVITY_TEMPLATES.get('general', ["Visit {location_name}"]))
                        description = random.choice(templates).replace("{location_name}", location.name)

                        duration = timedelta(hours=random.randint(1, 3))
                        end_time_dt = datetime.combine(datetime.today(), start_time) + duration
                        end_time = end_time_dt.time()

                        activity = Activity.objects.create(
                            itinerary=itinerary,
                            location=location,
                            description=description,
                            date=current_date,
                            start_time=start_time,
                            end_time=end_time
                        )

                        activity_data = {
                            "id": activity.id,
                            "description": activity.description,
                            "date": current_date.strftime("%Y-%m-%d"),
                            "start_time": activity.start_time.strftime("%H:%M"),
                            "end_time": activity.end_time.strftime("%H:%M"),
                            "location": {
                                "id": location.id,
                                "name": location.name,
                                "address": location.address,
                                "latitude": float(location.latitude),
                                "longitude": float(location.longitude),
                                "category": location.category
                            }
                        }
                        day_activities.append(activity_data)

                        next_start_dt = end_time_dt + timedelta(minutes=30)
                        start_time = next_start_dt.time()
                        
                        if start_time > datetime.strptime("19:00", "%H:%M").time():
                            break

                    days_data.append({
                        "day": (current_date - start_date_obj).days + 1,
                        "date": current_date.strftime("%Y-%m-%d"),
                        "activities": day_activities
                    })
                    current_date += timedelta(days=1)

                return Response({
                    "itinerary": {
                        "id": itinerary.id,
                        "title": itinerary.title,
                        "city": itinerary.city,
                        "start_date": itinerary.start_date.strftime("%Y-%m-%d"),
                        "end_date": itinerary.end_date.strftime("%Y-%m-%d"),
                        "user": itinerary.user.id
                    },
                    "days": days_data
                }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {"error": f"Failed to generate itinerary: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def retrieve(self, request, *args, **kwargs):
        """Retrieve with same formatting as generator API"""
        instance = self.get_object()
        activities = Activity.objects.filter(itinerary=instance).order_by('date', 'start_time')
        
        days_data = {}
        for activity in activities:
            date_str = activity.date.strftime("%Y-%m-%d")
            if date_str not in days_data:
                days_data[date_str] = {
                    "day": (activity.date - instance.start_date).days + 1,
                    "date": date_str,
                    "activities": []
                }
            
            activity_data = {
                "id": activity.id,
                "description": activity.description,
                "date": date_str,
                "start_time": activity.start_time.strftime("%H:%M"),
                "end_time": activity.end_time.strftime("%H:%M"),
                "location": {
                    "id": activity.location.id,
                    "name": activity.location.name,
                    "address": activity.location.address,
                    "latitude": float(activity.location.latitude),
                    "longitude": float(activity.location.longitude),
                    "category": activity.location.category
                }
            }
            days_data[date_str]["activities"].append(activity_data)

        return Response({
            "itinerary": {
                "id": instance.id,
                "title": instance.title,
                "city": instance.city,
                "start_date": instance.start_date.strftime("%Y-%m-%d"),
                "end_date": instance.end_date.strftime("%Y-%m-%d"),
                "user": instance.user.id
            },
            "days": list(days_data.values())
        })

    @action(detail=True, methods=['get'])
    def map_data(self, request, id=None):
        """Get location data optimized for mapping"""
        itinerary = self.get_object()
        activities = Activity.objects.filter(itinerary=itinerary).select_related('location')
        
        map_points = []
        for activity in activities:
            location = activity.location
            map_points.append({
                "id": activity.id,
                "name": location.name,
                "address": location.address,
                "coordinates": {
                    "latitude": float(location.latitude),
                    "longitude": float(location.longitude)
                },
                "category": location.category,
                "city": location.city,
                "activity": {
                    "description": activity.description,
                    "date": activity.date.strftime("%Y-%m-%d"),
                    "start_time": activity.start_time.strftime("%H:%M"),
                    "end_time": activity.end_time.strftime("%H:%M"),
                    "day": (activity.date - itinerary.start_date).days + 1
                }
            })
        
        return Response({
            "itinerary": {
                "id": itinerary.id,
                "title": itinerary.title,
                "city": itinerary.city,
                "start_date": itinerary.start_date.strftime("%Y-%m-%d"),
                "end_date": itinerary.end_date.strftime("%Y-%m-%d")
            },
            "map_points": map_points
        })

    @action(detail=True, methods=['get'])
    def daily_routes(self, request, id=None):
        """Get daily routes for the map with location waypoints"""
        itinerary = self.get_object()
        activities = Activity.objects.filter(itinerary=itinerary).select_related('location').order_by('date', 'start_time')
        
        daily_routes = {}
        for activity in activities:
            date_str = activity.date.strftime("%Y-%m-%d")
            if date_str not in daily_routes:
                daily_routes[date_str] = {
                    "day": (activity.date - itinerary.start_date).days + 1,
                    "date": date_str,
                    "waypoints": []
                }
            
            location = activity.location
            daily_routes[date_str]["waypoints"].append({
                "id": activity.id,
                "name": location.name,
                "coordinates": {
                    "latitude": float(location.latitude),
                    "longitude": float(location.longitude)
                },
                "start_time": activity.start_time.strftime("%H:%M"),
                "end_time": activity.end_time.strftime("%H:%M"),
                "description": activity.description
            })
        
        return Response({
            "itinerary": {
                "id": itinerary.id,
                "title": itinerary.title,
                "city": itinerary.city,
                "start_date": itinerary.start_date.strftime("%Y-%m-%d"),
                "end_date": itinerary.end_date.strftime("%Y-%m-%d")
            },
            "daily_routes": list(daily_routes.values())
        })
# # class ItineraryGeneratorAPIView(APIView):
#     permission_classes = [IsAuthenticated]
#     authentication_classes = [JWTAuthentication]

#     def post(self, request):
#         print("creating itinerary")
#         try:
#             # Validate required fields
#             required_fields = ['city', 'start_date', 'end_date']
            
#             # Check if data is empty or missing
#             if not request.data:
#                 return Response(
#                     {"error": "No data provided"},
#                     status=status.HTTP_400_BAD_REQUEST
#                 )

#             # Check for missing required fields
#             missing_fields = [field for field in required_fields if field not in request.data]
#             if missing_fields:
#                 return Response(
#                     {"error": f"Missing required fields: {', '.join(missing_fields)}"},
#                     status=status.HTTP_400_BAD_REQUEST
#                 )

#             # Extract data
#             city = request.data.get('city')
#             start_date = request.data.get('start_date')
#             end_date = request.data.get('end_date')
#             title = request.data.get('title', f"Trip to {city}")  # Default title if not provided

#             # Validate date formats
#             try:
#                 start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
#                 end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
#             except ValueError:
#                 return Response(
#                     {"error": "Invalid date format. Use YYYY-MM-DD"},
#                     status=status.HTTP_400_BAD_REQUEST
#                 )
            
#             if start_date > end_date:
#                 return Response(
#                     {"error": "Start date must be before end date"},
#                     status=status.HTTP_400_BAD_REQUEST
#                 )

#             # Attempt to find locations
#             locations = Location.objects.filter(city__iexact=city)
#             if not locations.exists():
#                 return Response(
#                     {"error": f"No locations found for city: {city}"},
#                     status=status.HTTP_404_NOT_FOUND
#                 )

#             # Create itinerary
#             with transaction.atomic():
#                 print("going to create activities")
#                 itinerary = Itinerary.objects.create(
#                     user=request.user,
#                     title=title,
#                     city=city,
#                     start_date=start_date,
#                     end_date=end_date
#                 )

#                 # Generate activities for each day
#                 current_date = start_date
#                 days_data = []
                
#                 # Track used locations to prevent repeats
#                 used_location_ids = set()
#                 locations_list = list(locations)
#                 total_days = (end_date - start_date).days + 1
                
#                 # Calculate optimal number of locations per day based on available locations and trip duration
#                 # Ensure we have at least 1 location per day, capped at 5
#                 max_locations_per_day = min(5, len(locations_list) // total_days + 1)
                
#                 while current_date <= end_date:
#                     # Get locations not used yet
#                     available_locations = [loc for loc in locations_list if loc.id not in used_location_ids]
                    
#                     # If we're running low on unused locations, reset the pool
#                     if len(available_locations) < 3:
#                         # Reset the pool when necessary but keep track of usage patterns
#                         available_locations = locations_list
#                         used_location_ids = set()
                    
#                     # FIX: Create a valid range for random.randint() that adapts to the available locations
#                     # First, determine the minimum number of locations to use (capped by available locations)
#                     min_locations = min(3, len(available_locations))
                    
#                     # Then, determine the maximum, ensuring it's at least equal to the minimum
#                     # and not more than what's available or the calculated max_locations_per_day
#                     max_locs = max(min_locations, min(max_locations_per_day, len(available_locations)))
                    
#                     # Now we have a valid range for random.randint()
#                     num_locations = random.randint(min_locations, max_locs)
                    
#                     # Select random locations for this day
#                     day_locations = random.sample(available_locations, num_locations)
                    
#                     # Mark these locations as used
#                     for loc in day_locations:
#                         used_location_ids.add(loc.id)
                    
#                     day_activities = []
#                     start_time = datetime.strptime("09:00", "%H:%M").time()
                    
#                     for location in day_locations:
#                         # Get appropriate activity template based on location category
#                         location_category = getattr(location, 'category', 'general')
#                         templates = ACTIVITY_TEMPLATES.get(location_category, ACTIVITY_TEMPLATES.get('general', ["Visit {location_name}"]))
#                         description = random.choice(templates).replace("{location_name}", location.name)
                        
#                         # Calculate end time (activity duration between 1-3 hours)
#                         duration = timedelta(hours=random.randint(1, 3))
#                         end_time_dt = datetime.combine(datetime.today(), start_time) + duration
#                         end_time = end_time_dt.time()
                        
#                         # Create the activity
#                         activity = Activity.objects.create(
#                             itinerary=itinerary,
#                             location=location,
#                             description=description,
#                             date=current_date,
#                             start_time=start_time,
#                             end_time=end_time
#                         )
                        
#                         day_activities.append(activity)
                        
#                         # Set next start time with a 30-minute break
#                         next_start_dt = end_time_dt + timedelta(minutes=30)
#                         start_time = next_start_dt.time()
                        
#                         # End the day around 7 PM
#                         if start_time > datetime.strptime("19:00", "%H:%M").time():
#                             break
                    
#                     # Prepare day data for response with location information
#                     activity_data = []
#                     for activity in day_activities:
#                         activity_serialized = ActivitySerializer(activity).data
#                         activity_serialized['location'] = LocationSerializer(activity.location).data
#                         activity_data.append(activity_serialized)
                    
#                     days_data.append({
#                         "day": (current_date - start_date).days + 1,
#                         "date": current_date.isoformat(),
#                         "activities": activity_data
#                     })
                    
#                     # Move to next day
#                     current_date += timedelta(days=1)

#             # Return the created itinerary with activities
#             return Response({
#                 "itinerary": ItinerarySerializer(itinerary).data,
#                 "days": days_data
#             }, status=status.HTTP_201_CREATED)

#         except Exception as e:
#             import traceback
#             traceback.print_exc()
            
#             return Response(
#                 {"error": f"Failed to generate itinerary: {str(e)}"},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )
#     permission_classes = [IsAuthenticated]
#     authentication_classes = [JWTAuthentication]

    # def post(self, request):
    #     print("creating itinerary")
    #     try:
    #         # Validate required fields
    #         required_fields = ['city', 'start_date', 'end_date']
            
    #         # Check if data is empty or missing
    #         if not request.data:
    #             return Response(
    #                 {"error": "No data provided"},
    #                 status=status.HTTP_400_BAD_REQUEST
    #             )

    #         # Check for missing required fields
    #         missing_fields = [field for field in required_fields if field not in request.data]
    #         if missing_fields:
    #             return Response(
    #                 {"error": f"Missing required fields: {', '.join(missing_fields)}"},
    #                 status=status.HTTP_400_BAD_REQUEST
    #             )

    #         # Extract data
    #         city = request.data.get('city')
    #         start_date = request.data.get('start_date')
    #         end_date = request.data.get('end_date')
    #         title = request.data.get('title', f"Trip to {city}")  # Default title if not provided

    #         # Validate date formats
    #         try:
    #             start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
    #             end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
    #         except ValueError:
    #             return Response(
    #                 {"error": "Invalid date format. Use YYYY-MM-DD"},
    #                 status=status.HTTP_400_BAD_REQUEST
    #             )
            
    #         if start_date > end_date:
    #             return Response(
    #                 {"error": "Start date must be before end date"},
    #                 status=status.HTTP_400_BAD_REQUEST
    #             )

    #         # Attempt to find locations
    #         locations = Location.objects.filter(city__iexact=city)
    #         if not locations.exists():
    #             return Response(
    #                 {"error": f"No locations found for city: {city}"},
    #                 status=status.HTTP_404_NOT_FOUND
    #             )

    #         # Create itinerary
    #         with transaction.atomic():
    #             print("going to create activities")
    #             itinerary = Itinerary.objects.create(
    #                 user=request.user,
    #                 title=title,
    #                 city=city,
    #                 start_date=start_date,
    #                 end_date=end_date
    #             )

    #             # Generate activities for each day
    #             current_date = start_date
    #             days_data = []
                
    #             # Track used locations to prevent repeats
    #             used_location_ids = set()
    #             locations_list = list(locations)
    #             total_days = (end_date - start_date).days + 1
                
    #             # Calculate optimal number of locations per day based on available locations and trip duration
    #             max_locations_per_day = min(5, len(locations_list) // total_days + 1)
                
    #             while current_date <= end_date:
    #                 # Get locations not used yet
    #                 available_locations = [loc for loc in locations_list if loc.id not in used_location_ids]
                    
    #                 # If we're running low on unused locations, reset the pool
    #                 if len(available_locations) < 3:
    #                     # Reset the pool when necessary but keep track of usage patterns
    #                     available_locations = locations_list
    #                     used_location_ids = set()
                    
    #                 # Select random locations for this day (3-5 or what's available)
    #                 num_locations = min(random.randint(3, max_locations_per_day), len(available_locations))
    #                 day_locations = random.sample(available_locations, num_locations)
                    
    #                 # Mark these locations as used
    #                 for loc in day_locations:
    #                     used_location_ids.add(loc.id)
                    
    #                 day_activities = []
    #                 start_time = datetime.strptime("09:00", "%H:%M").time()
                    
    #                 for location in day_locations:
    #                     # Get appropriate activity template based on location category
    #                     location_category = getattr(location, 'category', 'general')
    #                     templates = ACTIVITY_TEMPLATES.get(location_category, ACTIVITY_TEMPLATES.get('general', ["Visit {location_name}"]))
    #                     description = random.choice(templates).replace("{location_name}", location.name)
                        
    #                     # Calculate end time (activity duration between 1-3 hours)
    #                     duration = timedelta(hours=random.randint(1, 3))
    #                     end_time_dt = datetime.combine(datetime.today(), start_time) + duration
    #                     end_time = end_time_dt.time()
                        
    #                     # Create the activity
    #                     activity = Activity.objects.create(
    #                         itinerary=itinerary,
    #                         location=location,
    #                         description=description,
    #                         date=current_date,
    #                         start_time=start_time,
    #                         end_time=end_time
    #                     )
                        
    #                     day_activities.append(activity)
                        
    #                     # Set next start time with a 30-minute break
    #                     next_start_dt = end_time_dt + timedelta(minutes=30)
    #                     start_time = next_start_dt.time()
                        
    #                     # End the day around 7 PM
    #                     if start_time > datetime.strptime("19:00", "%H:%M").time():
    #                         break
                    
    #                 # Prepare day data for response with location information
    #                 activity_data = []
    #                 for activity in day_activities:
    #                     activity_serialized = ActivitySerializer(activity).data
    #                     activity_serialized['location'] = LocationSerializer(activity.location).data
    #                     activity_data.append(activity_serialized)
                    
    #                 days_data.append({
    #                     "day": (current_date - start_date).days + 1,
    #                     "date": current_date.isoformat(),
    #                     "activities": activity_data
    #                 })
                    
    #                 # Move to next day
    #                 current_date += timedelta(days=1)

    #         # Return the created itinerary with activities
    #         return Response({
    #             "itinerary": ItinerarySerializer(itinerary).data,
    #             "days": days_data
    #         }, status=status.HTTP_201_CREATED)

    #     except Exception as e:
    #         import traceback
    #         traceback.print_exc()
            
    #         return Response(
    #             {"error": f"Failed to generate itinerary: {str(e)}"},
    #             status=status.HTTP_500_INTERNAL_SERVER_ERROR
    #         )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def itinerary_activities(request, id):
    """
    Get all activities for a specific itinerary (using ID)
    """
    try:
        # Try converting to UUID, if it fails, it might be an old-style int ID
        try:
            uuid_obj = UUID(str(id))
            itinerary = get_object_or_404(Itinerary, id=uuid_obj, user=request.user)
        except (ValueError, TypeError):
            # Try with integer ID for backward compatibility
            itinerary = get_object_or_404(Itinerary, pk=id, user=request.user)
    except Exception as e:
        return Response({"error": f"Itinerary not found: {str(e)}"}, status=status.HTTP_404_NOT_FOUND)
    
    activities = Activity.objects.filter(itinerary=itinerary).select_related('location')
    
    return Response({
        "itinerary": ItinerarySerializer(itinerary).data,
        "activities": ActivitySerializer(activities, many=True).data,
    })


class ItineraryDetailView(generics.RetrieveAPIView):
    """
    Retrieve detailed itinerary information including activities
    """
    serializer_class = ItinerarySerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    lookup_field = 'id'

    def get_queryset(self):
        return Itinerary.objects.filter(user=self.request.user).select_related('user')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        # Fetch related data
        activities = Activity.objects.filter(
            itinerary=instance
        ).select_related('location').order_by('date', 'start_time')
        
        days = []
        current_date = instance.start_date
        for day_num in range((instance.end_date - instance.start_date).days + 1):
            day_activities = [a for a in activities if a.date == current_date]
            locations = {a.location for a in day_activities}
            
            days.append({
                "day": day_num + 1,
                "date": current_date,
                "locations": LocationSerializer(locations, many=True).data,
                "activities": ActivitySerializer(day_activities, many=True).data
            })
            current_date += timedelta(days=1)

        data = serializer.data
        data['days'] = days
        return Response(data)

def check_bookmark_status(request, id):
    itinerary = get_object_or_404(Itinerary, id=id)
    is_bookmarked = Bookmark.objects.filter(user=request.user, itinerary=itinerary).exists()
    return JsonResponse({'isBookmarked': is_bookmarked})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_itinerary(request, id):
    """
    Delete an itinerary by ID
    """
    try:
        try:
            uuid_obj = UUID(str(id))
            itinerary = get_object_or_404(Itinerary, id=uuid_obj, user=request.user)
        except (ValueError, TypeError):
            itinerary = get_object_or_404(Itinerary, pk=id, user=request.user)
            
        itinerary.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response(
            {"error": f"Failed to delete itinerary: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )