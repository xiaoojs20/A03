from django.urls import path, re_path
from django.views.decorators.cache import cache_page
from .views import *

urlpatterns = [
    path("", index),
    re_path(r'^property/$', property),
	path("create_post/", create_post),
	path("get_post_by_postid/", get_post_by_postid),
    path("get_post_by_userid/", get_post_by_userid),
]