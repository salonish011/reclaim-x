from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Conversation, Message, Notification
from .serializers import ConversationSerializer, MessageSerializer, NotificationSerializer
from items.models import Item

User = get_user_model()

# --- Conversations ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_conversations(request):
    convos = Conversation.objects.filter(participants=request.user).order_by('-created_at')
    serializer = ConversationSerializer(convos, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_conversation(request):
    """Start a conversation about a found item with the person who lost it."""
    item_id = request.data.get('item_id')
    receiver_id = request.data.get('receiver_id')
    first_message = request.data.get('message', 'Hi! I think I found your item.')

    if not item_id or not receiver_id:
        return Response(
            {'error': 'item_id and receiver_id are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        item = Item.objects.get(id=item_id)
        receiver = User.objects.get(id=receiver_id)
    except (Item.DoesNotExist, User.DoesNotExist):
        return Response({'error': 'Item or user not found'}, status=status.HTTP_404_NOT_FOUND)

    # Check if conversation already exists
    existing = Conversation.objects.filter(
        participants=request.user
    ).filter(
        participants=receiver
    ).filter(item=item).first()

    if existing:
        serializer = ConversationSerializer(existing)
        return Response(serializer.data)

    # Create new conversation
    convo = Conversation.objects.create(item=item)
    convo.participants.add(request.user, receiver)

    # Send first message
    Message.objects.create(
        conversation=convo,
        sender=request.user,
        content=first_message
    )

    # Send notification to the receiver (lost item owner)
    notification = Notification.objects.create(
        user=receiver,
        notification_type='match',
        title=f'Someone found your item: {item.title}!',
        message=f'{request.user.username} thinks they found your lost item "{item.title}". Check your messages!',
        item=item
    )

    serializer = ConversationSerializer(convo)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request, conversation_id):
    try:
        convo = Conversation.objects.get(id=conversation_id, participants=request.user)
    except Conversation.DoesNotExist:
        return Response({'error': 'Conversation not found'}, status=status.HTTP_404_NOT_FOUND)

    content = request.data.get('content', '').strip()
    if not content:
        return Response({'error': 'Message cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)

    msg = Message.objects.create(
        conversation=convo,
        sender=request.user,
        content=content
    )

    # Notify the other participant
    other_user = convo.participants.exclude(id=request.user.id).first()
    if other_user:
        notification = Notification.objects.create(
            user=other_user,
            notification_type='message',
            title=f'New message from {request.user.username}',
            message=content[:100],
            item=convo.item
        )

    serializer = MessageSerializer(msg)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_messages(request, conversation_id):
    try:
        convo = Conversation.objects.get(id=conversation_id, participants=request.user)
    except Conversation.DoesNotExist:
        return Response({'error': 'Conversation not found'}, status=status.HTTP_404_NOT_FOUND)

    # Mark messages as read
    convo.messages.exclude(sender=request.user).update(is_read=True)

    serializer = ConversationSerializer(convo)
    return Response(serializer.data, status=status.HTTP_200_OK)

# --- Notifications ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_notifications(request):
    notifs = Notification.objects.filter(user=request.user).order_by('-created_at')
    serializer = NotificationSerializer(notifs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, notification_id):
    try:
        notif = Notification.objects.get(id=notification_id, user=request.user)
        notif.is_read = True
        notif.save()
        return Response({'status': 'marked as read'}, status=status.HTTP_200_OK)
    except Notification.DoesNotExist:
        return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_all_notifications_read(request):
    Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
    return Response({'status': 'all marked as read'}, status=status.HTTP_200_OK)
