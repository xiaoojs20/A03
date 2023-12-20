// app.js
App({
  onLaunch: function () {
    wx.clearStorageSync();
  },

  // 用户信息全局数据
  globalData:{
    userid: '',
    nickname: '',
    gender: '',
    mobile: '',
    email: '',
    birthday: '',
    introduce: '',
    avatarUrl: '/images/info/defaultavatar.png',
    is_doctor: false,
    braceAmount: '',
    braceAmountUsed: '',
    followupDate: '',
    start_date: '',
    end_date: '',
  },

  handleGetInfoGlobal() {
   wx.request({
          url: 'http://localhost:8000/user/get_info',
          data: {
            user_id: getApp().globalData.userid
          },
          success: (res) => {
            console.log(res.data);
            this.globalData.nickname = res.data.nickname;
            this.globalData.gender = res.data.gender;
            this.globalData.mobile = res.data.mobile;
            this.globalData.email = res.data.email;
            this.globalData.birthday = res.data.birthday;
            this.globalData.introduce = res.data.introduce;
            //this.globalData.avatarUrl = res.data.avatarUrl;
            this.globalData.is_doctor = res.data.is_doctor;
          },
          fail: (err) => {
            // 请求失败时的回调
            console.error('请求失败', err);
          }
        });
  },

})
