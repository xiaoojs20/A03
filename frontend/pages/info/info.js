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

  get_image() {
        wx.request({
          url: 'http://43.143.205.76:8000/user/get_image',
          data: {
            user_id: getApp().globalData.userid,
          },
          success: (res) => {
            // 请求成功时的回调
            console.log(res.data); // 输出返回的数据
          },
          fail: (err) => {
            // 请求失败时的回调
            console.error('请求失败', err);
          }
        });
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