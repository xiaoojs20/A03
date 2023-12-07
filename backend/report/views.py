from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .utils import generate_weekly_report, generate_monthly_report

@login_required
def weekly_report(request):
    report = generate_weekly_report(request.user)
    return JsonResponse(report)

@login_required
def monthly_report(request):
    report = generate_monthly_report(request.user)
    return JsonResponse(report)
