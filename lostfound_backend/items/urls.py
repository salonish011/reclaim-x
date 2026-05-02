from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, PublicItemListView, MatchListView
from . import views

router = DefaultRouter()
router.register(r'', ItemViewSet, basename='item')

urlpatterns = [
    path('browse/', PublicItemListView.as_view()),  # ✅ must be first
    path('', include(router.urls)),
    path('predict/', views.predict),
]