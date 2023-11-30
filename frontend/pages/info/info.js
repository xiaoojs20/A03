// pages/info/info.js
Page({
  data: {
    nickname: '',
  },
  
  // 标签栏跳转函数
  onChange(event) {
    const index = event.detail;
    const pages = ['correction', 'forum', 'message', 'info'];
    const url = `../${pages[index]}/${pages[index]}`;
    wx.switchTab({
      url,
      success: () => {
        console.log('成功跳转到', url);
      },
      fail: (error) => {
        console.error('跳转失败', error);
      }
    });
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
    this.handleGetInfo();
  },

  handleGetInfo() {
        wx.request({
          url: 'http://43.143.205.76:8000/user/get_info',
          data: {
            user_id: getApp().globalData.userid
          },
          success: (res) => {
            // 请求成功时的回调
            console.log(res.data); // 输出返回的数据
            // 在这里你可以对返回的数据进行处理
            this.setData({
              nickname: res.data.nickname, // 更新nickname的值
            });
          },
          fail: (err) => {
            // 请求失败时的回调
            console.error('请求失败', err);
          }
        });
    },
})