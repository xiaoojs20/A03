from django.shortcuts import render
from django.http import HttpResponse, Http404, JsonResponse, response
from django.core import serializers
from rest_framework.decorators import api_view
from .models import Post
from user.models import User
from django.db.models import Max
# Create your views here.


def index(request):
	return HttpResponse("post_view")

def property(request):
    # 获取request属性，构造上下文
    context = {'path':request.path,'method':request.method,'GET':request.GET}
    return render(request, 'property.html', context)


def create_post(request):
    try:
        # 创建新帖子对象并设置post_id
        max_post_id = Post.objects.aggregate(Max('post_id'))['post_id__max']
        new_post_id = max_post_id + 1 if max_post_id is not None else 1
        _user_id = request.GET.get('user_id')
        _user = User.objects.get(user_id=_user_id)
        new_post = Post(
            post_id = new_post_id, 
            user = _user,
            title = request.GET.get('title'),
            content = request.GET.get('content'),

            picture_1=request.FILES.get('picture_1'),  # 通过 request.FILES 获取上传的图片文件
            picture_2=request.FILES.get('picture_2'),
            picture_3=request.FILES.get('picture_3'),
            picture_4=request.FILES.get('picture_4'),  # 通过 request.FILES 获取上传的图片文件
            picture_5=request.FILES.get('picture_5'),
            picture_6=request.FILES.get('picture_6'),
            picture_7=request.FILES.get('picture_7'),  # 通过 request.FILES 获取上传的图片文件
            picture_8=request.FILES.get('picture_8'),
            picture_9=request.FILES.get('picture_9'),

            comment_counts = 0,  # 设置默认值或根据需要提供初始值
            click_counts = 0,
            like_counts = 0,
            is_top = False,  # 设置默认值或根据需要提供初始值
        )

        # 保存新帖子到数据库
        new_post.save()

        print('帖子创建成功')
        return JsonResponse({'msg': 'create_post ok', 'post_info': new_post.get_dict()})
    
    except Exception as e:
        print(f'帖子创建失败: {str(e)}')
        return JsonResponse({'msg': 'create_post error'}, status=500)
    
def get_post_by_postid(request):
    try:
        _post_id = request.GET.get('post_id')
        print(_post_id)
        _post = Post.objects.get(post_id=_post_id)
        print(_post)
        return JsonResponse({'msg': 'get_post_by_postid ok', 'post_info': _post.get_dict()})
    except Post.DoesNotExist:
        return JsonResponse({'msg': 'get_post_by_postid error', 'error': 'Post not found'}, status=404)
    except Exception as e:
        return JsonResponse({'msg': 'get_post_by_postid error', 'error': str(e)}, status=500)
    
def get_post_by_userid(request):
    try:
        _user_id = request.GET.get('user_id')
        print(_user_id)
        _user = User.objects.get(user_id=_user_id)
        _post_list = Post.objects.filter(user=_user)
        post_info_list = [_post.get_dict() for _post in _post_list]
        return JsonResponse({'msg': 'get_post_by_userid ok', 'post_info': post_info_list})
    except Post.DoesNotExist:
        return JsonResponse({'msg': 'get_post_by_useri error', 'error': 'Post not found'}, status=404)
    except Exception as e:
        return JsonResponse({'msg': 'get_post_by_useri error', 'error': str(e)}, status=500)