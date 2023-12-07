from django.http import JsonResponse
from clockin.models import OrthodonticCheckIn
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.utils.dateparse import parse_time
from django.contrib.auth.models import User
import json
from datetime import datetime,timedelta

@csrf_exempt
@login_required  #need to login before clockin
def orthodontic_check_in(request):
    if request.method == 'POST':
        # 假设前端发送的是JSON数据
        data = json.loads(request.body)
        user = request.user
        wear_time = data.get('wear_time')
        if wear_time is None:
            return JsonResponse({'error': 'Missing wear_time'}, status=400)
        # 解析时间字符串为 Time 对象
        parsed_time = parse_time(wear_time)
        if parsed_time is None:
            return JsonResponse({'error': 'Invalid time format'}, status=400)

        # 创建新的打卡记录
        OrthodonticCheckIn.objects.create(
            user=user,
            wear_time=parsed_time,
            date=(datetime.today()-timedelta(days=1)).strftime('%Y-%m-%d')
        )
        return JsonResponse({'success': 'Check-in recorded'}, status=201)

    return JsonResponse({'error': 'Invalid request'}, status=400)
