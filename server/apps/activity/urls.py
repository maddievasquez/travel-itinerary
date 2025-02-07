# activity/urls.py
from django.urls import path
from .views import ActivityListView  # Import your views
from rest_framework.routers import DefaultRouter
# from .views import ActivityViewSet

urlpatterns = [

 path('', ActivityListView.as_view(), name='activity-list'),

]
router = DefaultRouter()
# router.register(r'activities', ActivityViewSet, basename='activity')

urlpatterns = router.urls
