from django.contrib import admin
from .models import User

# Register your models here.
class UerAdmin(admin.ModelAdmin):
  list_display = ['user_id','nickname','gender']


admin.site.register(User, UerAdmin)