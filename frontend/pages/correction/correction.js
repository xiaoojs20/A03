// pages/correction/correction.js
Page({
  data: {
    circleProgress: 70,   // 环形进度条进度
    allBraceAmount: 100,  // 总牙套数量
    braceAmount: 0,      // 剩余牙套数量
    followupDate: "2023-12-31",     // 复诊日期
    daysLeft: 1,          // 距今剩余的时间
    currentDate: new Date().getTime(),   // 今天
    gradientColor: {
      '0%': '#ffd01e',
      '100%': '#ee0a24',
    },
    showPopup: false,
    popupDate: new Date().getTime(),
  },

  handleGetBrace() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'http://43.143.205.76:8000/user/get_brace/',
        data: {
          user_id: getApp().globalData.userid
        },
        success: (res) => {
          console.log(res.data);
          getApp().globalData.braceAmount = res.data.brace_total;
          getApp().globalData.braceAmountUsed = res.data.brace_total;
          getApp().globalData.followupDate = res.data.followup_date;
          
          // 给复诊日期进行初始化
          if (getApp().globalData.followupDate == null) {
            const currentDate = new Date().toISOString().split('T')[0];
            getApp().globalData.followupDate = currentDate;
            console.log(getApp().globalData.followupDate);
          }

          this.setData({
            allBraceAmount: getApp().globalData.braceAmount,
            braceAmount: getApp().globalData.braceAmount - getApp().globalData.braceAmountUsed,
            followupDate: getApp().globalData.followupDate,
          });
          resolve(); // 数据获取成功，调用 resolve
        },
        fail: (err) => {
          console.error('请求失败', err);
          reject(err); // 数据获取失败，调用 reject
        }
      });
    });
  },
  
  handleChangeBrace() {
    wx.request({
      url: 'http://43.143.205.76:8000/user/change_brace/',
      method: 'GET',
      data: {
        user_id: getApp().globalData.userid,
        brace_total: getApp().globalData.braceAmount,
        brace_used: getApp().globalData.braceAmountUsed,
        followup_date: getApp().globalData.followupDate
      },
      success: (res) => {
        console.log(res.data);
      },
      fail: (err) => {
        console.error('请求失败', err);
      }
    });
  },

  async onLoad() {
    try {
      // 初始化页面数据
      await this.handleGetBrace();
  
      // 获取时间
      const followupTimestamp = new Date(getApp().globalData.followupDate).getTime(); // 获取复诊日期的时间戳
      const todayTimestamp = new Date().getTime(); // 获取今天的时间戳
      const diffTimestamp = followupTimestamp - todayTimestamp; // 计算两个时间戳之差
      const diffDays = Math.floor(diffTimestamp / (24 * 60 * 60 * 1000)) + 1; // 将时间戳转换为相差天数
      this.setData({
        daysLeft: diffDays < 0 ? 0 : diffDays // 如果相差天数小于0，则剩余天数为0
      });
    } catch (error) {
      console.error('数据获取失败', error);
    }
  },

  showDatePicker() {
    this.setData({ showPopup: true });
  },

  onConfirmDate(event) {
    const selectedDate = new Date(event.detail);
    const formattedDate = this.formatDateString(selectedDate);
    this.setData({
      followupDate: formattedDate,
      showPopup: false
    });
    getApp().globalData.followupDate = formattedDate;
    const followupTimestamp = new Date(this.data.followupDate).getTime(); // 获取复诊日期的时间戳
    const todayTimestamp = new Date().getTime(); // 获取今天的时间戳
    const diffTimestamp = followupTimestamp - todayTimestamp; // 计算两个时间戳之差
    const diffDays = Math.floor(diffTimestamp / (24 * 60 * 60 * 1000)) + 1; // 将时间戳转换为相差天数
    this.setData({
      daysLeft: diffDays < 0 ? 0 : diffDays // 如果相差天数小于0，则剩余天数为0
    });
    this.handleChangeBrace();
  },

  formatDateString(date) {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let day = date.getDate();
    day = day < 10 ? '0' + day : day;
    return `${year}-${month}-${day}`;
  },

  onCancelDate() {
    this.setData({ showPopup: false });
  },

  handleWearTipsClick() {
    wx.showModal({
      title: '牙套佩戴方法',
      content: '我是牙套的佩戴方法',
      showCancel: false
    })
  },

  onChangeBrace(event) {
    const { value } = event.detail;
    wx.showToast({
      icon: 'none',
      title: `当前值：${event.detail}`,
    });
    this.setData({
      allBraceAmount: event.detail,
    });
    getApp().globalData.braceAmount = event.detail;
    this.handleChangeBrace();
  },

  handleClockIn() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}:${seconds}`;    // 到此获取现在时间

    wx.showToast({
      title: '打卡成功',
      icon: 'success',
      duration: 2000,
    });
  },
});
