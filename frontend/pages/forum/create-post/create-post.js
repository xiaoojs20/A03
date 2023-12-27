Page({
  data: {
    title: '',
    content: '',
    imageList: []  // 存储选择的图片路径
  },

  inputTitle(e) {
    this.setData({
      title: e.detail.value
    });
  },

  inputContent(e) {
    this.setData({
      content: e.detail.value
    });
  },

  chooseImage() {
    let that = this;
    console.log("选择图片");
    wx.chooseImage({
      count: 3,  // 允许选择的图片数量
      sizeType: ['compressed'],  // 可以指定是原图还是压缩图
      sourceType: ['album', 'camera'],  // 可以指定来源是相册还是相机
      success(res) {
        const images = res.tempFilePaths;
        that.setData({
          imageList: that.data.imageList.concat(images)
        });
        console.log("已选图片: ", images);
      }
    });
  },

  submitPost() {
    const { title, content, imageList } = this.data;
    console.log("提交帖子");
  
    if (!title || !content) {
      wx.showToast({
        title: '标题和内容不能为空',
        icon: 'none'
      });
      return;
    }
  
    this.createTextPost(title, content, (postId) => {
      console.log("帖子ID: ", postId);
  
      if (postId) {
        if (imageList.length > 0) {
          console.log("上传帖子图片");
          imageList.forEach((imagePath) => {
            this.uploadPostImage(postId, imagePath);
          });
        }
        // 跳转到论坛首页
        this.navigateToIndex();  // 帖子创建成功后跳转
      }
    });
  },
  

  createTextPost(title, content, callback) {
    console.log("创建帖子内容");
    wx.request({
      url: 'http://43.143.205.76:8000/post/create_post/',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: getApp().globalData.userid,
        title: title,
        content: content
      },
      success(res) {
        console.log("创建帖子响应: ", res);
  
        if (res.statusCode === 200 && res.data && res.data.msg === 'create_post ok') {
          wx.showToast({
            title: '帖子发布成功',
            icon: 'success'
          });
  
          // 获取帖子ID
          const postId = res.data.post_info.post_id;  // 从post_info中获取postId
          console.log("postId: ", postId);
  
          if (callback && postId) {
            callback(postId);  // 调用回调函数
          } else {
            console.log("回调函数未执行，postId 为空或不存在");
          }
        } else {
          wx.showToast({
            title: '帖子发布失败',
            icon: 'none'
          });
        }
      },
      fail(err) {
        console.error("创建帖子请求失败: ", err);
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
      }
    });
  },
  uploadPostImage(postId, imagePath) {
    console.log(`上传图片 postId: ${postId}, imagePath: ${imagePath}`);
    wx.uploadFile({
      url: 'http://43.143.205.76:8000/post/upload_image/',
      filePath: imagePath,
      name: 'post_image',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: {
        post_id: postId
      },
      success(res) {
        console.log("图片上传成功响应: ", res);
        if (res.statusCode === 200) {
          wx.showToast({
            title: '图片上传成功',
            icon: 'success'
          });
        } else {
          wx.showToast({
            title: '图片上传失败',
            icon: 'none'
          });
        }
      },
      fail(err) {
        console.error("图片上传失败: ", err);
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
      }
    });
  },

  navigateToIndex() {
    console.log("Navigating to forum index");
    wx.redirectTo({
      url: '/pages/forum/index/index'
    });
  },
  

  onLoad() {},
  onReady() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {}
});
