"""
URL configuration for server project.
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from django.contrib.auth import views as auth_views

from server.apps.bookmark import views
from server.apps.itinerary.views import ItineraryViewSet

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

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/user/', include('server.apps.user.urls')),
    path('api/itineraries/', include('server.apps.itinerary.urls')),  # This gives access to /api/itineraries/generate/
    path('api/auth/', include('server.apps.user.urls')),
    path('api/locations/', include('server.apps.location.urls')),
    path('api/activities/', include('server.apps.activity.urls')),
    path('generate/', ItineraryViewSet.as_view({'post': 'generate_itinerary'}), name='itinerary-generate'),
     path('itineraries/<int:itinerary_id>/bookmark/', views.toggle_bookmark, name='toggle_bookmark'),
    path('itineraries/<int:itinerary_id>/bookmark/status/', views.check_bookmark_status, name='check_bookmark_status'),
    path('bookmarks/', views.get_user_bookmarks, name='user_bookmarks'),
    # Authentication
    path('password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Documentation
    path('swagger/', schema_view.as_view(), name='swagger'),
    path('auth/', include('social_django.urls', namespace='social')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]