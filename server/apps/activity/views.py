from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Activity
from .serializers import ActivitySerializer
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet

class ActivityListView(APIView):
    def get(self, request):
        """Returns a list of all activities."""
        activities = Activity.objects.all()
        serializer = ActivitySerializer(activities, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ActivitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ActivityViewSet(ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        location = request.query_params.get('location', '')

        activities = self.queryset.filter(name__icontains=query, location__icontains=location)
        serializer = self.get_serializer(activities, many=True)
        return Response(serializer.data)