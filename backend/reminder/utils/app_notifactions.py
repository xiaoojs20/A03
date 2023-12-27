# your_app/utils/app_notifications.py

import requests
from django.conf import settings
from notifications.models import SystemNotification  # 导入 SystemNotification 模型

def send_app_notification(user_id, message):
    """
    发送通知到小程序的系统通知中，并存储到数据库
    :param user_id: 接收通知的用户 ID
    :param message: 要发送的消息内容
    """
    # 将通知保存到数据库
    SystemNotification.objects.create(user_id=user_id, message=message)

    # 发送通知到小程序（假设有这样的接口）
    url = f'http://localhost:8000/notifications/notifications/{user_id}'  # 小程序的系统通知接口 URL
    payload = {
        "user_id": user_id,
        "message": message
    }
    response = requests.post(url, json=payload)
    return response.json()
