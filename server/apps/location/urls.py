from django.urls import path
from .views import LocationListView, LocationClusterAPIView

urlpatterns = [
    # GET /api/locations/ - List all locations (filter by city/category)
    path('', LocationListView.as_view(), name='location-list'),
    
    # GET /api/locations/clusters/ - Get clustered locations for a city
    path('clusters/', LocationClusterAPIView.as_view(), name='location-clusters'),
]
# from django.urls import path
# from .views import GenerateItineraryAPIView  # ✅ Only import relevant views from `location.views`
# from server.apps.itinerary.views import ItineraryDetailAPIView  # ✅ Import `ItineraryDetailAPIView` from the correct module

# urlpatterns = [
#      path("generate-itinerary/", GenerateItineraryAPIView.as_view(), name="generate-itinerary"),
#     path("itinerary/<int:itinerary_id>/", ItineraryDetailAPIView.as_view(), name="itinerary-detail"),
# ]
