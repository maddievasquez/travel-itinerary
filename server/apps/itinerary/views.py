#Itinerary View
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Itinerary
from .serializers import ItinerarySerializer
from .filters import ItineraryFilter

class ItineraryListView(generics.ListCreateAPIView):
    """
    Handles listing all itineraries and creating a new itinerary.
    """
    queryset = Itinerary.objects.all()
    serializer_class = ItinerarySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ItineraryFilter
    filterset_fields = ['city', 'start_date', 'end_date']

    def create(self, request, *args, **kwargs):
        """
        Custom implementation for handling POST requests if additional logic is required.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
