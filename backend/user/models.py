from django.db import models

# Create your models here.

"""
model: User
"""

class User(models.Model):
    # 用户相关
    user_id = models.CharField(max_length=50, null=True, verbose_name='用户id(wx分配)')
    nickname = models.CharField(max_length=50, default='微信用户', null=True, verbose_name='用户名')
    gender = models.IntegerField(choices=((0, '男'),(1, '女'),(2, '其他')), null=True, default=0, verbose_name='性别')
    mobile = models.CharField(max_length=20, null=True, verbose_name='电话')
    email = models.CharField(max_length=30, null=True, blank=True, default='',verbose_name='电子邮箱')
    birthday = models.DateField(null=True, blank=True, verbose_name='生日')
    user_image = models.ImageField(null=True, verbose_name='用户头像')
    introduce = models.CharField(max_length=100, default='', null=True, blank=True, verbose_name='个人简介')
    
	# 牙套相关
    is_doctor = models.BooleanField(default=False, verbose_name='是否为医生用户')
    brace_total = models.IntegerField(null=True, default=0, verbose_name='牙套总数量')
    brace_used = models.IntegerField(null=True, default=0, verbose_name='已佩戴牙套数量')
    followup_date = models.DateField(null=True, blank=True, verbose_name='下次复诊日期')


    def __str__(self):
        """将模型类以字符串的方式输出"""
        """user.admin里面重定义了"""
        return f"{self.user_id} {'-'*2} {self.nickname} {'-'*2} {self.gender}"
    def get_dict(self):
        return {'user_id':self.user_id,
				'nickname':self.nickname,
				'gender':self.gender,
				'mobile':self.mobile,
				'email':self.email,
				'birthday':self.birthday,
				# 'user_image':self.user_image,
				'introduce':self.introduce,
                
                'is_doctor':self.is_doctor,
                'brace_total':self.brace_total,
                'brace_used':self.brace_used,
                'followup_date':self.followup_date,
                }
    #元类信息 : 修改表名
    class Meta:
        db_table = 'user'


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='用户')
    follow = models.ManyToManyField('self', symmetrical=False, related_name='关注列表')
    fans = models.ManyToManyField('self', symmetrical=False, related_name='粉丝列表')

    def __str__(self):
        return f"{self.user.user_id}"
    
