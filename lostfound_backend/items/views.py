from rest_framework import viewsets, permissions, generics
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from .models import Item, Match
from .serializers import ItemSerializer, MatchSerializer
import os

# --- YOLO Model (lazy loaded) ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'ml_models', 'best.pt')
model = None

def get_model():
    global model
    if model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"YOLO model not found at {MODEL_PATH}")
        from ultralytics import YOLO
        model = YOLO(MODEL_PATH)
    return model

# --- Matching Algorithm ---
def run_matching(new_item):
    from difflib import SequenceMatcher

    def similarity(a, b):
        return SequenceMatcher(None, a.lower(), b.lower()).ratio() * 100

    if new_item.status == 'found':
        lost_items = Item.objects.filter(status='lost').exclude(user=new_item.user)
        for lost in lost_items:
            score = (
                similarity(new_item.title, lost.title) * 0.5 +
                similarity(new_item.description, lost.description) * 0.3 +
                similarity(new_item.location, lost.location) * 0.2
            )
            if score >= 30:
                Match.objects.get_or_create(
                    lost_item=lost,
                    found_item=new_item,
                    defaults={'score': round(score, 2)}
                )

    elif new_item.status == 'lost':
        found_items = Item.objects.filter(status='found').exclude(user=new_item.user)
        for found in found_items:
            score = (
                similarity(new_item.title, found.title) * 0.5 +
                similarity(new_item.description, found.description) * 0.3 +
                similarity(new_item.location, found.location) * 0.2
            )
            if score >= 30:
                Match.objects.get_or_create(
                    lost_item=new_item,
                    found_item=found,
                    defaults={'score': round(score, 2)}
                )

# --- Item API ---
class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Item.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        item = serializer.save(user=self.request.user)
        run_matching(item)

# --- Public Browse ---
class PublicItemListView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Item.objects.all().order_by('-created_at')

# --- Match List ---
class MatchListView(ListAPIView):
    serializer_class = MatchSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        from django.db.models import Q
        user = self.request.user
        return Match.objects.filter(
            Q(lost_item__user=user) | Q(found_item__user=user)
        ).order_by('-id')

# --- YOLO Prediction API ---
@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def predict(request):
    if 'image' not in request.FILES:
        return Response({'error': 'No image provided'}, status=400)

    try:
        yolo_model = get_model()
    except FileNotFoundError as e:
        return Response({'error': str(e)}, status=503)

    from PIL import Image
    image_file = request.FILES['image']
    image = Image.open(image_file).convert('RGB')
    results = yolo_model(image)

    predictions = []
    for result in results:
        for box in result.boxes:
            predictions.append({
                'label': yolo_model.names[int(box.cls)],
                'confidence': float(box.conf),
                'bbox': box.xyxy[0].tolist()
            })

    return Response({
        'predictions': predictions,
        'total_detected': len(predictions)
    })