from django.urls import path
from .views import UserProfileView, UserView, SignUpView, LoginView, LogoutView, UserSettingsView

urlpatterns = [
    path('', UserView.as_view(), name='user-list-create'),
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('settings/', UserSettingsView.as_view(), name='user-settings'),
    path('settings/update/', UserSettingsView.as_view(), name='update-settings'),
]
