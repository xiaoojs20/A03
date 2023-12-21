from django.test import TestCase, Client
from django.urls import reverse
from .models import SystemNotification
import json

class NotificationTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user_id = 'test_user'
        SystemNotification.objects.create(user_id=self.user_id, message='Test Notification')

    def test_get_system_notifications(self):
        url = reverse('get_system_notifications', kwargs={'user_id': self.user_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        notifications = json.loads(response.content)
        self.assertEqual(len(notifications), 1)
        self.assertEqual(notifications[0]['message'], 'Test Notification')
    def test_create_notification(self):
        url = reverse('create_notification')
        data = {
            'user_id': self.user_id,
            'message': 'This is a test notification'
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(SystemNotification.objects.count(), 2)  # Assuming one was already created in setUp
        self.assertEqual(SystemNotification.objects.last().message, 'This is a test notification')
