from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ItineraryViewSet,
    ItineraryGeneratorAPIView,
    itinerary_activities,
    ItineraryDetailView,
    delete_itinerary,
    check_bookmark_status,
    # toggle_bookmark,
    # get_bookmarked_itineraries,
)

# Create a router and register the ItineraryViewSet (CRUD operations)
router = DefaultRouter()
router.register(r'', ItineraryViewSet, basename='itinerary')

urlpatterns = [
    # Include the router URLs (for CRUD operations on itineraries)
    path('', include(router.urls)),
    
    # Generate an itinerary
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
    
    # Bookmark related endpoints
    path('<uuid:id>/check-bookmark/', check_bookmark_status, name='check-bookmark'),
    path('<int:id>/check-bookmark/', check_bookmark_status, name='check-bookmark-int'),
    # path('<uuid:id>/toggle-bookmark/', toggle_bookmark, name='toggle-bookmark'),
    # path('<int:id>/toggle-bookmark/', toggle_bookmark, name='toggle-bookmark-int'),
    # path('bookmarked/', get_bookmarked_itineraries, name='bookmarked-itineraries'),
]