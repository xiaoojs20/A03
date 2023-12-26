from django.shortcuts import render
from django.http import HttpResponse, Http404, JsonResponse, response
from django.core import serializers
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from .models import User
import requests
from django.utils import timezone
from datetime import datetime, timedelta
from django.db.models import Q
from django.db.models import Max
from selenium import webdriver
import time
from datetime import datetime,date
import re
# from qcloud_cos import CosConfig
# from qcloud_cos import CosS3Client
import sys
import logging
import random
import csv
import mimetypes
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
		print(unionid)
		temp = User.objects.filter(user_id=unionid)
		# 如果查找为空，则注册，否则登录
		if temp.count() == 0:
			user = User(user_id=unionid)
			user.save()
			return JsonResponse({'msg':'login:ok', 'user_id':user.user_id, 'flag': 1})
		else:
			return JsonResponse({'msg':'login:ok', 'user_id':temp[0].user_id, 'flag': 0})


def get_info(request):
	_id = request.GET.get('user_id')
	print(_id)
	_user = User.objects.get(user_id=_id)
	print(_user)
	return JsonResponse(_user.get_info())

def get_image(request):
	pass

@csrf_exempt
def change_info(request):
	# 获取前端传入数据
	try:
		if request.method == 'GET':
			_id = request.GET.get('user_id')
			_nickname = request.GET.get('nickname')
			_gender = request.GET.get('gender')
			_mobile = request.GET.get('mobile')
			_email = request.GET.get('email')
			_birthday = request.GET.get('birthday')
			_introduce = request.GET.get('introduce')
			_is_doctor = request.GET.get('is_doctor')
			_user_image = request.FILES.get('user_image', None)

			print(f"_is_dortor {_is_doctor}")

			# 获取对象
			_user = User.objects.get(user_id=_id)

			# 修改对象属性
			if _nickname is not None:
				if User.objects.filter(nickname=_nickname).exclude(user_id=_id).exists():
					return JsonResponse({'msg': 'Nickname already exists'}, status=400)
				_user.nickname = _nickname
			if _gender is not None:
				_user.gender = _gender
			if _mobile is not None:
				_user.mobile = _mobile
			if _email is not None:
				email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
				if not re.match(email_regex, _email):
					return JsonResponse({'msg': 'Invalid email format'}, status=400)
				_user.email = _email
			if _birthday is not None:
				_user.birthday = datetime.strptime(_birthday, '%Y-%m-%d').date()
			if _introduce is not None:
				_user.introduce = _introduce
			if _is_doctor is not None:
				_user.is_doctor = _is_doctor

			# if _user_image is not None:
			# 	_user.user_image.save(_user_image.name, _user_image)

			_user.save()
			print('用户信息更新成功')
			return JsonResponse({'msg':'change_info ok', 'user_info': _user.get_info()})
	except Exception as e:
		print('用户信息更新失败:' + e)
		return JsonResponse({'msg':'change_info error'}, status=500)
	

@csrf_exempt
def upload_image(request):
	# 获取前端传入数据
	try:
		print(request.method)
		if request.method == 'POST':
			_id = request.POST.get('user_id')
			print(_id)
			_user = User.objects.get(user_id=_id)
			_user_image = request.FILES.get('user_image', None)
			if _user_image is not None:
				_user.user_image.save(_user_image.name, _user_image)

			_user.save()
			print('头像上传成功')
			return JsonResponse({'msg':'upload_image ok'}, status=200)
	except ObjectDoesNotExist:
		# 处理用户不存在的情况
		print('用户不存在')
		return JsonResponse({'msg': 'User does not exist'}, status=404)
	except Exception as e:
		print('头像上传失败')
		print(e)
		return JsonResponse({'msg':'upload_image error'}, status=500)
	

def get_image(request):
	try:
		_id = request.GET.get('user_id')
		print(_id)
		_user = User.objects.get(user_id=_id)
		print(_user)
		image_path = _user.user_image.path
		print(image_path)
		with open(image_path, "rb") as f:
			# print(f.read())
			# # return HttpResponse(f.read())
			# return JsonResponse({'image':f.read()}, status=200)
			content_type, encoding = mimetypes.guess_type(image_path)
			response = HttpResponse(f.read(), content_type=content_type)
			if encoding:
				response['Content-Encoding'] = encoding

			return response

	except User.DoesNotExist:
		# 处理用户不存在的情况
		return JsonResponse({'msg': 'User does not exist'}, status=404)

	except Exception as e:
		# 处理其他异常
		print(e)
		return JsonResponse({'msg':'get_image error'}, status=500)

def get_brace(request):
	_id = request.GET.get('user_id')
	print(_id)
	_user = User.objects.get(user_id=_id)
	print(_user)
	return JsonResponse(_user.get_brace())


def get_ratio(request):
	try:
		_id = request.GET.get('user_id')
		print(_id)
		_user = User.objects.get(user_id=_id)
		if _user.start_date is None or _user.end_date is None:
			return JsonResponse({'msg': 'get_ratio error', 'ratio':0, 'status': 404})

		if _user.start_date is not None and _user.end_date is not None:
			total_day = (_user.end_date - _user.start_date).days
			print(f"总正畸日：{total_day} 天")

		# 计算当前日期 - start_date 的天数
		current_date = date.today()
		if _user.start_date is not None:
			days_from_start = (current_date - _user.start_date).days
			print(f"已经正畸： {days_from_start} 天")
		ratio = days_from_start/total_day
		print(f"正畸进度：{ratio}")
		return JsonResponse({'msg': 'get_ratio ok', 'ratio':ratio, 'status': 200})
	except Exception as e:
		print(e)
		return JsonResponse({'msg': 'get_ratio error '}, status=500)

		

@csrf_exempt
def change_brace(request):
	try:
		if request.method == 'GET':
			_id = request.GET.get('user_id')
			_brace_total = request.GET.get('brace_total')
			_brace_used = request.GET.get('brace_used')
			_followup_date = request.GET.get('followup_date')
			_start_date = request.GET.get('start_date')
			_end_date = request.GET.get('end_date')
			_user = User.objects.filter(user_id=_id).first()

			if _brace_total is not None:
				_user.brace_total = _brace_total
			if _brace_used is not None:
				_user.brace_used = _brace_used
			if _followup_date is not None:
				_user.followup_date = datetime.strptime(_followup_date, '%Y-%m-%d').date()
			if _start_date is not None:
				_user.start_date = datetime.strptime(_start_date, '%Y-%m-%d').date()
			if _end_date is not None:
				_user.end_date = datetime.strptime(_end_date, '%Y-%m-%d').date()

			_user.save()
			print('牙套数据更新成功')
			return JsonResponse({'msg':'change_brace ok', 'user_info': _user.get_brace()})
	except User.DoesNotExist:
		print('找不到用户')
		return JsonResponse({'msg': 'change_brace error - 用户不存在'}, status=404)
	except Exception as e:
		print(f'牙套数据更新失败: {str(e)}')
		return JsonResponse({'msg':'change_brace error'}, status=500)

@csrf_exempt
def add_following(request):
	_id = request.GET.get('user_id')
	_follow_name = request.GET.get('follow_name')
	try:
		if _id is None or _follow_name is None:
			return JsonResponse({'msg': 'add_following error', 'status': 404})
		_user = User.objects.get(user_id=_id)
		_follow_user = User.objects.get(nickname=_follow_name)
		# 检查是否已经关注该用户
		if _user.follow_list.filter(pk=_follow_user.pk).exists():
			return JsonResponse({'msg': 'Already following this user', 'status': 200})

		_user.follow_list.add(_follow_user)
		_follow_user.fans_list.add(_user)
		return JsonResponse({'msg': 'add_following ok', 'status': 200})
	except ObjectDoesNotExist:
		return JsonResponse({'msg': 'User not found', 'status': 404})
	except Exception as e:
		return JsonResponse({'msg': f'add_following error: {e}', 'status': 500})

@csrf_exempt
def remove_following(request):
	_id = request.GET.get('user_id')
	_unfollow_name = request.GET.get('unfollow_name')
	try:
		if _id is None or _unfollow_name is None:
			return JsonResponse({'msg': 'remove_following error', 'status': 404})
		
		_user = User.objects.get(user_id=_id)
		_unfollow_user = User.objects.get(nickname=_unfollow_name)
		# 检查是否已经移除关注该用户
		if not _user.follow_list.filter(pk=_unfollow_user.pk).exists():
			return JsonResponse({'msg': 'Already removed following this user', 'status': 200})	
		_user.follow_list.remove(_unfollow_user)
		_unfollow_user.fans_list.remove(_user)
		return JsonResponse({'msg': 'remove_following ok', 'status': 200})
	except ObjectDoesNotExist:
		return JsonResponse({'msg': 'User not found', 'status': 404})
	except Exception as e:
		return JsonResponse({'msg': f'add_following error: {e}', 'status': 500})

def get_following(request):
	try:
		if request.method == 'GET':
			_id = request.GET.get('user_id')
			print(_id)
			_user = User.objects.get(user_id=_id)
			print(_user)
			fo_username_list = []
			# if _user.follow_list == None:
			# 	return JsonResponse({'following': None})
			for fo_user in _user.follow_list.all():
				fo_username_list.append(fo_user.nickname)
			return JsonResponse({'following': fo_username_list, 'fo number': len(fo_username_list)})
	except Exception as e:
		print(e)
		return JsonResponse({'msg': 'get_following error '}, status=500)

def get_fans(request):
	try:
		if request.method == 'GET':
			_id = request.GET.get('user_id')
			_user = User.objects.get(user_id=_id)
			fans_username_list = []
			# if _user.fans_list == None:
			# 	return JsonResponse({'fans': None, 'fans number': 0})
			for fans_user in _user.fans_list.all():
				fans_username_list.append(fans_user.nickname)
			return JsonResponse({'fans': fans_username_list, 'fans number': len(fans_username_list)})
	except Exception as e:
		print(e)
		return JsonResponse({'msg': 'get_fans error'}, status=500)

@csrf_exempt
def import_doctor():
	try:
		print("import doctors....")
		path = "media/doctor.csv"
		with open(path, encoding='utf-8') as f:
			print("get csv...")
			reader = csv.reader(f)
			for row in reader:
				obj, created = User.objects.get_or_create(
					is_doctor = 1,
					real_name=row[0],
					title=row[1],
					school=row[2],
					degree=row[3],
					)
		return JsonResponse({'msg':'import_doctor ok'})
	except Exception as e:
		print(e)
		return JsonResponse({'msg':'import_doctor error'}, status=500)	


def get_doctor(request):
	try:
		if request.method == 'GET':
			doctors = User.objects.filter(is_doctor=1)
			doctor_list = []
			for doctor in doctors:
				doctor_dict = {
					'real_name': doctor.real_name,
					'title': doctor.title,
					'school': doctor.school,
					'degree': doctor.degree,
					}
				doctor_list.append(doctor_dict)
		return JsonResponse({'doctors': doctor_list})
	except Exception as e:
		return JsonResponse({'msg': 'get_doctors error'}, status=500)
	