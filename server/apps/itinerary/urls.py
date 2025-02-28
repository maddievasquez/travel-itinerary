from django.urls import path, include
from rest_framework.routers import DefaultRouter

from server.apps.location.views import GenerateItineraryAPIView, ItineraryDetailAPIView
from .views import ItineraryViewSet, UserItinerariesAPIView, itinerary_activities

router = DefaultRouter()
router.register(r'itineraries', ItineraryViewSet, basename='itinerary')

urlpatterns = [
    path('', include(router.urls)),
    path('<int:pk>/activities/', itinerary_activities, name='itinerary-activities'),
     path("generate-itinerary/", GenerateItineraryAPIView.as_view(), name="generate-itinerary"),
    path("user-itineraries/", UserItinerariesAPIView.as_view(), name="user-itineraries"),
    path("<int:itinerary_id>/", ItineraryDetailAPIView.as_view(), name="itinerary-detail"),
]
