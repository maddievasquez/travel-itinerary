from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ItineraryViewSet,
    ItineraryGeneratorAPIView,
    itinerary_activities,
    ItineraryDetailView,
    delete_itinerary,
)

# Create a router and register the ItineraryViewSet (CRUD operations)
router = DefaultRouter()
router.register(r'', ItineraryViewSet, basename='itinerary')

urlpatterns = [
    # Include the router URLs (for CRUD operations on itineraries)
    path('', include(router.urls)),
    
    # Generate an itinerary - no longer nested under 'itineraries/'
    path('generate/', ItineraryGeneratorAPIView.as_view(), name='generate-itinerary'),
    
    # Retrieve all activities for a specific itinerary
    path('<uuid:id>/activities/', itinerary_activities, name='itinerary-activities'),
    path('<int:id>/activities/', itinerary_activities, name='itinerary-activities-int'),
    
    # Retrieve detailed itinerary including activities
    path('<uuid:id>/details/', ItineraryDetailView.as_view(), name='itinerary-detail'),
    path('<int:id>/details/', ItineraryDetailView.as_view(), name='itinerary-detail-int'),
    
    # Delete an itinerary
    path('<uuid:id>/delete/', delete_itinerary, name='delete-itinerary'),
    path('<int:id>/delete/', delete_itinerary, name='delete-itinerary-int'),
]