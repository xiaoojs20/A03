from django.test import TestCase, Client
from django.http import JsonResponse
from user.models import User
from .models import OrthodonticCheckIn
from .views import monthly_check_in_duration,weekly_check_in_duration
from reminder.models import Reminder
from datetime import datetime, timedelta
from django.utils import timezone
from django.urls import reverse
import json
import pytz

beijing_tz = pytz.timezone('Asia/Shanghai')
timezone.activate(beijing_tz)
# class OrthodonticCheckInModelTests(TestCase):
#     def setUp(self):
#         # 创建一个用户进行测试
#         self.user = User.objects.create(
#             user_id='testuser123', 
#             nickname='Test User', 
#             gender=0,
#             # 其他必需的字段...
#         )

#     def test_check_in_creation(self):
#         # 测试创建打卡记录
#         check_in = OrthodonticCheckIn.objects.create(
#             user=self.user,
#             check_in_type="on",
#             date=timezone.now().strftime("%Y-%m-%d %H:%M:%S")
#         )
        
#         self.assertEqual(check_in.user, self.user)
#         self.assertEqual(check_in.check_in_type, "on")
#         self.assertEqual(check_in.date, timezone.now().strftime("%Y-%m-%d %H:%M:%S"))


# class OrthodonticCheckInViewTests(TestCase):

#     def setUp(self):
#         # 创建一个用户进行测试
#         self.user = User.objects.create(
#             user_id='o-Hbd6RvDXxQl0_cZ3_HKHPwNyGo', 
#             nickname='Test User', 
#             gender=0,
#             # 其他必需的字段...
#         )

#     def test_check_in_view(self):
#         url = reverse('clockin')  # 使用 urlpatterns 中定义的 name
#         user_id = self.user.user_id  # 使用自定义 User 的 user_id

#         # 发送 POST 请求，包含 user_id 和 check_in_type
#         response = self.client.post(url, json.dumps({'user_id': user_id, 'check_in_type': 'on'}), content_type='application/json')

#         # 检查是否成功并返回了201状态码
#         self.assertEqual(response.status_code, 201)

#     def test_check_in_view_with_invalid_user_id(self):
#         url = reverse('clockin')
#         invalid_user_id = 'invalid123'  # 假设的无效用户 ID

#         # 发送 POST 请求
#         response = self.client.post(url, json.dumps({'user_id': invalid_user_id, 'check_in_type': 'on'}), content_type='application/json')

#         # 检查是否因为无效的用户而返回了404状态码
#         self.assertEqual(response.status_code, 404)

#     def test_check_in_view_without_login(self):
#         url = reverse('clockin')
#         new_client = Client()
        
#         # 发送 POST 请求
#         response = new_client.post(url, json.dumps({'check_in_type': 'on'}), content_type='application/json')
#         #import pdb;pdb.set_trace()
#         # 检查是否因为未登录而返回了重定向状态码
#         self.assertEqual(response.status_code, 302)  # 302

#     def test_check_in_view_bad_request(self):
#         url = reverse('clockin')

#         # 发送 POST 请求，但不包含必需的字段
#         response = self.client.post(url, json.dumps({'check_in_type': 'off'}), content_type='application/json')
        
#         # 检查是否因为缺少必要字段而返回了400状态码
#         self.assertEqual(response.status_code, 400)
#     def test_check_in_view_invalid_data(self):
#         url = reverse('clockin')

#         # 发送 POST 请求，但包含无效数据
#         response = self.client.post(url, json.dumps({'user_id': self.user.user_id, 'check_in_type': '无效类型'}), content_type='application/json')

#         # 检查是否因为无效的数据而返回了400状态码
#         self.assertEqual(response.status_code, 400)
#     def test_check_in_user_association(self):
#     # Create a second user
#         second_user = User.objects.create(
#             user_id='seconduser123', 
#             nickname='Second User', 
#             gender=0,
#             # 其他必需的字段...
#         )

#         # Create a check-in for the second user
#         check_in = OrthodonticCheckIn.objects.create(
#             user=second_user,
#             check_in_type="on",  # Using check_in_type instead of wear_time
#             date=timezone.now().date()
#         )

#         # Assert that the check-in is associated with the second user
#         self.assertEqual(check_in.user, second_user)


#     def test_check_in_update(self):
#     # Create a check-in
#         check_in = OrthodonticCheckIn.objects.create(
#             user=self.user,
#             check_in_type="on",
#             date=timezone.now().date()
#         )

#         # Update check-in type
#         check_in.check_in_type = "off"  # Update to a different check-in type
#         check_in.save()

#         # Retrieve the updated check-in
#         updated_check_in = OrthodonticCheckIn.objects.get(id=check_in.id)
#         self.assertEqual(updated_check_in.check_in_type, "off")



#     def test_check_in_view_response_format(self):
#         url = reverse('clockin')

#         # 发送 POST 请求
#         response = self.client.post(url, json.dumps({'user_id': self.user.user_id, 'check_in_type': 'off'}), content_type='application/json')

#         # 检查响应的内容类型
#         self.assertEqual(response['Content-Type'], 'application/json')

# class ReminderTest(TestCase):
#     def setUp(self):
#         # 创建测试用户
#         self.user_id = "o-Hbd6bbDxfCqNpz5xsTgMLKDR3Q"
#         self.user = User.objects.create(nickname='testuser',  user_id=self.user_id)
#         #self.user = User.objects.get(user_id="o-Hbd6elFpEblsXZK3goBvtGOnv4")
#         self.client = Client()

#         # 创建一条早于 30 分钟的 off 打卡记录
#         OrthodonticCheckIn.objects.create(
#             user=self.user,
#             check_in_type='off',
#             date=datetime.now() - timedelta(minutes=32)
#         )
#         #import pdb;pdb.set_trace()

#     def test_reminder_trigger(self):
#         # 准备请求数据

#         data = json.dumps({
#             'user_id': self.user_id,
#             'check_in_type': 'on'
#         })

#         # 发送 POST 请求到 set_time 视图
#         url = reverse('clockin')  # 确保 'clockin' 是正确的 URL 名称
#         response = self.client.post(url, data, content_type='application/json')
#         #print(response.status_code)
#         #import pdb;pdb.set_trace()
#         # 检查响应状态码
#         self.assertEqual(response.status_code, 201)

#         # 验证是否正确创建了提醒
#         #import pdb;pdb.set_trace()
#         self.assertTrue(Reminder.objects.filter(user_id=self.user_id).exists())
#     def test_no_reminder_trigger_for_short_duration(self):
#         OrthodonticCheckIn.objects.create(
#             user=self.user,
#             check_in_type='off',
#             date=datetime.now() - timedelta(minutes=10)
#         )
#         data = json.dumps({
#             'user_id': self.user.user_id,
#             'check_in_type': 'on'
#         })
#         url = reverse('clockin')
#         response = self.client.post(url, data, content_type='application/json')
#         self.assertEqual(response.status_code, 201)
#         self.assertFalse(Reminder.objects.filter(user_id=self.user.user_id).exists())

# class WeeklyCheckInDurationTest(TestCase):
#     def setUp(self):
#         self.user = User.objects.create(
#             user_id='o-Hbd6RvDXxQl0_cZ3_HKHPwNyGo', 
#             nickname='Test User', 
#             gender=0,
#             # 其他必需的字段...
#         )
#         self.duration_per_day = timedelta(hours=2) 
#         # 假设一周内的几个不同天有打卡记录
#         for i in range(7):
#             OrthodonticCheckIn.objects.create(
#                 user=self.user,
#                 check_in_type='on',
#                 date=datetime.now() - timedelta(days=i, hours=3)
#             )
#             OrthodonticCheckIn.objects.create(
#                 user=self.user,
#                 check_in_type='off',
#                 date=datetime.now() - timedelta(days=i,hours=2)
#             )
#             OrthodonticCheckIn.objects.create(
#                 user=self.user,
#                 check_in_type='on',
#                 date=datetime.now() - timedelta(days=i, hours=1)
#             )
#             OrthodonticCheckIn.objects.create(
#                 user=self.user,
#                 check_in_type='off',
#                 date=datetime.now() - timedelta(days=i)
#             )

#     def test_weekly_check_in_duration(self):
#         start_date = datetime.now() - timedelta(days=7)
#         end_date = start_date + timedelta(days=7)
#         duration_list = weekly_check_in_duration(self.user, start_date, end_date)
#         # 验证 duration_list 中每一项是否符合预期
#         expected_daily_duration = self.duration_per_day
#         expected_weekly_duration = expected_daily_duration * 7
#         #import pdb;pdb.set_trace()
#         # 验证每天的持续时间
#         for daily_duration in duration_list:
#             self.assertEqual(int(daily_duration.total_seconds()), int(expected_daily_duration.total_seconds()))

#         # 计算整周的总持续时间并与预期比较
#         total_week_duration = sum(duration_list, timedelta(0))
#         #import pdb;pdb.set_trace()
#         self.assertEqual(int(total_week_duration.total_seconds()), int(expected_weekly_duration.total_seconds()))

class MonthlyCheckInDurationTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            user_id='o-Hbd6RvDXxQl0_cZ3_HKHPwNyGo', 
            nickname='Test User', 
            gender=0,
            # 其他必需的字段...
        )
        self.duration_per_day=timedelta(hours=2)
        self.duration_per_week = 7*self.duration_per_day  # 假设每天持续时间为1小时

        # 为一个月中的每一天创建打卡记录
        end_date = datetime.now()
        start_date =  end_date-timedelta(days=31)
        current_date = start_date
        #import pdb;pdb.set_trace()
        while current_date < end_date:
            # 每天的“on”打卡时间
            on_time = current_date - timedelta(hours=4)
            OrthodonticCheckIn.objects.create(user=self.user, check_in_type='on', date=on_time)
            
            # 每天的“off”打卡时间，1小时后
            off_time = on_time + self.duration_per_day/2
            OrthodonticCheckIn.objects.create(user=self.user, check_in_type='off', date=off_time)

            on_time = current_date - timedelta(hours=2)
            OrthodonticCheckIn.objects.create(user=self.user, check_in_type='on', date=on_time)
            
            # 每天的“off”打卡时间，1小时后
            off_time = on_time + self.duration_per_day/2
            OrthodonticCheckIn.objects.create(user=self.user, check_in_type='off', date=off_time)
            # 移至下一天
            current_date += timedelta(days=1)
            #import pdb;pdb.set_trace()

    def test_monthly_check_in_duration(self):
        end_date = datetime.now()-timedelta(days=1)
        start_date = (end_date - timedelta(days=28))
        #import pdb;pdb.set_trace()
        duration_list = monthly_check_in_duration(self.user, start_date, end_date)

        # 验证 duration_list 中每一项是否符合预期
        expected_weekly_duration = self.duration_per_week
        expected_monthly_duration = expected_weekly_duration * 4
        #import pdb;pdb.set_trace()
        for weekly_duration in duration_list:
            self.assertEqual(int(weekly_duration.total_seconds()/3600), int(expected_weekly_duration.total_seconds()/3600))


        # 计算整个月的总持续时间并与预期比较
        total_month_duration = sum(duration_list, timedelta(0))
        self.assertEqual(int(total_month_duration.total_seconds()/3600), int(expected_monthly_duration.total_seconds()/3600))