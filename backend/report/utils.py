# 在 reporting/utils.py

from clockin.models import OrthodonticCheckIn
from django.db.models import Sum, Avg
from django.utils.timezone import now
from calendar import monthrange

def generate_weekly_report(user):
    start_of_week = now().date() - timedelta(days=now().weekday())
    end_of_week = start_of_week + timedelta(days=6)

    weekly_data = OrthodonticCheckIn.objects.filter(
        user=user, 
        date__range=[start_of_week, end_of_week]
    ).aggregate(
        total_time=Sum('wear_time'),
        average_time=Avg('wear_time')
    )

    return weekly_data

def generate_monthly_report(user):
    start_of_month = now().date().replace(day=1)
    end_of_month = now().date().replace(day=monthrange(now().year, now().month)[1])

    monthly_data = OrthodonticCheckIn.objects.filter(
        user=user, 
        date__range=[start_of_month, end_of_month]
    ).aggregate(
        total_time=Sum('wear_time'),
        average_time=Avg('wear_time')
    )

    return monthly_data
