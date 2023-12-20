from django.test import TestCase, Client
from django.urls import reverse
from .models import SystemNotification
import json

class NotificationTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_create_notification(self):
        # 测试创建通知
        url = reverse('create_notification')
        data = {
            'user_id': 'test_user',
            'message': 'This is a test notification'
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(SystemNotification.objects.count(), 1)
        self.assertEqual(SystemNotification.objects.first().message, 'This is a test notification')

    def test_get_system_notifications(self):
        # 先创建一个通知
        SystemNotification.objects.create(user_id='test_user', message='Test Notification')

        # 测试获取通知
        url = reverse('notifications:get_system_notifications', kwargs={'user_id': 'test_user'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        notifications = json.loads(response.content)
        self.assertEqual(len(notifications), 1)
        self.assertEqual(notifications[0]['message'], 'Test Notification')
