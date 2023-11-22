from django.urls import path, re_path
from django.views.decorators.cache import cache_page
from .views import *

urlpatterns = [
    path("", index),
    re_path(r'^property/$', property),
	# path("login/", login),
	# path("register/", register),
]