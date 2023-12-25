// pages/setreminders/setreminders.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reminders: [],
    showSetReminder: false,
    showChangeReminder: false,
    currentTime: new Date().getTime(),
    new_reminder_value: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.handleGetReminders();
  },

  // 获取提醒信息
  handleGetReminders(){
    wx.request({
      url: 'http://43.143.205.76:8000/reminder/view',
      method: 'GET',
      data: {
        user_id: getApp().globalData.userid
      },
      success: (res) => {
        // 请求成功时的回调
        console.log(res); // 输出返回的数据
        if (res.data != ""){
          const data = res.data.reminders
          const reminders = data.map((item, index) => {
            return {
              id: item.id,
              time: item.reminder_time.replace('T', ' '),
              message: item.message
            }
          })
          this.setData({
            reminders
          })
          console.log(reminders);
        }
      },
      fail: (err) => {
        // 请求失败时的回调
        console.error('请求失败', err);
      }
    });
  },

  // 新增提醒
  handleSetReminder(){
    this.setData({
      showSetReminder: true,
    });
  },
  cancelSetReminder(){
    this.setData({
      showSetReminder: false,
      new_reminder_value: "",
    });
  },
  onChangeSetReminder(event){
    this.setData({
      new_reminder_value: event.detail.value,
    })
  },
  onInputSetReminder(event){
    const selectedTime = event.detail;
    const formattedTime = new Date(selectedTime).toISOString().slice(0, 19);
    console.log(formattedTime);
    wx.request({
      url: 'http://43.143.205.76:8000/reminder/set_reminder',
      method: 'POST',
      data: {
        user_id: getApp().globalData.userid,
        reminder_time: formattedTime,
        message: this.data.new_reminder_value,
      },
      success: (res) => {
        // 请求成功时的回调
        console.log(res); // 输出返回的数据
        this.handleGetReminders();
        this.setData({
          showSetReminder: false,
          new_reminder_value: "",
        });
      },
      fail: (err) => {
        // 请求失败时的回调
        console.error('请求失败', err);
      }
    });
  },

  // 删除已有提醒
  handleDeleteReminder(event){
    const { item } = event.currentTarget.dataset;
    console.log(item);
    wx.request({
      url: 'http://43.143.205.76:8000/reminder/delete',
      method: 'DELETE',
      data: {
        id: item.id,
      },
      success: (res) => {
        // 请求成功时的回调
        console.log(res); // 输出返回的数据
        this.handleGetReminders();
      },
      fail: (err) => {
        // 请求失败时的回调
        console.error('请求失败', err);
      }
    });
  },

  // 修改已有提醒
  handleChangeReminder(event){
    const { item } = event.currentTarget.dataset;
    this.setData({
      showChangeReminder: true,
      new_reminder_value: item.message,
    });
  },
  cancelChangeReminder(){
    this.setData({
      showChangeReminder: false,
      new_reminder_value: "",
    });
  },
  onChangeChangeReminder(event){
    this.setData({
      new_reminder_value: event.detail.value,
    })
  },
  onInputChangeReminder(event){
    const selectedTime = event.detail;
    const formattedTime = new Date(selectedTime).toISOString().slice(0, 19);
    console.log(formattedTime);
    wx.request({
      url: 'http://43.143.205.76:8000/reminder/modify',
      method: 'POST',
      data: {
        user_id: getApp().globalData.userid,
        reminder_time: formattedTime,
        message: this.data.new_reminder_value,
      },
      success: (res) => {
        // 请求成功时的回调
        console.log(res); // 输出返回的数据
        this.handleGetReminders();
        this.setData({
          showSetReminder: false,
          new_reminder_value: "",
        });
      },
      fail: (err) => {
        // 请求失败时的回调
        console.error('请求失败', err);
      }
    });
  },
})