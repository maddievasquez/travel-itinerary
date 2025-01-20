"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# server/urls.py
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from rest_framework.routers import DefaultRouter
from server.apps.itinerary.views import ItineraryViewSet
from server.apps.activity.views import ActivityViewSet
# Schema view to generate Swagger documentation
schema_view = get_schema_view(
   openapi.Info(
      title="Your API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@yourapi.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

router = DefaultRouter()
router.register(r'itineraries', ItineraryViewSet, basename='itinerary')
router.register(r'activities', ActivityViewSet, basename='activity')

urlpatterns = [
    path('api/', include('server.apps.itinerary.urls')),  # Itinerary endpoints
    path('api/', include('server.apps.activity.urls')),  # Activity endpoints
    path('api/', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api/users/', include('server.apps.user.urls')),  # User app URLs
    path('api/auth/', include('server.apps.user.urls')),  # Include user app URLs

    path('api/locations/', include('server.apps.location.urls')),  # Location app URLs
    path('api/activities/', include('server.apps.activity.urls')),  # Activity app URLs
    path('api/itineraries/', include('server.apps.itinerary.urls')),  # Itinerary app URLs
     path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('swagger/', schema_view.as_view(), name='swagger'),
    path('auth/', include('social_django.urls', namespace='social')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),  # OpenAPI Schema
    path('api/schema/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
      
]