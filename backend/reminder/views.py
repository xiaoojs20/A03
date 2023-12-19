from django.shortcuts import render
from django.http import JsonResponse
from .models import Reminder
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from datetime import datetime

#@require_http_methods(["POST"])
@csrf_exempt
def set_reminder(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            if 'user_id' not in data or 'reminder_time' not in data:
                return JsonResponse({'error': 'Missing required fields'}, status=400)
            
            user_id = data['user_id']
            try:
                reminder_time = datetime.fromisoformat(data['reminder_time'])
            except:
                parsed_time = datetime.strptime(data['reminder_time'], '%H:%M').time()
                # 获取当前日期
                current_date = datetime.now().date()

                # 结合日期和时间创建 datetime 对象
                reminder_time = datetime.combine(current_date, parsed_time)
            message = data['message'] if  'message' in data else 'wear braces'

            reminder = Reminder(user_id=user_id, reminder_time=reminder_time, message=message)
            reminder.save()

            return JsonResponse({"status": "success"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})
    elif request.method == 'GET':
        # 添加一些针对 GET 请求的逻辑
        return JsonResponse({"message": "This endpoint requires a POST request."})
    else:
        return JsonResponse({"message": "Invalid request method."})
