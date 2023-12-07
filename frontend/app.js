// app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
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
    avatarUrl: '',
    is_doctor: false,
    braceAmount: '',
    braceAmountUsed: '',
    followupDate: '',
  },

  handleGetInfoGlobal() {
   wx.request({
          url: 'http://43.143.205.76:8000/user/get_info',
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
            //this.globalData.braceAmount = res.data.brace_total;
            //this.globalData.braceAmountUsed = res.data.brace_used;
            //this.globalData.followupDate = res.data.followup_date;
          },
          fail: (err) => {
            // 请求失败时的回调
            console.error('请求失败', err);
          }
        });
  },

  handleChangeInfoGlobal() {
      wx.request({
        url: 'http://43.143.205.76:8000/user/change_info',
        data: {
          user_id: this.globalData.userid,
          nickname: this.globalData.nickname,
          gender: this.globalData.gender,
          mobile: this.globalData.mobile,
          email: this.globalData.email,
          birthday: this.globalData.birthday,
          introduce: this.globalData.introduce,
          is_doctor: this.globalData.is_doctor,
          //brace_total: this.globalData.braceAmount,
          //brace_used: this.globalData.braceAmountUsed,
          // avatarUrl: this.globalData.avatarUrl,
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
   }
})
