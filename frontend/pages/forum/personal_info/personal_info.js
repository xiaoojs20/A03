// pages/forum/personal_info/personal_info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',      // 用户ID
    userInfo: {},    // 用户信息
    userPosts: [],    // 用户帖子列表
    isFollowing: false,
  },

  onLoad: function(options) {
    // 获取从上一个页面传递过来的 user_id
    this.setData({
      userId: options.user_id
    });

    // 根据 user_id 获取用户信息和帖子列表
    this.fetchUserInfo();
    this.fetchUserPosts();
    this.checkIfFollowing();
  },
  fetchUserInfo: function() {
    const that = this;
    wx.request({
      url: 'http://43.143.205.76:8000/user/get_info',
      data: { user_id: this.data.userId },
      success(res) {
        if (res.statusCode === 200 && res.data) {
          that.setData({ userInfo: res.data });
          // 获取图像
          that.getImage();
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
      url: 'http://43.143.205.76:8000/post/get_post_by_userid',
      data: { user_id: this.data.userId },
      success(res) {
        if (res.statusCode === 200 && res.data && res.data.msg === 'get_post_by_userid ok') {
          that.setData({ userPosts: res.data.post_info });
          console.log('帖子列表:', res.data.post_info); // 展示返回的帖子列表
        } else {
          console.error('获取帖子列表失败:', res);
        }
      },
      fail(err) {
        console.error('请求帖子列表失败', err);
      }
    });
  },
    
  checkIfFollowing: function() {
    const that = this;
    const currentUserId = getApp().globalData.userid;
    wx.request({
      url: 'http://43.143.205.76:8000/user/get_following/',
      data: { user_id: currentUserId },
      success: function(res) {
        if (res.statusCode === 200 && res.data.following) {
          const isFollowing = res.data.following.includes(that.data.userInfo.nickname);
          that.setData({ isFollowing });
          console.log('关注列表:', res.data.following); // 展示返回的关注列表
          console.log('关注状态更新:', isFollowing);
        } else {
          console.error('获取关注列表失败:', res);
        }
      },
      fail: function(err) {
        console.error('请求关注列表失败:', err);
      }
    });
  },

  followUser: function() {
    const that = this;
    const currentUserId = getApp().globalData.userid;
    const followNickname = this.data.userInfo.nickname;
  
    wx.request({
      url: 'http://43.143.205.76:8000/user/add_following',
      data: {
        user_id: currentUserId,
        follow_name: followNickname
      },
      method: "GET",
      success: function(res) {
        if (res.statusCode === 200) {
          console.log(currentUserId);
          console.log('成功添加关注:', res.data); // 展示返回的数据
          that.checkIfFollowing(); // 重新检查关注状态
        } else {
          console.error('添加关注失败:', res);
        }
      },
      fail: function(err) {
        console.error('请求添加关注接口失败:', err);
      }
    });
  },

  unfollowUser: function() {
    const that = this;
    const currentUserId = getApp().globalData.userid; // 获取当前登录用户的ID
    const unfollowNickname = this.data.userInfo.nickname; // 获取要取消关注的用户的昵称

    wx.request({
      url: 'http://43.143.205.76:8000/user/remove_following',
      method: 'GET', // 注意: 通常删除操作应该使用 POST 或 DELETE 方法
      data: {
        user_id: currentUserId,
        unfollow_name: unfollowNickname
      },
      success: function(res) {
        if (res.statusCode === 200) {
          console.log('成功取消关注');
          that.setData({ isFollowing: false }); // 更新关注状态
          // 可以在这里添加其他成功取消关注后的操作
        } else {
          console.error('取消关注失败:', res);
        }
      },
      fail: function(err) {
        console.error('请求取消关注接口失败:', err);
      }
    });
  },

  getImage: function() {
    const that = this;
    wx.request({
      url: 'http://43.143.205.76:8000/user/get_image/',
      data: { user_id: this.data.userId },
      responseType: 'arraybuffer',  // 确保接收的是二进制数据
      success(res) {
        if (res.statusCode === 200 && res.data) {
          // 将二进制数据转换为 Base64 编码的字符串
          const base64 = wx.arrayBufferToBase64(res.data);
          const imageUrl = 'data:image/jpeg;base64,' + base64;
          that.setData({ 'userInfo.user_image': imageUrl });
        } else {
          console.error('获取图像失败:', res);
        }
      },
      fail(err) {
        console.error('请求图像失败', err);
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
  onShow: function() {
    // 每次页面显示时，重新检查关注状态
    this.checkIfFollowing();
    
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