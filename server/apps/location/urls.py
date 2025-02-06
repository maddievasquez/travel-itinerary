# location/urls.py
# location/urls.py
from django.urls import path
from .views import GenerateItinerary, generate_itinerary

urlpatterns = [
    #  path('locations/', LocationListView.as_view(), name='location-list'),
    # path('locations/<str:city_name>/', LocationsByCityView.as_view(), name='locations-by-city'),
    # path('options/', get_options_by_city, name='get-options-by-city'),
     path('generate-itinerary/', GenerateItinerary.as_view(), name='generate-itinerary'),
    path("locations/", generate_itinerary, name="generate-itinerary")
    # URL to list all locations
    # path('', LocationListView.as_view(), name='location-list'),
    
    # # URL to list locations filtered by city name
    # path('city/<str:city_name>/', LocationsByCityView.as_view(), name='locations-by-city'),
]
