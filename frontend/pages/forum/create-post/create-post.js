// pages/forum/create-post/create-post.ts
Page({

  data: {
    title: '',
    content: '',
    imageList: []  // 已有的定义
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

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  data: {
    imageList: []  // 用于存储选择的图片路径
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

    // 调用后端API
    this.createPost(title, content, imageList);
  },

  createPost(title, content, imageList) {
    wx.request({
    url: 'http://43.143.205.76:8000/post/create_post/',
    method: 'GET',
    data: {
      user_id: "o-Hbd6bbDxfCqNpz5xsTgMLKDR3Q",//getApp().globalData.userid,
      title: title,
      content: content
      // 可以添加更多的数据，比如图片URLs
    },
    success: (res) => {
      // 检查返回的状态码或者数据中的特定字段
      if (res.statusCode === 200 && res.data && res.data.msg === 'create_post ok') {
        console.log('帖子创建成功:', res.data);
        wx.showToast({
          title: '帖子发布成功',
          icon: 'success'
        });
        // 需要重置表单或跳转到其他页面
      } else {
        console.error('帖子创建失败:', res.data);
        wx.showToast({
          title: '帖子发布失败',
          icon: 'none'
        });
      }
    },
    fail: function(err) {
      // 请求失败的处理
      console.error('网络请求失败:', err);
      wx.showToast({
        title: '网络请求失败',
        icon: 'none'
      });
    }
  });
},
  

  chooseImage() {
    
    let that = this;
    wx.chooseImage({
      count: 3,  // 允许选择的图片数量
      sizeType: ['compressed'],  // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],  // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        // 返回选定照片的本地文件路径列表
        const images = res.tempFilePaths;
        that.setData({
          imageList: that.data.imageList.concat(images)
        });
      }
    })
  },
})