from django.shortcuts import render
from django.http import HttpResponse, Http404, JsonResponse, response
from django.core import serializers
from rest_framework.decorators import api_view

# Create your views here.



def index(request):
	return HttpResponse("post_view")

def property(request):
    # 获取request属性，构造上下文
    context = {'path':request.path,'method':request.method,'GET':request.GET}
    return render(request, 'property.html', context)