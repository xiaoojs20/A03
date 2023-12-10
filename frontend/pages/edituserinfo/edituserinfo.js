// pages/edituserinfo/edituserinfo.js
Page({
  data: {
    showPopup: false,    // 生日输入框控制
    minDate: new Date(1900, 1, 1).getTime(),
    maxDate: new Date().getTime(),
    avatarUrl: '',  // 头像地址
    nickname: getApp().globalData.nickname,   // 昵称
    gender: getApp().globalData.gender,  // 性别选项
    mobile: getApp().globalData.mobile,   // 电话
    email: getApp().globalData.email,    // 邮箱
    birthday: getApp().globalData.birthday,    // 生日
    introduce: getApp().globalData.introduce,   // 自我介绍

    fileList: [],
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
          //birthday: this.data.birthday,
          introduce: this.data.introduce
        },
        success: (res) => {
          // 请求成功时的回调
          console.log(res.data); // 输出返回的数据
          getApp().globalData.nickname = this.data.nickname;
          getApp().globalData.gender = this.data.gender;
          getApp().globalData.mobile = this.data.mobile;
          getApp().globalData.email = this.data.email;
          getApp().globalData.birthday = this.data.birthday;
          getApp().globalData.introduce = this.data.introduce;
          wx.navigateBack({
            delta: 1
          });
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
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: 'https://example.weixin.qq.com/upload',
      filePath: file.url,
      name: 'file',
      formData: { user: 'test' },
      success(res) {
        // 上传完成需要更新 fileList
        const { fileList = [] } = this.data;
        fileList.push({ ...file, url: res.data });
        this.setData({ fileList });
      },
    });
  },
});