# reminder/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('set_reminder', views.set_reminder, name='reminder'),
    path('modify',views.update_reminder,name='modify'),
    path('delete',views.delete_reminder,name='delete')
]
