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
          for (var i = 0; i < res.data.length; i++) {
            // 创建一个 Date 对象
            var date = new Date(res.data[i].created_at);
            // 获取年、月、日、小时和分钟
            var year = date.getFullYear();
            var month = date.getMonth() + 1; // 月份是从 0 开始计数的，所以要加 1
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            // 格式化成需要的形式
            var formattedTime = year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day + ' ' + (hour < 10 ? '0' : '') + hour + ':' + (minute < 10 ? '0' : '') + minute;
            res.data[i].created_at = formattedTime;
          };
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
  },

  // 显示消息详情
  showDetailMsg(event){
    var index = event.currentTarget.dataset.index;
    var content = this.data.Msg[index].message;
    wx.showModal({
      title: '系统信息',
      content: content,
      showCancel: false
    })
  }
})