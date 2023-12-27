// pages/edituserinfo/edituserinfo.js
Page({
  data: {
    showPopup: false,    // 生日输入框控制
    showGenderChoose: false,   //性别选择控制
    gender_name: '',     // 性别文字
    minDate: new Date(1970, 1, 1).getTime(),
    maxDate: new Date().getTime(),
    avatarUrl: '',  // 头像地址
    nickname: getApp().globalData.nickname,   // 昵称
    gender: getApp().globalData.gender,  // 性别选项
    mobile: getApp().globalData.mobile,   // 电话
    email: getApp().globalData.email,    // 邮箱
    birthday: getApp().globalData.birthday,    // 生日
    introduce: getApp().globalData.introduce,   // 自我介绍

    fileList: [],
    genders: ['男', '女', '其他'],
  },

  onLoad: function () {
    // 初始化数据
    this.setData({
      nickname: getApp().globalData.nickname,
      gender: getApp().globalData.gender,
      mobile: getApp().globalData.mobile,
      email: getApp().globalData.email,
      birthday: getApp().globalData.birthday,
      introduce: getApp().globalData.introduce,
    });
    if (getApp().globalData.gender == 0)
    {
      this.setData({
        gender_name: "男",
      })
    }
    else if (getApp().globalData.gender == 1)
    {
      this.setData({
        gender_name: "女",
      })
    }
    else
    {
      this.setData({
        gender_name: "其他",
      })
    }
  },

  handleInputNickname(e) {
    this.setData({
      nickname: e.detail.value
    });
    console.log(e);
  },

  handleChooseGender() {
    this.setData({
      showGenderChoose: true
    });
  },

  onConfirmGender(event) {
    const { value, index } = event.detail;
    this.setData({
      gender: index,
      gender_name: value,
      showGenderChoose: false,
    });
    console.log(event);
  },
  
  onCancelGender(event) {
    this.setData({
      showGenderChoose: false,
    });
    console.log(event);
  },

  handleInputEmail(e) {
    this.setData({
      email: e.detail.value
    });
    console.log(e);
  },

  handleInputMobile(e) {
    this.setData({
      mobile: e.detail.value
    });
    console.log(e);
  },

  handleInputIntroduce(e) {
    this.setData({
      introduce: e.detail.value
    });
    console.log(e);
  },

  handleChangeInfo() {
      wx.request({
        url: 'http://43.143.205.76:8000/user/change_info',
        data: {
          user_id: getApp().globalData.userid,
          nickname: this.data.nickname,
          gender: this.data.gender,
          email: this.data.email,
          mobile: this.data.mobile,
          birthday: this.data.birthday,
          introduce: this.data.introduce,
          user_image: this.data.avatarUrl
        },
        success: (res) => {
          // 请求成功时的回调
          console.log(res.data); // 输出返回的数据
          getApp().handleGetInfoGlobal();
          wx.showToast({
            title: '修改成功！',
            icon: 'success',
            duration: 1000,
            mask: true
          });
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/info/info'
            });
          }, 1000);
          
        },
        fail: (err) => {
          // 请求失败时的回调
          console.error('请求失败', err);
        }
      });
   },

  handleInputBirthday() {
    this.setData({ showPopup: true });
  },

  onCancelDate() {
    this.setData({ showPopup: false });
  },

  onConfirmDate(event) {
    const selectedDate = new Date(event.detail);
    const formattedDate = this.formatDateString(selectedDate);
    this.setData({
      showPopup: false,
      birthday: formattedDate,
    });
    getApp().globalData.birthday = this.data.birthday;
  },

  formatDateString(date) {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let day = date.getDate();
    day = day < 10 ? '0' + day : day;
    return `${year}-${month}-${day}`;
  },

  // 上传头像
  handleAfterRead(event) {
    const { file } = event.detail;
    wx.uploadFile({
      url: 'http://43.143.205.76:8000/user/upload_image/',
      header: {
        'content-type': 'multipart/form-data'
      },
      data: {
        user_image: file.url,
      },
      filePath: file.url,
      name: 'user_image',
      formData: {
        // user_id: getApp().globalData.userid,
        // user_id: 'o-Hbd6RvDXxQl0_cZ3_HKHPwNyGo'
        user_id: getApp().globalData.userid
      },
      success(res) {
        console.log(file);
        console.log(res);
      },
      fail: (err) => {
        // 请求失败时的回调
        console.error('请求失败', err);
      },
    });
  },
});