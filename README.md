# YY
YY for SE2023



API文档更新：xiaojs20 在 Apifox 邀请你加入项目 YY https://app.apifox.com/invite/project?token=URONepelqIQ2B_qO6fcOD


数据库迁移后还有毛病，可以选择进入容器后清除掉数据，再迁移。以post为例
```bash
# 进入容器
sudo docker exec -it app bash
# 回滚到初始状态
python manage.py migrate post zero
# 生成迁移文件
python manage.py makemigrations
# 再次执行迁移
python manage.py migrate
```
