from django.db import models
from django.contrib.auth.models import User
from django.utils.dateparse import parse_time
class OrthodonticCheckIn(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    wear_time = models.TimeField()  # 用户输入的佩戴时间
    def save(self, *args, **kwargs):
        if isinstance(self.wear_time, str):
            # 如果 wear_time 是字符串，尝试解析它
            parsed_time = parse_time(self.wear_time)
            if parsed_time is not None:
                self.wear_time = parsed_time
            else:
                # 如果字符串无法解析为时间，可以抛出异常或选择其他处理方式
                raise ValueError("Invalid time format")
        super(OrthodonticCheckIn, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.wear_time}"
    class Meta:
        unique_together = ('user', 'date')  # 确保每个用户每天只有一个记录