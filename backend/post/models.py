from django.db import models
from django.utils import timezone
from datetime import datetime
# Create your models here.

# 时间处理函数
def normalize_time(time):
	now = timezone.now()
	day_delta = now.date() - time.date()
	if day_delta.days == 0:
		return str(time)[10:-7]
	elif day_delta.days == 1:
		return '昨天' + str(time)[10:-7]
	elif day_delta.days == 2:
		return '前天' + str(time)[10:-7]
	else:
		return str(time)[:-7]
	
class Post(models.Model):
    post_id = models.AutoField(primary_key=True, verbose_name='帖子id')
    user = models.ForeignKey("user.User", on_delete=models.CASCADE, verbose_name="发帖用户")
    # user_id = models.CharField(max_length=50, null=True, verbose_name='发帖用户id')
    publish_date = models.DateTimeField(auto_now_add=True,verbose_name='发布时间')
	
    title = models.CharField(max_length=50, verbose_name="帖子标题")
    content = models.CharField(max_length=5000, null=True, verbose_name="帖子文字内容")

    picture_1 = models.ImageField(upload_to='media/post_images/',null=True, blank=True, verbose_name='帖子图片1')
    picture_2 = models.ImageField(upload_to='media/post_images/',null=True, blank=True, verbose_name='帖子图片2')
    picture_3 = models.ImageField(upload_to='media/post_images/',null=True, blank=True, verbose_name='帖子图片3')
    picture_4 = models.ImageField(upload_to='media/post_images/',null=True, blank=True, verbose_name='帖子图片4')
    picture_5 = models.ImageField(upload_to='media/post_images/',null=True, blank=True, verbose_name='帖子图片5')
    picture_6 = models.ImageField(upload_to='media/post_images/',null=True, blank=True, verbose_name='帖子图片6')
    picture_7 = models.ImageField(upload_to='media/post_images/',null=True, blank=True, verbose_name='帖子图片7')
    picture_8 = models.ImageField(upload_to='media/post_images/',null=True, blank=True, verbose_name='帖子图片8')
    picture_9 = models.ImageField(upload_to='media/post_images/',null=True, blank=True, verbose_name='帖子图片9')
	
    comment_counts = models.IntegerField('话题评论数', default=0)
    click_counts = models.IntegerField(verbose_name='话题点击数', default=0)
    like_counts = models.IntegerField(verbose_name='点赞数', default=0)
    is_top = models.BooleanField(verbose_name='是否置顶', default=False)

    def __str__(self):
        """将模型类以字符串的方式输出"""
        """user.admin里面重定义了"""
        return f"{self.post_id} {'-'*2} {self.title} {'-'*2} {self.user}"
	
    def get_image_src(self, detail):
        if detail:
            img_count = self.topic_image_set.count()
        else:
            img_count =self.topic_image_set.count() if self.topic_image_set.count() <= 3 else 3
        src = []
        for i in range(img_count):
            src.append(self.topic_image_set.get(index=i).get_dict())
        return src

	# 得到字典数据
    def get_dict(self):
        return {
            'post_id': self.post_id,
            'user_id': self.user.user_id,
            'title': self.title,
            'content': self.content,
            'publish_date': self.publish_date,

            # 'picture_1': self.picture_1.url if self.picture_1 else None,
            # 'picture_2': self.picture_2.url if self.picture_2 else None,
            # 'picture_3': self.picture_3.url if self.picture_3 else None,
            # 'picture_4': self.picture_4.url if self.picture_4 else None,
            # 'picture_5': self.picture_5.url if self.picture_5 else None,
            # 'picture_6': self.picture_6.url if self.picture_6 else None,
            # 'picture_7': self.picture_7.url if self.picture_7 else None,
            # 'picture_8': self.picture_8.url if self.picture_8 else None,
            # 'picture_9': self.picture_9.url if self.picture_9 else None,

            'comment_counts': self.comment_counts,
            'click_counts': self.click_counts,
            'like_counts': self.like_counts,
            'is_top': self.is_top,
            }
        
    class Meta:
        verbose_name = '帖子'
        verbose_name_plural = verbose_name
		    

class Comment(models.Model):
    comment_id = models.AutoField(primary_key=True, verbose_name='评论id')
    post_id = models.IntegerField(verbose_name='帖子id')
    user = models.ForeignKey("user.User", on_delete=models.CASCADE, verbose_name="评论用户")
    detail = models.CharField(max_length=5000, null=True, verbose_name="评论文字内容")
    comment_date = models.DateTimeField(auto_now_add=True,verbose_name='评论发布时间')

    def __str__(self):
        """将模型类以字符串的方式输出"""
        """user.admin里面重定义了"""
        return f"{self.comment_id} {'-'*2} {self.post_id} {'-'*2} {self.user} {'-'*2} {self.detail}"

    	# 得到字典数据
    def get_dict(self):
        return {
            'comment_id': self.comment_id,
            'post_id': self.post_id,
            'user_id': self.user.user_id,
            'detail': self.detail,
            'comment_date': self.comment_date,
            }
    
    class Meta:
        verbose_name = '评论'
        verbose_name_plural = verbose_name

# class Topic(models.Model):
# 	in_session = models.ForeignKey('Session',on_delete=models.CASCADE, verbose_name='所在版块')
# 	publisher = models.ForeignKey('user.User', on_delete=models.CASCADE, verbose_name='发布者')
# 	publish_date = models.DateTimeField(auto_now_add=True,verbose_name='发布时间')
# 	title = models.CharField(max_length=40, verbose_name='话题标题')
# 	content = models.CharField(max_length=5000, verbose_name='话题内容')
# 	comment_counts = models.IntegerField('话题评论数', default=0)
# 	self_counts = models.IntegerField(verbose_name='话题点击数', default=0)
# 	great_counts = models.IntegerField(verbose_name='点赞数', default=0)
# 	to_top = models.BooleanField(verbose_name='是否置顶', default=False)

# 	def __str__(self):
# 		return self.publisher.name+':'+self.title

# 	# # 话题点击数增加
# 	# def self_counts_add(self, num):
# 	# 	self.self_counts += num
# 	# 	return self.self_counts

# 	# # 文章回复增加，也可通过数据库操作查询文章总量，鉴于性能，采用直接加
# 	# def article_counts_add(self):
# 	# 	self.comment_counts += 1
# 	# 	return self.comment_counts

# 	def get_image_src(self, detail):
# 		if detail:
# 			img_count = self.topic_image_set.count()
# 		else:
# 			img_count =self.topic_image_set.count() if self.topic_image_set.count() <= 3 else 3
# 		src = []
# 		for i in range(img_count):
# 			src.append(self.topic_image_set.get(index=i).get_dict())
# 		return src

# 	# 得到字典数据
# 	def get_dict(self, detail=False):
# 		return {'in_session': self.in_session.id,
# 				'in_session_name': self.in_session.name,
# 				'publisher_info': self.publisher.get_dict(),
# 				'publish_date':normalize_time(self.publish_date),
# 				'title': self.title,
# 				'content': self.content,
# 				'comment_counts': self.comment_counts,
# 				'great_counts':self.great_counts,
# 				'to_top': int(self.to_top),
# 				'id': self.id,
# 				'img_counts': self.topic_image_set.count(),
# 				'src': self.get_image_src(detail=detail),
# 				'view_counts': self.self_counts}

# 	class Meta:
# 		verbose_name = '话题'
# 		verbose_name_plural = verbose_name
