# activity/urls.py
from django.urls import path
from .views import ActivityListView  # Import your views
from rest_framework.routers import DefaultRouter
from .views import ActivityViewSet

urlpatterns = [
path('activities/', ActivityListView.as_view(), name='activity-list'),
path('activities/search/', ActivityViewSet.as_view({'get': 'search'}), name='activity-search'),
path('', ActivityListView.as_view(), name='activity-list'),  # Matches /api/activities/
]
router = DefaultRouter()
router.register(r'activities', ActivityViewSet, basename='activity')

urlpatterns = router.urls
