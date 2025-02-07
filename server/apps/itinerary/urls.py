from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItineraryViewSet, itinerary_activities

router = DefaultRouter()
router.register(r'itineraries', ItineraryViewSet, basename='itinerary')

urlpatterns = [
    path('', include(router.urls)),
    path('<int:pk>/activities/', itinerary_activities, name='itinerary-activities'),
]
