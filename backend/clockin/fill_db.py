import os
import django
from datetime import datetime, timedelta
from user.models import User
from clockin.models import OrthodonticCheckIn  # Corrected import statement

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'YY.settings')
django.setup()

# Ensure there is a user instance available
user = User.objects.get(user_id='o-Hbd6bbDxfCqNpz5xsTgMLKDR3Q')  # Replace with a valid user_id

# Create check-in records for every day of the past month
start_date = datetime.now() - timedelta(days=30)
end_date = datetime.now()

current_date = start_date
while current_date <= end_date:
    # Create "on" type check-in records
    OrthodonticCheckIn.objects.create(
        user=user,
        date=current_date,
        check_in_type='on'
    )

    # Create "off" type check-in records (assuming 30 minutes later)
    off_time = current_date + timedelta(minutes=30)
    OrthodonticCheckIn.objects.create(
        user=user,
        date=off_time,
        check_in_type='off'
    )
    OrthodonticCheckIn.objects.create(
        user=user,
        date=current_date + timedelta(minutes=60),  # Fixed syntax error
        check_in_type='on'
    )

    # Create "off" type check-in records (assuming 90 minutes later)
    off_time = current_date + timedelta(minutes=90)
    OrthodonticCheckIn.objects.create(
        user=user,
        date=off_time,
        check_in_type='off'
    )

    # Move to the next day
    current_date += timedelta(days=1)

print("Data population complete.")
