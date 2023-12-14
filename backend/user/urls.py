from django.urls import path
from django.views.decorators.cache import cache_page
from .views import *

urlpatterns = [
    path("", index),
	path("login/", wxlogin),
	# path("register/", register),
	path('get_info/', get_info),
	path('change_info/', change_info),
    path('get_brace/', get_brace),
	path('change_brace/', change_brace),
	path('import_doctor/', import_doctor),
	path('get_doctor/', get_doctor),
	path('get_ratio/', get_ratio),
	# path('register_name/', register_name),
	# path('test/', cache_page(60*60)(test)),
]