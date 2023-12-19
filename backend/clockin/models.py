from django.db import models
from user.models import User
from django.utils import timezone
import pytz

beijing_tz = pytz.timezone('Asia/Shanghai')
timezone.activate(beijing_tz)
class OrthodonticCheckIn(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField()
    check_in_type = models.CharField(max_length=20)  # 打卡类型：'摘下牙套' off 或 '带上牙套'on

    def __str__(self):
        return f"{self.user.nickname} - {self.date} - {self.check_in_type}"
