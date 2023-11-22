# Generated by Django 4.2.5 on 2023-11-16 05:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("user", "0001_initial"),
    ]

    operations = [
        migrations.AlterModelOptions(name="user", options={},),
        migrations.RemoveField(model_name="user", name="birthday",),
        migrations.RemoveField(model_name="user", name="email",),
        migrations.RemoveField(model_name="user", name="introduce",),
        migrations.RemoveField(model_name="user", name="is_superuser",),
        migrations.RemoveField(model_name="user", name="name",),
        migrations.RemoveField(model_name="user", name="open_id",),
        migrations.RemoveField(model_name="user", name="register_date",),
        migrations.RemoveField(model_name="user", name="school_account",),
        migrations.RemoveField(model_name="user", name="true_name",),
        migrations.RemoveField(model_name="user", name="user_image",),
        migrations.RemoveField(model_name="user", name="user_image_local",),
        migrations.AddField(
            model_name="user",
            name="nickname",
            field=models.CharField(
                default="nickname", max_length=50, null=True, verbose_name="用户名"
            ),
        ),
        migrations.AddField(
            model_name="user",
            name="user_id",
            field=models.CharField(max_length=50, null=True, verbose_name="用户id"),
        ),
        migrations.AlterField(
            model_name="user",
            name="gender",
            field=models.IntegerField(
                choices=[(0, "man"), (1, "female"), (2, "unknow")],
                default=0,
                null=True,
                verbose_name="性别",
            ),
        ),
        migrations.AlterField(
            model_name="user",
            name="mobile",
            field=models.CharField(max_length=20, null=True, verbose_name="电话"),
        ),
    ]
