from django.urls import path
from .views import (
    SignupView, LoginView, LogoutView, UserItinerariesView, UserProfileView,
    PasswordResetView, PasswordResetConfirmView, UserSettingsView, UserView
)

urlpatterns = [
    # User endpoints with consistent prefixes
    path('', UserView.as_view(), name='user-list-create'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),  # Add this endpoint
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('settings/', UserSettingsView.as_view(), name='user-settings'),
    path('profile/update/', UserProfileView.as_view(), name='update-user-profile'),
    path('itineraries/', UserItinerariesView.as_view(), name='user-itineraries'),
    path('password-reset/', PasswordResetView.as_view(), name='password_reset'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]

# ]