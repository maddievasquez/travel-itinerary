from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Itinerary
from .serializers import ItinerarySerializer
from server.apps.activity.serializers import ActivitySerializer

class ItineraryViewSet(viewsets.ModelViewSet):
    queryset = Itinerary.objects.all()
    serializer_class = ItinerarySerializer

    def get_queryset(self):
        """Filter itineraries to show only those belonging to the logged-in user."""
        return Itinerary.objects.filter(user=self.request.user)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def itinerary_activities(request, pk):
    """Return activities for a specific itinerary"""
    try:
        itinerary = Itinerary.objects.get(pk=pk, user=request.user)
    except Itinerary.DoesNotExist:
        return Response({'error': 'Itinerary not found'}, status=404)

    activities = itinerary.activities.all()
    response_data = {
        "itinerary": ItinerarySerializer(itinerary).data,
        "activities": ActivitySerializer(activities, many=True).data
    }

    return Response(response_data)
