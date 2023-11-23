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
  },

  onLoad() {
    const followupTimestamp = new Date(this.data.followupDate).getTime(); // 获取复诊日期的时间戳
    const todayTimestamp = new Date().getTime(); // 获取今天的时间戳
    const diffTimestamp = followupTimestamp - todayTimestamp; // 计算两个时间戳之差
    const diffDays = Math.floor(diffTimestamp / (24 * 60 * 60 * 1000)); // 将时间戳转换为相差天数
    this.setData({
      daysLeft: diffDays < 0 ? 0 : diffDays // 如果相差天数小于0，则剩余天数为0
    });
  },

  showDatePicker() {
    this.setData({ showPopup: true });
  },

  onConfirmDate(event) {
    const selectedDate = new Date(event.detail);
    const formattedDate = this.formatDateString(selectedDate);
    this.setData({ followupDate: formattedDate, showPopup: false });
    const followupTimestamp = new Date(this.data.followupDate).getTime(); // 获取复诊日期的时间戳
    const todayTimestamp = new Date().getTime(); // 获取今天的时间戳
    const diffTimestamp = followupTimestamp - todayTimestamp; // 计算两个时间戳之差
    const diffDays = Math.floor(diffTimestamp / (24 * 60 * 60 * 1000)); // 将时间戳转换为相差天数
    this.setData({
      daysLeft: diffDays < 0 ? 0 : diffDays // 如果相差天数小于0，则剩余天数为0
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

  onCancelDate() {
    this.setData({ showPopup: false });
  },

});
