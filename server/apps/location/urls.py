# location/urls.py
# location/urls.py
from django.urls import path
from .views import LocationListView, LocationsByCityView

urlpatterns = [
    # URL to list all locations
    # path('', LocationListView.as_view(), name='location-list'),
    
    # # URL to list locations filtered by city name
    # path('city/<str:city_name>/', LocationsByCityView.as_view(), name='locations-by-city'),
]
