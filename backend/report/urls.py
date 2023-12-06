from django.urls import path
from .views import weekly_report, monthly_report

urlpatterns = [
    path('weekly/', weekly_report, name='weekly-report'),
    path('monthly/', monthly_report, name='monthly-report'),
]
