from django.db import models
from django.contrib.auth.models import User

class OrthodonticCheckIn(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    wear_time = models.TimeField()  # 用户输入的佩戴时间

    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.wear_time}"
