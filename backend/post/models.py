from django.db import models

# Create your models here.

class Post(models.Model):
    post_id = models.CharField(max_length=50, null=True, verbose_name='帖子id')
    user = models.ForeignKey(
        "user.User", on_delete=models.CASCADE, verbose_name="发帖用户"
    )
    title = models.CharField(max_length=50, verbose_name="帖子标题")
    content = models.CharField(max_length=5000, null=True, verbose_name="帖子文字内容")

    picture_1 = models.ImageField(null=True, verbose_name='帖子图片1')
    picture_2 = models.ImageField(null=True, verbose_name='帖子图片2')
    picture_3 = models.ImageField(null=True, verbose_name='帖子图片3')
    picture_4 = models.ImageField(null=True, verbose_name='帖子图片4')
    picture_5 = models.ImageField(null=True, verbose_name='帖子图片5')
    picture_6 = models.ImageField(null=True, verbose_name='帖子图片6')
    picture_7 = models.ImageField(null=True, verbose_name='帖子图片7')
    picture_8 = models.ImageField(null=True, verbose_name='帖子图片8')
    picture_9 = models.ImageField(null=True, verbose_name='帖子图片9')




    def __str__(self):
        """将模型类以字符串的方式输出"""
        """user.admin里面重定义了"""
        return f"{self.post_id} {'-'*2} {self.title} {'-'*2} {self.user}"