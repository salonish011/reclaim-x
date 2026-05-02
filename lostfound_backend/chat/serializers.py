from rest_framework import serializers
from .models import Conversation, Message, Notification
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    class Meta:
        model = Message
        fields = ['id', 'sender', 'content', 'created_at', 'is_read']

class ConversationSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)
    messages = MessageSerializer(many=True, read_only=True)
    item_title = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'participants', 'messages', 'item_title', 'created_at']

    def get_item_title(self, obj):
        return obj.item.title if obj.item else 'General'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'notification_type', 'title', 'message', 'is_read', 'created_at']