from django.urls import path
from django.views.decorators.cache import cache_page
from .views import *

urlpatterns = [
    path("", index),
	path("login/", wxlogin),
	# path("register/", register),
	path('get_info/', get_info),
    path('upload_image/', upload_image),
    path('get_image/', get_image),
	path('change_info/', change_info),
    path('get_brace/', get_brace),
	path('change_brace/', change_brace),
	path('import_doctor/', import_doctor),
	path('get_doctor/', get_doctor),
	path('get_ratio/', get_ratio),
	path('get_following/', get_following),
    path('get_fans/', get_fans),
    path('add_following/', add_following),
    path('remove_following/', remove_following),
]