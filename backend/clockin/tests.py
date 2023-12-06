from django.test import TestCase, Client
from django.contrib.auth.models import User
from .models import OrthodonticCheckIn
from django.utils import timezone
from django.urls import reverse
from datetime import time, timedelta,datetime
import json
from django.utils.timezone import make_aware, get_current_timezone
import pytz
class OrthodonticCheckInModelTests(TestCase):
    def setUp(self):
        # 创建一个用户进行测试
        self.user = User.objects.create_user(username='testuser', password='12345')

    def test_check_in_creation(self):
        # 测试创建打卡记录
        check_in = OrthodonticCheckIn.objects.create(
            user=self.user,
            wear_time=time(2, 30),  # 假设用户佩戴了2小时30分钟
            date=timezone.now().date()
        )
        
        self.assertEqual(check_in.user, self.user)
        self.assertEqual(check_in.wear_time, time(2, 30))
        self.assertEqual(check_in.date, timezone.now().date())

class OrthodonticCheckInViewTests(TestCase):
    def setUp(self):
        # 创建一个用户进行测试
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.client = Client()
        self.client.login(username='testuser', password='12345')

    def test_check_in_view(self):
        # 使用 'reverse' 函数获取 URL
        url = reverse('clockin')  # 使用 urlpatterns 中定义的 name

        # 发送 POST 请求
        response = self.client.post(url, {'wear_time': '02:30:00'}, content_type='application/json')

        # 检查是否成功并返回了201状态码
        self.assertEqual(response.status_code, 201)

    def test_check_in_view_without_login(self):
        # 使用 'reverse' 函数获取 URL
        url = reverse('clockin')
        
        # 创建一个新的客户端实例，不进行登录
        new_client = Client()
        
        # 发送 POST 请求
        response = new_client.post(url, {'wear_time': '02:30:00'}, content_type='application/json')
        
        # 检查是否因为未登录而返回了重定向状态码
        self.assertEqual(response.status_code, 302)  # 302 是未登录时的重定向状态码

    def test_check_in_view_bad_request(self):
        # 测试视图对于错误格式的请求是否返回400状态码
        url = reverse('clockin')  # 使用 urlpatterns 中定义的 name

        # 发送 POST 请求
        response = self.client.post(url, {'wear_time': 'not a time'}, content_type='application/json')
        #print(response)
        # 检查是否因为错误的数据格式而返回了400状态码
        self.assertEqual(response.status_code, 400)
    def test_check_in_user_association(self):
        # Create a second user
        second_user = User.objects.create_user(username='seconduser', password='67890')
        # Create a check-in for the second user
        check_in = OrthodonticCheckIn.objects.create(
            user=second_user,
            wear_time=time(1, 0),  # 1 hour
            date=timezone.now().date()
        )
        # Assert that the check-in is associated with the second user
        self.assertEqual(check_in.user, second_user)
    def test_check_in_creation_current_date(self):
        url = reverse('clockin')  # Adjust with the correct URL name
        response = self.client.post(url, json.dumps({'wear_time': '02:30:00'}), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        check_in = OrthodonticCheckIn.objects.get(user=self.user)
        self.assertEqual(check_in.date, datetime.today().date())
    def test_check_in_update(self):
        check_in = OrthodonticCheckIn.objects.create(
            user=self.user,
            wear_time=time(2, 30),
            date=timezone.now().date()
        )
        check_in.wear_time = time(3, 0)  # Update to 3 hours
        check_in.save()
        updated_check_in = OrthodonticCheckIn.objects.get(id=check_in.id)
        self.assertEqual(updated_check_in.wear_time, time(3, 0))
    def test_check_in_deletion(self):
        check_in = OrthodonticCheckIn.objects.create(
            user=self.user,
            wear_time=time(2, 30),
            date=timezone.now().date()
        )
        check_in_id = check_in.id
        check_in.delete()
        with self.assertRaises(OrthodonticCheckIn.DoesNotExist):
            OrthodonticCheckIn.objects.get(id=check_in_id)
    def test_check_in_view_invalid_data(self):
        url = reverse('clockin')
        response = self.client.post(url, {}, content_type='application/json')
        self.assertEqual(response.status_code, 400)  # Bad request due to missing data
    def test_check_in_view_response_format(self):
        url = reverse('clockin')
        response = self.client.post(url, {'wear_time': '02:30:00'}, content_type='application/json')
        self.assertEqual(response['Content-Type'], 'application/json')


    def test_check_in_timezone_handling(self):
        #local_tz = get_current_timezone()
        local_time = timezone.localtime(timezone.now())
        check_in = OrthodonticCheckIn.objects.create(
            user=self.user,
            wear_time=time(2, 30),
            date=local_time.date()
        )
        self.assertEqual(check_in.date, local_time.date())
    
