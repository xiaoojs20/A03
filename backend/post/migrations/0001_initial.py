# Generated by Django 4.2.5 on 2023-11-16 07:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("user", "0006_alter_user_user_image"),
    ]

    operations = [
        migrations.CreateModel(
            name="Post",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "post_id",
                    models.CharField(max_length=50, null=True, verbose_name="帖子id"),
                ),
                ("title", models.CharField(max_length=50, verbose_name="帖子标题")),
                (
                    "content",
                    models.CharField(max_length=5000, null=True, verbose_name="帖子内容"),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="user.user",
                        verbose_name="发帖用户",
                    ),
                ),
            ],
        ),
    ]