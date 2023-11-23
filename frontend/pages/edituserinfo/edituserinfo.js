// pages/edituserinfo/edituserinfo.js
Page({
  data: {
    avatarUrl: '',  // 头像地址
    nickname: '',   // 昵称
    gender: '',  // 性别选项
    mobile: '',   // 电话
    email: '',    // 邮箱

  },
  onLoad: function () {
    // 初始化数据
    this.handleGetInfo();
  },

  handleInputNickname(e) {
    this.setData({
      nickname: e.detail.value
    });
    console.log(e);
  },

  handleChooseGender(event) {
    this.setData({
      gender: event.detail,
    });
  },

  handleInputEmail(e) {
    this.setData({
      email: e.detail.value
    });
    console.log(e);
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
            gender: res.data.gender, 
            mobile: res.data.mobile,
            email: res.data.email,
          });
          },
          fail: (err) => {
            // 请求失败时的回调
            console.error('请求失败', err);
          }
        });
  },

handleChangeInfo() {
      wx.request({
        url: 'http://43.143.205.76:8000/user/change_info',
        data: {
          user_id: getApp().globalData.userid,
          nickname: this.data.nickname,
          gender: this.data.gender,
          email: this.data.email
        },
        success: (res) => {
          // 请求成功时的回调
          console.log(res.data); // 输出返回的数据
          // 在这里你可以对返回的数据进行处理
          wx.navigateBack({
            delta: 1
          });
        },
        fail: (err) => {
          // 请求失败时的回调
          console.error('请求失败', err);
        }
      });
   }
});