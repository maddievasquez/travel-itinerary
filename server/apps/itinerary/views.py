# Itinerary View
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.pagination import PageNumberPagination
from .models import Itinerary
from .serializers import ItinerarySerializer
from .filters import ItineraryFilter
import logging

logger = logging.getLogger(__name__)

class ItineraryPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'

class ItineraryListView(generics.ListCreateAPIView):
    """
    Handles listing all itineraries and creating a new itinerary.
    """
    queryset = Itinerary.objects.all()
    serializer_class = ItinerarySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ItineraryFilter
    pagination_class = ItineraryPagination

    def create(self, request, *args, **kwargs):
        """
        Custom implementation for handling POST requests if additional logic is required.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.error(f"Create Itinerary failed: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ItineraryViewSet(ModelViewSet):
    """
    Handles all CRUD operations for itineraries.
    """
    queryset = Itinerary.objects.all()
    serializer_class = ItinerarySerializer
