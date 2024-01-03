# your_app/tasks.py

from celery import shared_task
from .models import Reminder
from .utils.wechat_services import send_service_notification
from .utils.app_notifactions import send_app_notification

from datetime import datetime

@shared_task
def send_reminders():
    reminders = Reminder.objects.filter(reminder_time__lte=datetime.now())
    for reminder in reminders:
        try:
            # send_service_notification(
            #     openid=reminder.user_id, 
            #     template_id="2XZ1zgk0z54RJzorx0G-12uAtOAT8xKq4XaWLLUidsc", 
            #     data={"message": reminder.message}
            # )
            send_app_notification(reminder.user_id, f"Reminder: {reminder.message}")
            reminder.delete()  # 如果提醒发送后不再需要
        except Exception as e:
            # 处理异常，例如记录日志
            print(f"Failed to send reminder: {e}")

