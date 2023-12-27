// pages/myfollowing/myfollowing.js
Page({

  data: {
    following: [], // 用于存储关注列表
    followingnumber:-1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.fetchFollowingList();
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

  // 获取关注用户列表
  fetchFollowingList: function() {
    const that = this;
    wx.request({
      url: 'http://43.143.205.76:8000/user/get_following/',
      data: { user_id: getApp().globalData.userid },
      success: function(res) {
        if (res.statusCode === 200 && res.data.following) {
          that.setData({
            following: res.data.following,
            followingnumber: res.data.following.length,
          });
          console.log('关注列表:', res.data.following);
        } else {
          console.error('获取关注列表失败:', res);
        }
      },
      fail: function(err) {
        console.error('请求关注列表失败:', err);
      }
    });
  },

  unfollowUser: function(event) {
    const that = this;
    const unfollowNickname = event.currentTarget.dataset.item; // 从事件中获取要取消关注的用户的昵称

    wx.request({
      url: 'http://43.143.205.76:8000/user/remove_following',
      method: 'GET', // 注意: 通常删除操作应该使用 POST 或 DELETE 方法
      data: {
        user_id: getApp().globalData.userid,
        unfollow_name: unfollowNickname
      },
      success: function(res) {
        if (res.statusCode === 200) {
          console.log('成功取消关注:', unfollowNickname);
          wx.showToast({
            title: '取消关注成功',
            icon: 'success',
            duration: 2000
          })
          // 在这里更新页面上的关注列表
          that.updateFollowingList(unfollowNickname);
        } else {
          console.error('取消关注失败:', res);
        }
      },
      fail: function(err) {
        console.error('请求取消关注接口失败:', err);
      }
    });
  },

  // 更新关注列表的方法
  updateFollowingList: function(unfollowNickname) {
    let updatedList = this.data.following.filter(nickname => nickname !== unfollowNickname);
    this.setData({ following: updatedList });
  },
})