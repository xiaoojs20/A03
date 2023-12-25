from django.contrib import admin
from .models import Post, Comment

# Register your models here.
class PostAdmin(admin.ModelAdmin):
  list_display = ['post_id', 'publish_date', 'title', 'content']

class CommentAdmin(admin.ModelAdmin):
  list_display = ['post_id', 'comment_date', 'user', 'detail']


admin.site.register(Post, PostAdmin)
admin.site.register(Comment, CommentAdmin)