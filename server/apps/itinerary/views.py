from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView

from .models import Itinerary
from .serializers import ItinerarySerializer
from server.apps.activity.serializers import ActivitySerializer

# ✅ ViewSet for Itineraries
class ItineraryViewSet(viewsets.ModelViewSet):
    """Manage itineraries for authenticated users."""
    queryset = Itinerary.objects.all()
    serializer_class = ItinerarySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Itinerary.objects.filter(user=self.request.user)

# ✅ Fetch Itinerary Activities
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def itinerary_activities(request, pk):
    """Return activities for a specific itinerary."""
    try:
        itinerary = Itinerary.objects.get(pk=pk, user=request.user)
    except Itinerary.DoesNotExist:
        return Response({'error': 'Itinerary not found'}, status=status.HTTP_404_NOT_FOUND)

    activities = itinerary.activities.all()
    return Response({
        "itinerary": ItinerarySerializer(itinerary).data,
        "activities": ActivitySerializer(activities, many=True).data,
    })

# ✅ List User's Itineraries
class UserItinerariesAPIView(ListAPIView):
    """Fetch all itineraries for the authenticated user."""
    serializer_class = ItinerarySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Itinerary.objects.filter(user=self.request.user)

# ✅ Fetch a Single Itinerary
class ItineraryDetailAPIView(APIView):
    """Retrieve details of a specific itinerary."""
    permission_classes = [IsAuthenticated]

    def get(self, request, itinerary_id):
        try:
            itinerary = Itinerary.objects.get(id=itinerary_id, user=request.user)
        except Itinerary.DoesNotExist:
            return Response({'error': 'Itinerary not found'}, status=status.HTTP_404_NOT_FOUND)

        activities = itinerary.activities.all()
        return Response({
            "itinerary": ItinerarySerializer(itinerary).data,
            "activities": ActivitySerializer(activities, many=True).data
        })

# ✅ Generate a New Itinerary
class GenerateItineraryAPIView(APIView):
    """Handles itinerary creation."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        city = request.data.get("city")
        title = request.data.get("title", f"Trip to {city}")  # Ensure title is set
        start_date = request.data.get("start_date")
        end_date = request.data.get("end_date")

        if not city or not start_date or not end_date:
            return Response({"error": "City, start_date, and end_date are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            itinerary = Itinerary.objects.create(
                user=user,
                title=title,
                city=city,
                start_date=start_date,
                end_date=end_date
            )

            # ✅ Ensure the response includes the itinerary ID
            return Response({
                "itinerary": ItinerarySerializer(itinerary).data
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
