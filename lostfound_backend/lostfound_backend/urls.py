from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from items.views import MatchListView

urlpatterns = [                                                              # ✅ opening bracket
    path('', RedirectView.as_view(url='/api/')),
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/items/', include('items.urls')),
    path('api/chat/', include('chat.urls')),
    path('api/matches/', MatchListView.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)          # ✅ closing bracket