from django.test import TestCase
from django.contrib.auth.models import User
from clockin.models import OrthodonticCheckIn
from datetime import datetime, timedelta

class ReportingTests(TestCase):
    def setUp(self):
        # 创建测试用户
        self.user = User.objects.create_user(username='testuser', password='12345')
        # 创建测试打卡数据
        for i in range(7):
            date = datetime.now().date() - timedelta(days=i)
            if not OrthodonticCheckIn.objects.filter(user=self.user, date=date).exists():
                OrthodonticCheckIn.objects.create(
                user=self.user,
                wear_time="20:00:00",
                date=date
            )


    def test_weekly_report(self):
        # 测试周报功能
        self.client.login(username='testuser', password='12345')
        response = self.client.get('/report/weekly/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('total_time', response.json())
        self.assertIn('average_time', response.json())

    def test_monthly_report(self):
        # 测试月报功能
        self.client.login(username='testuser', password='12345')
        response = self.client.get('/report/monthly/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('total_time', response.json())
        self.assertIn('average_time', response.json())
