# reminder/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.set_reminder, name='reminder'),
]
