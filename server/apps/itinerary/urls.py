# itinerary/urls.py
from django.urls import path
from .views import ItineraryListView

urlpatterns = [
    path('', ItineraryListView.as_view(), name='itinerary-list'),
]
