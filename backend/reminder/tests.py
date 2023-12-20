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
            reminder_time=timezone.now() + timedelta(seconds=10),
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
            'reminder_time': "2023-12-06T15:30:00",#(timezone.now() + timedelta(days=1)).isoformat(),
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
    def test_set_reminder_with_invalid_data(self):
    # 测试缺少用户ID的情况
        invalid_data = self.reminder_data.copy()
        del invalid_data['user_id']
        response = self.client.post(self.url, json.dumps(invalid_data), content_type="application/json")
        self.assertNotEqual(response.status_code, 200)
    def test_reminder_creation_at_current_time(self):
        # 创建提醒，时间设置为当前时间
        reminder = Reminder.objects.create(
            user_id="123456",
            reminder_time=timezone.now(),
            message="Reminder at current time!"
        )
        self.assertTrue(isinstance(reminder, Reminder))
    def test_reminder_creation_at_current_time(self):
        # 创建提醒，时间设置为当前时间
        reminder = Reminder.objects.create(
            user_id="123456",
            reminder_time=timezone.now(),
            message="Reminder at current time!"
        )
        self.assertTrue(isinstance(reminder, Reminder))
    @patch('reminder.tasks.send_service_notification')
    def test_send_reminders_task_with_exception(self, mock_send_notification):
        mock_send_notification.side_effect = Exception("Service unavailable")
        reminder = Reminder.objects.create(
            user_id="123456",
            reminder_time=timezone.now() - timedelta(minutes=10),
            message="This is a test reminder"
        )
        send_reminders()
        # 确认即使出现异常，提醒也不会从数据库中删除
        self.assertEqual(Reminder.objects.count(), 1)

    def test_no_reminder_sent_for_future_time(self):
        reminder = Reminder.objects.create(
            user_id="123456",
            reminder_time=timezone.now() + timedelta(minutes=1000000),
            message="Future test reminder"
        )
        send_reminders()
        self.assertEqual(Reminder.objects.count(), 1)
    def test_detailed_error_message_on_invalid_input(self):
        invalid_data = {"user_id": "123456"}  # 缺少其他必要字段
        response = self.client.post(self.url, json.dumps(invalid_data), content_type="application/json")
        self.assertNotEqual(response.status_code, 200)
        self.assertIn("error", response.json())



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
        import pdb;pdb.set_trace()
        # 确认模拟的微信服务通知发送方法被调用
        mock_send_notification.assert_called_once_with(
            openid=reminder.user_id,
            template_id="2XZ1zgk0z54RJzorx0G-12uAtOAT8xKq4XaWLLUidsc",  # 这里应该是你微信模板的ID
            data={"message": reminder.message}
        ) 

        # 确认提醒已经发送并从数据库中删除
        self.assertEqual(Reminder.objects.count(), 0)

from django.test import TestCase, Client
from django.urls import reverse
from .models import Reminder
from datetime import datetime

class ReminderTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.reminder = Reminder.objects.create(
            user_id="test_user",
            reminder_time=datetime.now(),
            message="Test Reminder"
        )

    def test_update_reminder(self):
        url = reverse('modify')  # 确保在您的 urls.py 中设置了名为 'update_reminder' 的路由
        data = {
            'id': self.reminder.id,
            'user_id': "test_user",
            'reminder_time':"2023-12-20T17:00:00",
            'message': 'Updated Reminder',

        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        #import pdb;pdb.set_trace()
        self.assertEqual(response.status_code, 200)
        #import pdb;pdb.set_trace()
        print(Reminder.objects.all())
        updated_reminder = Reminder.objects.get(id=self.reminder.id)
        #self.assertEqual(updated_reminder.user_id, 'updated_user')
        self.assertEqual(updated_reminder.message, 'Updated Reminder')

    def test_delete_reminder(self):
        url = reverse('delete')  # 确保在您的 urls.py 中设置了名为 'delete_reminder' 的路由
        data = {'id': self.reminder.id}
        response = self.client.delete(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)

        with self.assertRaises(Reminder.DoesNotExist):
            Reminder.objects.get(id=self.reminder.id)

    # 您还可以添加更多测试用例，例如测试无效请求或错误处理
class ReminderTestCase1(TestCase):
    def setUp(self):
        # 设置测试客户端
        self.client = Client()

        # 创建一些测试数据
        Reminder.objects.create(user_id="user1", reminder_time=datetime.now(), message="Test Reminder 1")
        Reminder.objects.create(user_id="user2", reminder_time=datetime.now(), message="Test Reminder 2")

    def test_view_all_reminders(self):
        # 测试获取所有提醒
        response = self.client.get(reverse('view_reminders'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['reminders']), 2)

    def test_view_user_reminders(self):
        # 测试获取特定用户的提醒
        response = self.client.get(reverse('view_reminders') + '?user_id=user1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['reminders']), 1)

    def test_no_reminders_found(self):
        # 测试没有找到提醒的情况
        response = self.client.get(reverse('view_reminders') + '?user_id=kkk')
        self.assertEqual(json.loads(response.content.decode('utf-8'))["reminders"], [])