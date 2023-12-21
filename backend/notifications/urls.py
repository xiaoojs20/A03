from django.urls import path
from . import views
from .views import CreateSystemNotification

urlpatterns = [
    # ... 其他 URL 配置 ...
    path('notifications/<str:user_id>/', views.get_system_notifications, name='get_system_notifications'),
    path('create_notification/', CreateSystemNotification.as_view(), name='create_notification'),
]
