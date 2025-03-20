from django.urls import path
from .views import (
    PasswordResetConfirmView,
    PasswordResetView,
    UserItinerariesView,
    UserProfileView,
    UserView,
    SignUpView,
    LoginView,
    LogoutView,
    UserSettingsView,
)

urlpatterns = [
    path('', UserView.as_view(), name='user-list-create'),
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('settings/', UserSettingsView.as_view(), name='user-settings'),
    path('settings/update/', UserSettingsView.as_view(), name='update-settings'),
    path('user-itineraries/', UserItinerariesView.as_view(), name='user-itineraries'),
    path('password-reset/', PasswordResetView.as_view(), name='password_reset'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]