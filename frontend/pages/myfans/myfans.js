// pages/myfans/myfans.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fans: [],
    fansnumber: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.handleGetFans();
  },

  // 获取粉丝列表
  handleGetFans() {
    wx.request({
      url: 'http://43.143.205.76:8000/user/get_fans/',
      data: {
      user_id: getApp().globalData.userid,
      },
      success: (res) => {
        // 请求成功时的回调
        console.log(res.data.fans); // 输出返回的数据
        // 在这里你可以对返回的数据进行处理
        const fansInfo = res.data.fans;
        this.setData({
          fans: fansInfo,
          fansnumber: res.data.fans.length,
        });
      },
      fail: (err) => {
        // 请求失败时的回调
        console.error('请求失败', err);
      }
    });
  },
})