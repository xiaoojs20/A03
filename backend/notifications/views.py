from django.http import JsonResponse
from .models import SystemNotification
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import json
def get_system_notifications(request, user_id):
    notifications = SystemNotification.objects.filter(user_id=user_id).order_by('-created_at')
    data = list(notifications.values('id', 'message', 'created_at'))
    return JsonResponse(data, safe=False)
class CreateSystemNotification(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super(CreateSystemNotification, self).dispatch(*args, **kwargs)

    def post(self, request):
        # 假设POST数据是JSON格式，包含'user_id'和'message'
        try:
            data = json.loads(request.body)
            user_id = data['user_id']
            message = data['message']
            SystemNotification.objects.create(user_id=user_id, message=message)
            return JsonResponse({'status': 'success'}, status=201)
        except KeyError:
            return JsonResponse({'status': 'error', 'message': 'Missing user_id or message'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)