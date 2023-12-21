# YY

YY for SE2023



API文档更新：xiaojs20 在 Apifox 邀请你加入项目 YY https://app.apifox.com/invite/project?token=URONepelqIQ2B_qO6fcOD

## 数据库迁移问题


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

还不行可以进入mysql查看数据库具体内容，以post_comment为例：

```
python manage.py dbshell
SHOW TABLES;
DESCRIBE post_comment;
DROP TABLE post_comment;
quit
```



## 前端POST注意事项

前端有人用POST传数据记得增加header，否则后端接收不到！

```
wx.request({
  url: geturl, //仅为示例，并非真实的接口地址
  data: {
        x: '' , 
        y: ''
   }, 
  success: function(res) { 
    console.log(res.data) 
  }
})
```



```
wx.request({
    url: posturl
    data: {
      'order_id': order_id
    },
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
 	.....
  });
```

