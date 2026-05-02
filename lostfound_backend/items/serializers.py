from rest_framework import serializers
from .models import Item, Match

class ItemSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)

    class Meta:
        model = Item
        fields = ['id', 'user', 'user_id', 'title', 'description', 'status', 'location', 'date', 'image', 'created_at']
        read_only_fields = ['user', 'created_at']

class MatchItemSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)

    class Meta:
        model = Item
        fields = ['id', 'title', 'description', 'location', 'user_id']

class MatchSerializer(serializers.ModelSerializer):
    lost_item = MatchItemSerializer(read_only=True)
    found_item = MatchItemSerializer(read_only=True)
    confidence_score = serializers.IntegerField(source='score', read_only=True)

    class Meta:
        model = Match
        fields = ['id', 'lost_item', 'found_item', 'confidence_score', 'created_at']