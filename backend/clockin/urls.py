from django.urls import path
from .views import orthodontic_check_in

urlpatterns = [
    path('set_time',orthodontic_check_in, name='clockin'),
]
