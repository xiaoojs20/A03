from django.urls import path
from .views import orthodontic_check_in, generate_report

urlpatterns = [
    path('set_time/', orthodontic_check_in, name='clockin'),
    path('report/', generate_report, name='report'),
]
