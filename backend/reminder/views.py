from django.shortcuts import render
from django.http import JsonResponse
from .models import Reminder
from django.views.decorators.http import require_http_methods
import json
from datetime import datetime

#@require_http_methods(["POST"])
def set_reminder(request):
    try:
        data = json.loads(request.body)
        user_id = data['user_id']
        reminder_time = datetime.fromisoformat(data['reminder_time'])
        message = data['message']

        reminder = Reminder(user_id=user_id, reminder_time=reminder_time, message=message)
        reminder.save()

        return JsonResponse({"status": "success"})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)})