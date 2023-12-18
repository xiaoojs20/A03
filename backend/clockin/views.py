from django.http import JsonResponse
from clockin.models import OrthodonticCheckIn
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from user.models import User
import json
from django.utils import timezone
import pytz
from datetime import timedelta
# Set the desired timezone (Asia/Shanghai for Beijing time)
beijing_tz = pytz.timezone('Asia/Shanghai')
timezone.activate(beijing_tz)
@csrf_exempt
#@login_required
def orthodontic_check_in(request):
    if request.method == 'POST':
        if not request.body:
            return JsonResponse({'error': 'Empty request body'}, status=400)
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError as e:
            return JsonResponse({'error': str(e)}, status=400)

        user_id = data.get('user_id')
        if user_id is None:
            return JsonResponse({'error': 'Missing user_id'}, status=400)
        
        try:
            user = User.objects.get(user_id=user_id)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

        check_in_type = data.get('check_in_type')
        if check_in_type not in ['on', 'off']:
            return JsonResponse({'error': 'Invalid check-in type'}, status=400)
        try:
            user = User.objects.get(user_id=user_id)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        if check_in_type == 'on':
            last_off_checkin = OrthodonticCheckIn.objects.filter(
                user=user, check_in_type='off'
            ).order_by('-date').first()

        if last_off_checkin:
            duration_since_last_off = timezone.now() - last_off_checkin.date
            if duration_since_last_off > timedelta(minutes=30):
                # 调用提醒功能
                set_reminder_for_user(user.id)
        OrthodonticCheckIn.objects.create(
            user=user,
            check_in_type=check_in_type,
            date=timezone.now().strftime("%Y-%m-%d %H:%M:%S")
        )
        return JsonResponse({'success': 'Check-in recorded'}, status=201)

    return JsonResponse({'error': 'Invalid request'}, status=400)

def set_reminder_for_user(user_id):
    reminder_time = timezone.now() + timedelta(minutes=1)  # 假设提醒是在 1 分钟后发送
    message = "Please remember to wear your braces"

    # 调用 reminder 应用的功能
    # 您可能需要稍微修改 reminder 应用的代码以使其可以被外部调用
    from reminder.models import Reminder
    Reminder.objects.create(user_id=str(user_id), reminder_time=reminder_time, message=message)


# 计算每一天的佩戴时间
def daily_check_in_duration(user, start_date, end_date):
    duration_list = []
    current_date = start_date

    while current_date < end_date:
        next_day = current_date + timedelta(days=1)
        check_ins = OrthodonticCheckIn.objects.filter(
            user=user,
            date__range=[current_date, next_day]
        ).order_by('date')

        total_duration = timedelta(0)
        last_on_time = None

        for check_in in check_ins:
            if check_in.check_in_type == 'on':
                last_on_time = check_in.date
            elif check_in.check_in_type == 'off' and last_on_time:
                total_duration += check_in.date - last_on_time
                last_on_time = None

        duration_list.append(total_duration)
        current_date = next_day

    return duration_list

# 计算每一周的佩戴时间
def weekly_check_in_duration(user, start_date, end_date):
    duration_list = []

    while start_date < end_date:
        week_end_date = start_date + timedelta(days=7)
        week_duration = daily_check_in_duration(user, start_date, week_end_date)
        total_week_duration = sum(week_duration, timedelta(0))
        duration_list.append(total_week_duration)
        start_date = week_end_date

    return duration_list

# 生成周报或月报
def generate_report(request, report_type):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError as e:
        return JsonResponse({'error': str(e)}, status=400)

    user_id = data.get('user_id')
    if user_id is None:
        return JsonResponse({'error': 'Missing user_id'}, status=400)
    
    try:
        user = User.objects.get(user_id=user_id)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

    today = timezone.now()

    if report_type == 'weekly':
        start_date = today - timedelta(days=today.weekday())
        end_date = start_date + timedelta(days=7)
        report_data = daily_check_in_duration(user, start_date, end_date)
    elif report_type == 'monthly':
        start_date = today.replace(day=1)
        end_date = (start_date + timedelta(days=32)).replace(day=1)
        report_data = weekly_check_in_duration(user, start_date, end_date)

    # 返回或处理报告结果
