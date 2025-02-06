from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Activity
from .serializers import ActivitySerializer
from rest_framework.decorators import action

class ActivityListView(APIView):
    def get(self, request):
        activities = Activity.objects.all()

        # Filtering based on query params
        query = request.query_params.get('q', '')
        location = request.query_params.get('location', '')
        category = request.query_params.get('category', '')
        start_date = request.query_params.get('start_date', None)
        end_date = request.query_params.get('end_date', None)

        if query:
            activities = activities.filter(description__icontains=query)
        if location:
            activities = activities.filter(location__name__icontains=location)
        if category:
            activities = activities.filter(category=category)
        if start_date and end_date:
            activities = activities.filter(date__range=[start_date, end_date])

        serializer = ActivitySerializer(activities, many=True)
        return Response(serializer.data)

class ActivityDetailView(APIView):
    def get(self, request, pk):
        try:
            activity = Activity.objects.get(pk=pk)
        except Activity.DoesNotExist:
            return Response({'error': 'Activity not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ActivitySerializer(activity)
        return Response(serializer.data)
