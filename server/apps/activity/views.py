from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Activity
from server.apps.itinerary.models import Itinerary
from .serializers import ActivitySerializer

class ActivityListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retrieve activities based on itineraries created by the user."""
        itineraries = Itinerary.objects.filter(user=request.user)
        activities = Activity.objects.filter(itinerary__in=itineraries)

        serializer = ActivitySerializer(activities, many=True)
        return Response(serializer.data)
