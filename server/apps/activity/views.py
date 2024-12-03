from django.shortcuts import render

# Create your views here.
# activity/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Activity
from .serializers import ActivitySerializer

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
