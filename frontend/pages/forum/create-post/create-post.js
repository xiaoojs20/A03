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
    wx.chooseImage({
      count: 3,  // 允许选择的图片数量
      sizeType: ['compressed'],  // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],  // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const images = res.tempFilePaths;
        that.setData({
          imageList: that.data.imageList.concat(images)
        });
      }
    });
  },

  submitPost() {
    const { title, content, imageList } = this.data;
    if (!title || !content) {
      wx.showToast({
        title: '标题和内容不能为空',
        icon: 'none'
      });
      return;
    }
  
    if (imageList.length > 0) {
      // 如果有图片，上传图片
      this.uploadImages(imageList, title, content);
    } else {
      // 如果没有图片，直接发布帖子
      this.createTextPost(title, content);
    }
  },

  createTextPost(title, content) {
    wx.request({
      url: 'http://43.143.205.76:8000/post/create_post/',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: "o-Hbd6bbDxfCqNpz5xsTgMLKDR3Q",  // 你的用户ID
        title: title,
        content: content
      },
      success(res) {
        if (res.statusCode === 200) {
          wx.showToast({
            title: '帖子发布成功',
            icon: 'success'
          });
          wx.navigateTo({
            url: '/pages/forum/index/index' 
          });
          // 你可能还需要执行一些操作，比如导航到帖子列表页面
        } else {
          wx.showToast({
            title: '帖子发布失败',
            icon: 'none'
          });
        }
      },
      fail() {
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
      }
    });
  },
  
  

  uploadImages(imageList, title, content) {
    for (let i = 0; i < imageList.length; i++) {
      wx.uploadFile({
        url: 'http://43.143.205.76:8000/post/create_post/',
        filePath: imageList[i],
        name: `picture_${i + 1}`,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        formData: {
          user_id: "o-Hbd6bbDxfCqNpz5xsTgMLKDR3Q",
          title: title,
          content: content
        },
        success: (res) => {
          if (res.statusCode === 200) {
            wx.showToast({
              title: '帖子发布成功',
              icon: 'success'
            });
            // 你可能还需要执行一些操作，比如导航到帖子列表页面
          } else {
            wx.showToast({
              title: '帖子发布失败',
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          console.error('图片上传失败', err);
          // 上传失败的逻辑处理
        }
      });
    }
  },

  // 生命周期函数
  onLoad() {},
  onReady() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {}
});
