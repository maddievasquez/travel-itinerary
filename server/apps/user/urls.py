# user/urls.py
from django.urls import path
from .views import UserProfileView, UserView
from .views import SignUpView,  LoginView, LogoutView


# Include this in your main urls.py file
from . import views
urlpatterns = [
    path('', views.UserView.as_view(), name='user-list-create'),  # Adjust based on your views
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),


]
