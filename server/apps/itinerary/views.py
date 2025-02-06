from argparse import Action
from rest_framework import viewsets
from .models import Itinerary
from .serializers import ItinerarySerializer

class ItineraryViewSet(viewsets.ModelViewSet):
    queryset = Itinerary.objects.all()
    serializer_class = ItinerarySerializer

    def get_queryset(self):
        user = self.request.user
        return Itinerary.objects.filter(user=user)  # Filter itineraries by logged-in user

    @Action(detail=True, methods=['get'])
    def activities(self, request, pk=None):
        itinerary = self.get_object()
        activities = itinerary.activities.all()
        serializer = ActivitySerializer(activities, many=True)
        return Response(serializer.data)
