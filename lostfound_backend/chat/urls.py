from django.urls import path
from . import views

app_name = 'chat'

urlpatterns = [
    path('conversations/', views.my_conversations, name='my-conversations'),
    path('conversations/start/', views.start_conversation, name='start-conversation'),
    path('conversations/<int:conversation_id>/messages/', views.get_messages, name='get-messages'),
    path('conversations/<int:conversation_id>/send/', views.send_message, name='send-message'),
    path('notifications/', views.my_notifications, name='my-notifications'),
    path('notifications/<int:notification_id>/read/', views.mark_notification_read, name='mark-read'),
    path('notifications/read-all/', views.mark_all_notifications_read, name='mark-all-read'),
]