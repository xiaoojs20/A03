from django.test import TestCase, Client
from user.models import User
from .models import OrthodonticCheckIn
from django.utils import timezone
from django.urls import reverse
import json
import pytz

beijing_tz = pytz.timezone('Asia/Shanghai')
timezone.activate(beijing_tz)
class OrthodonticCheckInModelTests(TestCase):
    def setUp(self):
        # 创建一个用户进行测试
        self.user = User.objects.create(
            user_id='testuser123', 
            nickname='Test User', 
            gender=0,
            # 其他必需的字段...
        )

    def test_check_in_creation(self):
        # 测试创建打卡记录
        check_in = OrthodonticCheckIn.objects.create(
            user=self.user,
            check_in_type="on",
            date=timezone.now().strftime("%Y-%m-%d %H:%M:%S")
        )
        
        self.assertEqual(check_in.user, self.user)
        self.assertEqual(check_in.check_in_type, "on")
        self.assertEqual(check_in.date.strftime("%Y-%m-%d %H:%M:%S"), timezone.now().strftime("%Y-%m-%d %H:%M:%S"))


class OrthodonticCheckInViewTests(TestCase):

    def setUp(self):
        # 创建一个用户进行测试
        self.user = User.objects.create(
            user_id='o-Hbd6RvDXxQl0_cZ3_HKHPwNyGo', 
            nickname='Test User', 
            gender=0,
            # 其他必需的字段...
        )

    def test_check_in_view(self):
        url = reverse('clockin')  # 使用 urlpatterns 中定义的 name
        user_id = self.user.user_id  # 使用自定义 User 的 user_id

        # 发送 POST 请求，包含 user_id 和 check_in_type
        response = self.client.post(url, json.dumps({'user_id': user_id, 'check_in_type': 'on'}), content_type='application/json')

        # 检查是否成功并返回了201状态码
        self.assertEqual(response.status_code, 201)

    def test_check_in_view_with_invalid_user_id(self):
        url = reverse('clockin')
        invalid_user_id = 'invalid123'  # 假设的无效用户 ID

        # 发送 POST 请求
        response = self.client.post(url, json.dumps({'user_id': invalid_user_id, 'check_in_type': 'on'}), content_type='application/json')

        # 检查是否因为无效的用户而返回了404状态码
        self.assertEqual(response.status_code, 404)

    def test_check_in_view_without_login(self):
        url = reverse('clockin')
        new_client = Client()
        
        # 发送 POST 请求
        response = new_client.post(url, json.dumps({'check_in_type': 'on'}), content_type='application/json')
        
        # 检查是否因为未登录而返回了重定向状态码
        self.assertEqual(response.status_code, 302)  # 302

    def test_check_in_view_bad_request(self):
        url = reverse('clockin')

        # 发送 POST 请求，但不包含必需的字段
        response = self.client.post(url, json.dumps({'check_in_type': 'off'}), content_type='application/json')
        
        # 检查是否因为缺少必要字段而返回了400状态码
        self.assertEqual(response.status_code, 400)
    def test_check_in_view_invalid_data(self):
        url = reverse('clockin')

        # 发送 POST 请求，但包含无效数据
        response = self.client.post(url, json.dumps({'user_id': self.user.user_id, 'check_in_type': '无效类型'}), content_type='application/json')

        # 检查是否因为无效的数据而返回了400状态码
        self.assertEqual(response.status_code, 400)
    def test_check_in_user_association(self):
    # Create a second user
        second_user = User.objects.create(
            user_id='seconduser123', 
            nickname='Second User', 
            gender=0,
            # 其他必需的字段...
        )

        # Create a check-in for the second user
        check_in = OrthodonticCheckIn.objects.create(
            user=second_user,
            check_in_type="on",  # Using check_in_type instead of wear_time
            date=timezone.now().date()
        )

        # Assert that the check-in is associated with the second user
        self.assertEqual(check_in.user, second_user)


    def test_check_in_update(self):
    # Create a check-in
        check_in = OrthodonticCheckIn.objects.create(
            user=self.user,
            check_in_type="on",
            date=timezone.now().date()
        )

        # Update check-in type
        check_in.check_in_type = "off"  # Update to a different check-in type
        check_in.save()

        # Retrieve the updated check-in
        updated_check_in = OrthodonticCheckIn.objects.get(id=check_in.id)
        self.assertEqual(updated_check_in.check_in_type, "off")



    def test_check_in_view_response_format(self):
        url = reverse('clockin')

        # 发送 POST 请求
        response = self.client.post(url, json.dumps({'user_id': self.user.user_id, 'check_in_type': 'off'}), content_type='application/json')

        # 检查响应的内容类型
        self.assertEqual(response['Content-Type'], 'application/json')

