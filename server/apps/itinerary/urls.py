# itinerary/urls.py
from django.urls import path
from .views import ItineraryListView
from rest_framework.routers import DefaultRouter
from .views import ItineraryViewSet

urlpatterns = [
    path('', ItineraryListView.as_view(), name='itinerary-list'),
]
router = DefaultRouter()
router.register(r'itineraries', ItineraryViewSet, basename='itinerary')

urlpatterns = router.urls