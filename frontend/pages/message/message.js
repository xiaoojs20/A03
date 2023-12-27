// pages/message/message.js
Page({
  data: {
    ifMsg: false,
    Msg: [],
  },

  onShow(){
    this.handleGetMsg();
  },

  handleGetMsg(){
    wx.request({
      url: 'http://43.143.205.76:8000/notifications/notifications/'+getApp().globalData.userid+'/', // 修改<user_id>，比如o-Hbd6bbDxfCqNpz5xsTgMLKDR3Q 
      method: 'GET', 
      header: {
          'content-type': 'application/json'
      }, // 设置请求的 header
      success: (res) => {
        if (res.statusCode === 200) {
          console.log("系统通知数据获取成功", res.data); // 在这里处理系统通知数据
          if (res.data.length !== 0)
          {
            this.setData({
              Msg: res.data,
              ifMsg: true,
            });
          };
        } else {
          console.log("系统通知数据获取失败：", res.data.error);
        }
      }, fail: (err) => {
        console.error('请求失败', err); // 在这里处理请求失败的情况 
      }
    });
  }
})