from django.utils import timezone
from django.shortcuts import render
from django.http import HttpResponse, Http404, JsonResponse, response
from django.core import serializers
from rest_framework.decorators import api_view
from .models import Post, Comment
from user.models import User
from django.db.models import Max
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist
import mimetypes
# Create your views here.


def index(request):
	return HttpResponse("post_view")

def property(request):
    # 获取request属性，构造上下文
    context = {'path':request.path,'method':request.method,'GET':request.GET}
    return render(request, 'property.html', context)

@csrf_exempt
def create_post(request):
    try:
        print(request.method)
        if request.method == 'POST':
            # 创建新帖子对象并设置post_id
            # max_post_id = Post.objects.aggregate(Max('post_id'))['post_id__max']
            # new_post_id = max_post_id + 1 if max_post_id is not None else 1
            _user_id = request.POST.get('user_id')
            print(f"Received user_id: {_user_id}")
            print(f"title = {request.POST.get('title')}")
            _user = User.objects.get(user_id=_user_id)
            
            new_post = Post(
                    # post_id = new_post_id, 
                    user = _user,
                    title = request.POST.get('title'),
                    content = request.POST.get('content'),
                    
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
        return JsonResponse({'msg': 'create_post error'+str(e)}, status=500)


def get_n_latest_posts(request):
    try:
        n = int(request.GET.get('n', 10))  # 默认返回最新的 10 篇帖子，你可以根据需要修改默认值
        latest_posts = Post.objects.all().order_by('-publish_date')[:n]

        posts_list = []
        for post in latest_posts:
            posts_list.append(post.get_dict())  # 假设你在 Post 模型中定义了 get_dict 方法来获取帖子信息

        return JsonResponse({'msg': 'get_latest_posts ok', 'posts': posts_list})
    
    except Exception as e:
        return JsonResponse({'msg': 'get_latest_posts error', 'error': str(e)}, status=500)
    

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
    

@csrf_exempt
def set_top(request):
    try:
        print(request.method)
        if request.method == 'POST':
            _post_id = request.POST.get('post_id')
            _post = Post.objects.get(post_id=_post_id)
            _is_top = request.POST.get('is_top')
            if _is_top is not None:
                _post.is_top = _is_top

            _post.save()
            return JsonResponse({'msg': 'set_top ok', 'is_top': _post.is_top})
    
    except Exception as e:
        return JsonResponse({'msg': 'set_top error'+str(e)}, status=500)
    

@csrf_exempt
def upload_image(request):
	# 获取前端传入数据
	try:
		print(request.method)
		if request.method == 'POST':
			_post_id = request.POST.get('post_id')
			print(_post_id)
			_post = Post.objects.get(post_id=_post_id)
			_post_image = request.FILES.get('post_image', None)
			if _post_image is not None:
				_post.picture_1.save(_post_image.name, _post_image)

			_post.save()
			print('图片上传成功')
			return JsonResponse({'msg':'upload_image ok'}, status=200)
	except ObjectDoesNotExist:
		print('帖子不存在')
		return JsonResponse({'msg': 'Post does not exist'}, status=404)
	except Exception as e:
		print('头像上传失败')
		print(e)
		return JsonResponse({'msg':'upload_image error'+str(e)}, status=500)
	

def get_image(request):
    try:
        _post_id = request.POST.get('post_id')
        print(_post_id)
        _post = Post.objects.get(post_id=_post_id)
        print(_post)
        image_path = _post.picture_1.path
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
     

@csrf_exempt
def create_comment(request):
    try:
        print(request.method)
        if request.method == 'POST':
            _user_id = request.POST.get('user_id')
            print(f"Received user_id: {_user_id}")
            _user = User.objects.get(user_id=_user_id)
            _post_id = request.POST.get('post_id')
            _detail = request.POST.get('detail'),
            print(_detail)

            # 帖子评论数+1
            _post = Post.objects.get(post_id=_post_id)
            _post.comment_counts = _post.comment_counts + 1
            print(f"当前评论总数: {_post.comment_counts}")
            
            new_comment = Comment(
                    # comment_id = new_comment_id,
                    post_id = _post_id, 
                    user = _user,
                    detail = _detail,
                    comment_date=timezone.now()
                    )

            # 保存新帖子到数据库
	    _post.save()
            new_comment.save()

            print('评论发布成功')
            return JsonResponse({'msg': 'create_comment ok', 'comment_info': new_comment.get_dict()}, status=200)
            # return JsonResponse({'msg': 'create_comment ok'}, status=200)
    
    except Exception as e:
        print(f'评论发布失败: {str(e)}')
        return JsonResponse({'msg': 'create_comment error'+str(e)}, status=500)
    
def get_n_latest_comments(request):
    try:
        post_id = request.GET.get('post_id')
        print(post_id)
        _post_comment = Comment.objects.filter(post_id=post_id)
        print(_post_comment)
        n = int(request.GET.get('n', 10))  # 默认返回最新的 10 个评论
        latest_comments = _post_comment.all().order_by('-comment_date')[:n]

        comments_list = []
        for comment in latest_comments:
            comments_list.append(comment.get_dict())  

        return JsonResponse({'msg': 'get_n_latest_comments ok', 'posts': comments_list})
    
    except Exception as e:
        print(e)
        return JsonResponse({'msg': 'get_n_latest_comments error', 'error': str(e)}, status=500)
    

