// pages/setreminders/setreminders.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reminders: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.handleGetReminders();
  },

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
              index: index+1,
              id: item.id,
              time: item.reminder_time
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

  /*
  handleDeleteReminder(){
    
  }
  */
})