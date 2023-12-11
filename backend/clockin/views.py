from django.http import JsonResponse
from clockin.models import OrthodonticCheckIn
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.utils.dateparse import parse_time
from django.contrib.auth.models import User
import json
from datetime import datetime,timedelta

@csrf_exempt
#@login_required  #need to login before clockin
def orthodontic_check_in(request):
    print("Received request body:", request.body)  # Debug print
    if request.method == 'POST':
        # 假设前端发送的是JSON数据
        if not request.body:
            return JsonResponse({'error': 'Empty request body'}, status=400)
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError as e:
            return JsonResponse({'error': str(e)}, status=400)
        #data = json.loads(request.body)
        user_id = data.get('user_id')
        if user_id is None:
            return JsonResponse({'error': 'Missing user_id'}, status=400)
        
        # 使用 user_id 查找用户实例
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
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
