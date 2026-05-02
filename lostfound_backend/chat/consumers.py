from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from .models import Conversation, Message, Notification
from .serializers import MessageSerializer, NotificationSerializer


class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        user = self.scope.get('user')
        if not user or user.is_anonymous:
            await self.close()
            return

        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.group_name = f'chat_{self.conversation_id}'

        is_member = await self._is_conversation_member(user.id, self.conversation_id)
        if not is_member:
            await self.close()
            return

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        action = content.get('action')
        if action != 'send_message':
            return

        message_text = (content.get('content') or '').strip()
        if not message_text:
            return

        user = self.scope['user']
        message_payload, notification_payload, recipient_id = await self._create_message_and_notification(
            user.id,
            self.conversation_id,
            message_text,
        )

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'chat.message',
                'payload': message_payload,
            },
        )

        if recipient_id and notification_payload:
            await self.channel_layer.group_send(
                f'notifications_{recipient_id}',
                {
                    'type': 'notification.created',
                    'payload': notification_payload,
                },
            )

    async def chat_message(self, event):
        await self.send_json({
            'type': 'chat.message',
            'data': event['payload'],
        })

    @database_sync_to_async
    def _is_conversation_member(self, user_id, conversation_id):
        return Conversation.objects.filter(id=conversation_id, participants__id=user_id).exists()

    @database_sync_to_async
    def _create_message_and_notification(self, sender_id, conversation_id, content):
        convo = Conversation.objects.get(id=conversation_id, participants__id=sender_id)
        sender = convo.participants.get(id=sender_id)

        msg = Message.objects.create(
            conversation=convo,
            sender=sender,
            content=content,
        )
        message_payload = MessageSerializer(msg).data

        other_user = convo.participants.exclude(id=sender_id).first()
        if not other_user:
            return message_payload, None, None

        notification = Notification.objects.create(
            user=other_user,
            notification_type='message',
            title=f'New message from {sender.username}',
            message=content[:100],
            item=convo.item,
        )
        notification_payload = NotificationSerializer(notification).data
        return message_payload, notification_payload, other_user.id


class NotificationConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        user = self.scope.get('user')
        if not user or user.is_anonymous:
            await self.close()
            return

        self.group_name = f'notifications_{user.id}'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def notification_created(self, event):
        await self.send_json({
            'type': 'notification.created',
            'data': event['payload'],
        })
