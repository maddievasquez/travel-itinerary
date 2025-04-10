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
