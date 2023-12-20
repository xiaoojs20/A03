// pages/forum/personal_info/personal_info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',      // 用户ID
    userInfo: {},    // 用户信息
    userPosts: []    // 用户帖子列表
  },

  onLoad: function(options) {
    // 获取从上一个页面传递过来的 user_id
    this.setData({
      userId: options.user_id
    });

    // 根据 user_id 获取用户信息和帖子列表
    this.fetchUserInfo();
    this.fetchUserPosts();
  },
  fetchUserInfo: function() {
    const that = this;
    wx.request({
      url: 'http://43.143.205.76:8000/user/get_info', // 替换为实际的后端接口地址
      data: { user_id: this.data.userId },
      success(res) {
        if (res.statusCode === 200 && res.data) {
          that.setData({ userInfo: res.data });
        } else {
          console.error('获取用户信息失败:', res);
        }
      },
      fail(err) {
        console.error('请求用户信息失败', err);
      }
    });
  },
  fetchUserPosts: function() {
    const that = this;
    wx.request({
      url: 'http://43.143.205.76:8000/post/get_post_by_userid', // 替换为实际的后端接口地址
      data: { user_id: this.data.userId },
      success(res) {
        if (res.statusCode === 200 && res.data && res.data.msg === 'get_post_by_userid ok') {
          that.setData({ userPosts: res.data.post_info });
        } else {
          console.error('获取帖子列表失败:', res);
        }
      },
      fail(err) {
        console.error('请求帖子列表失败', err);
      }
    });
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

  }
})