// pages/correction/correction.js
Page({
  data: {
    circleProgress: 0,   // 环形进度条进度
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
    showSetDate: false,
    showSetStartDate: false,
    showSetEndDate: false,
    start_date: "2021-12-31",
    end_date: "2025-12-31",
    startSetDate: new Date(2021, 0, 1).getTime(),
    endSetDate: new Date(2025, 0, 1).getTime(),
    showClockIn: false,
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
          getApp().globalData.braceAmountUsed = res.data.brace_used;
          getApp().globalData.followupDate = res.data.followup_date;
          getApp().globalData.start_date = res.data.start_date;
          getApp().globalData.end_date = res.data.end_date;
          
          // 给复诊日期进行初始化
          if (getApp().globalData.followupDate == "") {
            const currentDate = new Date().toISOString().split('T')[0];
            getApp().globalData.followupDate = currentDate;
            console.log(getApp().globalData.followupDate);
          }
          // 给起始日期进行初始化
          if (getApp().globalData.start_date == "") {
            const currentDate = new Date().toISOString().split('T')[0];
            getApp().globalData.start_date = currentDate;
            console.log(getApp().globalData.start_date);
          }
          // 给终止日期进行初始化
          if (getApp().globalData.end_date == "") {
            const currentDate = new Date().toISOString().split('T')[0];
            getApp().globalData.end_date = currentDate;
            console.log(getApp().globalData.end_date);
          }
          this.setData({
            allBraceAmount: getApp().globalData.braceAmount,
            braceAmount: getApp().globalData.braceAmount - getApp().globalData.braceAmountUsed,
            followupDate: getApp().globalData.followupDate,
            start_date:  getApp().globalData.start_date,
            end_date:  getApp().globalData.end_date,
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
        followup_date: getApp().globalData.followupDate,
        start_date: getApp().globalData.start_date,
        end_date: getApp().globalData.end_date,
      },
      success: (res) => {
        console.log(res.data);
      },
      fail: (err) => {
        console.error('请求失败', err);
      }
    });
  },

  // 获取进度信息
  handleGetRatio() {
    wx.request({
      url: 'http://43.143.205.76:8000/user/get_ratio/',
      method: 'GET',
      data: {
        user_id: getApp().globalData.userid
      },
      success: (res) => {
        // 请求成功时的回调
        console.log(res.data); // 输出返回的数据
        // 在这里你可以对返回的数据进行处理
        this.setData({
          circleProgress: parseInt(res.data.ratio*100),
        });
      },
      fail: (err) => {
        // 请求失败时的回调
        console.error('请求失败', err);
      }
    });
  },

  async onLoad() {
    try {
      // 初始化页面数据
      await this.handleGetBrace();
      this.handleGetRatio();
  
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
      content: '戴牙套首先需要根据牙齿情况确定矫正的方式，所以在戴牙套之前，首先应该做牙齿以及头部骨头的拍片检查，目的是为了看牙齿以及骨骼的发展方向，来确定具体的牙套模型，然后开始制造合适的牙齿模型，其次就是分牙，用分牙圈套在上下左右的磨牙之间，使牙齿移出一点空隙，让在戴牙套的时候能够放进固定牙套的钢圈，3-5天后，取下分牙圈，粘固直径合适的带环，然后把牙面上覆盖的结石去除，洁净牙面，用酒精棉球清洁唇颊牙面，涂抹30%磷酸，彻底冲洗、干燥后，涂粘固剂，再根据牙齿形态和牙齿模型制作出适合牙齿的牙套，带上牙套，最后再做牙齿定型，使牙齿的中线与脸型相对称。',
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

  onChangeBraceUsed(event) {
    const { value } = event.detail;
    wx.showToast({
      icon: 'none',
      title: `当前值：${event.detail}`,
    });
    this.setData({
      braceAmount: event.detail,
    });
    getApp().globalData.braceAmountUsed = this.data.allBraceAmount - event.detail;
    this.handleChangeBrace();
  },

  // 处理打卡
  handleClockIn() {
    this.setData({ showClockIn: true });
  },

  onCloseClockIn() {
    this.setData({ showClockIn: false });
  },

  handleClockInOn() {
    // 传递信息
    wx.request({
      url: 'http://43.143.205.76:8000/clockin/set_time/',
      method: 'POST',
      data: {
        "user_id": getApp().globalData.userid,
        "check_in_type": 'on',
      },
      success: (res) => {
        // 请求成功时的回调
        console.log(res.data); // 输出返回的数据
        wx.showToast({
          title: '打卡成功',
          icon: 'success',
          duration: 2000,
        });
      },
      fail: (err) => {
        // 请求失败时的回调
        console.error('请求失败', err);
      }
    });
  },

  handleClockInOff() {
    // 传递信息
    wx.request({
      url: 'http://43.143.205.76:8000/clockin/set_time/',
      method: 'POST',
      data: {
        "user_id": getApp().globalData.userid,
        "check_in_type": 'off',
      },
      success: (res) => {
        // 请求成功时的回调
        console.log(res.data); // 输出返回的数据
        wx.showToast({
          title: '打卡成功',
          icon: 'success',
          duration: 2000,
        });
      },
      fail: (err) => {
        // 请求失败时的回调
        console.error('请求失败', err);
      }
    });
  },

  // 处理微信提醒设置
  handleSetReminder() {
    wx.navigateTo({
      url: '/pages/setreminders/setreminders'
    });
    console.log("跳转至设置微信提醒界面");
  },

  // 处理正畸日期设置
  handleSetDate() {
    this.setData({ showSetDate: true });
  },

  onCloseSetDate() {
    this.handleGetRatio();
    this.setData({ showSetDate: false });
  },

  handleSetStartDate() {
    this.setData({ showSetStartDate: true });
  },

  onCancelStartDate() {
    this.setData({ showSetStartDate: false });
  },

  onConfirmStartDate(event) {
    const selectedDate = new Date(event.detail);
    const formattedDate = this.formatDateString(selectedDate);
    this.setData({
      start_date: formattedDate,
      showSetStartDate: false
    });
    getApp().globalData.start_date = formattedDate;
    this.handleChangeBrace();
  },

  handleSetEndDate() {
    this.setData({ showSetEndDate: true });
  },

  onCancelEndDate() {
    this.setData({ showSetEndDate: false });
  },

  onConfirmEndDate(event) {
    const selectedDate = new Date(event.detail);
    const formattedDate = this.formatDateString(selectedDate);
    this.setData({
      end_date: formattedDate,
      showSetEndDate: false
    });
    getApp().globalData.end_date = formattedDate;
    this.handleChangeBrace();
  },
});
