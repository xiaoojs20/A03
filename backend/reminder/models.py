from django.db import models

# Create your models here.
class Reminder(models.Model):
    user_id = models.CharField(max_length=100)  
    reminder_time = models.DateTimeField()      
    message = models.TextField()                