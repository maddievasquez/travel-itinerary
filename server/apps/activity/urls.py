# activity/urls.py
from django.urls import path
from .views import ActivityListView  # Import your views

urlpatterns = [
    path('', ActivityListView.as_view(), name='activity-list'),  # Matches /api/activities/
]
