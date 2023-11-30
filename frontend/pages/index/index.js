// index.js
Page({
  gotoLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    });
    console.log('跳转至登录界面');
  },
});