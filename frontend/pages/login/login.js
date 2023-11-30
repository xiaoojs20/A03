// pages/login/login.js
Page({
  data: {
    username: '', // 帐号
    password: '', // 密码
  },

  // 监听账号输入框的失去焦点事件
  handleUsernameBlur(event) {
    this.setData({
      username: event.detail.value
    });
    console.log('更新账号'+event.detail.value);
  },

  // 监听密码输入框的失去焦点事件
  handlePasswordBlur(event) {
    this.setData({
      password: event.detail.value
    });
    console.log('更新密码'+event.detail.value);
  },

  // 登录
  handleLogin() {
    wx.switchTab({
      url: '/pages/correction/correction'
    });
    console.log('跳转至正畸主界面');
  },

  handleWxLogin() {
        // wx.login 获得code临时登录凭证
        // https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html
        wx.login({
          success(res) {
            console.log(res.code)
            if (res.code) {
              // 发送code临时登录凭证到后端，发起网络请求
              wx.request({
                url: 'http://43.143.205.76:8000/user/login',
                data: {
                  code: res.code
                },
                success: function (res) {
                  // 在请求成功时执行的操作
                  console.log(res.data); // 这里是获取到的返回数据
                  getApp().globalData.userid = res.data.user_id
                
                  wx.switchTab({
                    url: '/pages/correction/correction'
                  });
                  
                  console.log('跳转至正畸主界面');
                },
                fail: function (error) {
                  // 在请求失败时执行的操作
                  console.log(error);
                }
              });
            } else {
              console.log('登录失败！' + res.errMsg);
            }
          }
        });
      },

  // 显示用户协议
  showAgreement() {
    wx.navigateTo({
      url: '/pages/userprotocol/userprotocol'
    });
    console.log("跳转至用户协议界面");
  },
});
