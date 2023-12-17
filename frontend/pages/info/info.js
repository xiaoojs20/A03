// pages/info/info.js
Page({
  data: {
    nickname: '',
    avatarUrl: '',
  },

  // 进入编辑个人信息主页
  handleEditInfo(){
    wx.navigateTo({
      url: '/pages/edituserinfo/edituserinfo'
    });
    console.log("跳转至个人信息编辑界面");
  },

  onLoad: function () {
    console.log('onLoad');
    //调用应用实例的方法获取全局数据
    this.setData({
      nickname: getApp().globalData.nickname,
      avatarUrl: getApp().globalData.avatarUrl,
    })
  },
})