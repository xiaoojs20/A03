# reminder/tests.py
from django.test import TestCase, Client
from django.urls import reverse
from .models import Reminder
from django.utils import timezone
from datetime import timedelta
import json
from unittest.mock import patch
from .tasks import send_reminders

# 测试模型
class ReminderModelTest(TestCase):

    def test_reminder_creation(self):
        # 创建提醒
        reminder = Reminder.objects.create(
            user_id="123456",
            reminder_time=timezone.now() + timedelta(days=1),
            message="Don't forget to subscribe!"
        )
        self.assertTrue(isinstance(reminder, Reminder))
        self.assertEqual(reminder.__str__(), reminder.message)

# 测试视图
class ReminderViewTest(TestCase):

    def setUp(self):
        self.url = reverse('reminder')
        self.reminder_data = {
            'user_id': '123456',
            'reminder_time': (timezone.now() + timedelta(days=1)).isoformat(),
            'message': 'Dont forget to subscribe!'
        }
        self.client = Client()

    def test_set_reminder_view(self):
        # 测试设置提醒的视图
        response = self.client.post(self.url, json.dumps(self.reminder_data), content_type="application/json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "success"})

    def test_invalid_request_method(self):
        # 测试无效的请求方法
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"message": "This endpoint requires a POST request."})

# 测试Celery任务
class ReminderTasksTest(TestCase):

    @patch('reminder.tasks.send_service_notification')
    def test_send_reminders_task(self, mock_send_notification):
        # 创建一个提醒，时间设置在过去
        reminder = Reminder.objects.create(
            user_id="123456",
            reminder_time=timezone.now() - timedelta(minutes=10),
            message="This is a test reminder"
        )
        # 执行Celery任务
        send_reminders()
        
        # 确认模拟的微信服务通知发送方法被调用
        mock_send_notification.assert_called_once_with(
            openid=reminder.user_id,
            template_id="2XZ1zgk0z54RJzorx0G-12uAtOAT8xKq4XaWLLUidsc",  # 这里应该是你微信模板的ID
            data={"message": reminder.message}
        )

        # 确认提醒已经发送并从数据库中删除
        self.assertEqual(Reminder.objects.count(), 0)