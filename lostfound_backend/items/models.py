from django.db import models
from django.conf import settings

class Item(models.Model):
    STATUS_CHOICES = [
        ('lost', 'Lost'),
        ('found', 'Found'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    location = models.CharField(max_length=255)
    date = models.DateField()
    image = models.ImageField(upload_to='items/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.status.upper()} - {self.title}"
class Match(models.Model):
    lost_item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='lost_matches')
    found_item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='found_matches')
    score = models.FloatField(default=0.0)  # similarity/match score
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Match: {self.lost_item.title} <-> {self.found_item.title} (score: {self.score})"