// pages/myfollowing/myfollowing.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.handleGetFollowing();
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
  handleGetFollowing() {
    wx.request({
      url: 'http://43.143.205.76:8000/user/get_following',
      data: {
        user_id: getApp().globalData.userid
      },
      success: (res) => {
        // 请求成功时的回调
        console.log(res.data); // 输出返回的数据
        // 在这里你可以对返回的数据进行处理
      },
      fail: (err) => {
        // 请求失败时的回调
        console.error('请求失败', err);
      }
    });
  },
})