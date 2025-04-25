# server/apps/bookmark/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_user_bookmarks, name='user_bookmarks'),
    path('<int:itinerary_id>/toggle/', views.toggle_bookmark, name='toggle_bookmark'),
    path('<int:itinerary_id>/status/', views.check_bookmark_status, name='check_bookmark_status'),
]