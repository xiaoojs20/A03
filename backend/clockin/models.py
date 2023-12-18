from django.db import models
from user.models import User

class OrthodonticCheckIn(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    check_in_type = models.CharField(max_length=20)  # 打卡类型：'摘下牙套' off 或 '带上牙套'on

    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.check_in_type}"
