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
@csrf_exempt
def update_reminder(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            reminder_id = data.get('id')

            # 确保提供了 ID
            if reminder_id is None:
                return JsonResponse({'error': 'Missing reminder ID'}, status=400)

            # 查找现有的提醒
            try:
                reminder = Reminder.objects.get(id=reminder_id)
            except Reminder.DoesNotExist:
                return JsonResponse({"status": "error", "message": "Reminder not found"}, status=404)

            # 更新提醒
            reminder.user_id = data.get('user_id', reminder.user_id)
            reminder.message = data.get('message', reminder.message)
            if 'reminder_time' in data:
                try:
                    reminder.reminder_time = datetime.fromisoformat(data['reminder_time'])
                except ValueError:
                    # 时间格式错误
                    return JsonResponse({'error': 'Invalid date format'}, status=400)

            reminder.save()
            return JsonResponse({"status": "success"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})
    else:
        return JsonResponse({"message": "Invalid request method."})
@csrf_exempt
def delete_reminder(request):
    if request.method == 'DELETE':
        try:
            data = json.loads(request.body)
            reminder_id = data.get('id')
            if reminder_id is None:
                return JsonResponse({'error': 'Missing reminder ID'}, status=400)

            reminder = Reminder.objects.get(id=reminder_id)
            reminder.delete()
            return JsonResponse({"status": "success"})
        except Reminder.DoesNotExist:
            return JsonResponse({"status": "error", "message": "Reminder not found"}, status=404)
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})
    else:
        return JsonResponse({"message": "Invalid request method."})
