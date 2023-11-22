from django.shortcuts import render
from django.http import HttpResponse, Http404, JsonResponse, response
from django.core import serializers
from rest_framework.decorators import api_view

from .models import User
import requests
from django.utils import timezone
from datetime import datetime, timedelta
from django.db.models import Q
from django.db.models import Max
from selenium import webdriver
import time
# from qcloud_cos import CosConfig
# from qcloud_cos import CosS3Client
import sys
import logging
import random

# Create your views here.

APPID = 'wx3923928599ae095d'
APPSECRET = 'a0921e06f3aac5f0033df092a42bfa62'


def index(request):
	return HttpResponse("user_view")

# def register(request):
# 	_id = request.GET.get('id')
# 	_name = request.GET.get('name')
# 	_gender = request.GET.get('gender')
# 	_user_image = request.GET.get('user_image')
# 	_user = User.objects.get(id=_id)
# 	_user.name = _name
# 	_user.gender = _gender
# 	_user.user_image = _user_image
# 	_user.save()
# 	return JsonResponse({'msg': '注册成功', 'user_info': _user.get_dict()})

def wxlogin(request):
	JSCODE = request.GET.get('code')
	print(JSCODE)

	# https://api.weixin.qq.com/sns/jscode2session?appid=wx3923928599ae095d&secret=a0921e06f3aac5f0033df092a42bfa62&js_code=0f3sxCGa1BhVmG0VJ3Ja1lARZG2sxCG5&grant_type=authorization_code
	res = requests.get('https://api.weixin.qq.com/sns/jscode2session?appid='+APPID+'&secret='+APPSECRET+'&js_code='+JSCODE+'&grant_type=authorization_code')
	print(res.json())
	msg = eval(res.text)
	if not msg['unionid']:
		raise Http404
	else:
		unionid = msg['unionid']

		temp = User.objects.filter(user_id=unionid)
		# 如果查找为空，则注册，否则登录
		if temp.count() == 0:
			user = User(user_id=unionid)
			user.save()
			return JsonResponse({'msg':'注册成功', 'user_id':user.user_id, 'flag': 1})
		else:
			return JsonResponse({'msg':'登录成功', 'user_id':temp[0].user_id, 'user_info':temp[0].get_dict(), 'flag': 0})


def get_info(request):
	_id = request.GET.get('user_id')
	print(_id)
	_user = User.objects.get(user_id=_id)
	print(_user)
	return JsonResponse(_user.get_dict())

def change_info(request):
	# 获取前端传入数据
	try:
		_id = request.GET.get('user_id')
		_nickname = request.GET.get('nickname')
		_gender = request.GET.get('gender')
		_mobile = request.GET.get('mobile')
		_email = request.GET.get('email')
		_birthday = request.GET.get('birthday')
		_introduce = request.GET.get('introduce')

		_is_doctor = request.GET.get('is_doctor')
		_brace_total = request.GET.get('brace_total')
		_brace_used = request.GET.get('brace_used')
		_followup_date = request.GET.get('followup_date')
		# 获取对象
		_user = User.objects.get(user_id=_id)

		# 修改对象属性
		if _nickname is not None:
			_user.nickname = _nickname
		if _nickname is not None:
			_user.gender = _gender
		if _mobile is not None:
			_user.mobile = _mobile
		if _email is not None:
			_user.email = _email
		if _birthday is not None:
			_user.birthday = _birthday
		if _introduce is not None:
			_user.introduce = _introduce

		if _is_doctor is not None:
			_user.is_doctor = _is_doctor
		if _brace_total is not None:
			_user.brace_total = _brace_total
		if _brace_used is not None:
			_user.brace_used = _brace_used
		if _followup_date is not None:
			_user.followup_date = _followup_date

		_user.save()
		print('数据更新成功')
		return JsonResponse({'msg':'数据更新成功', 'user_info': _user.get_dict()})
	except:
		print('数据更新失败')
		return JsonResponse({'msg':'数据更新失败'}, status=500)