// pages/report/report.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.handleGetReport();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  handleGetReport(){
    wx.request({
      url: 'http://43.143.205.76/clockin/report/', // 接口 URL 地址
      method: 'POST', // 请求方法
      data: {
        user_id: getApp().globalData.userid, // 用户的唯一标识符
        report_type: 'weekly' // 请求周报 月报改成'monthly'
      },
      header: {
        'content-type': 'application/json' // 设置请求的 header
      },
      success: (res) => {
        // 请求成功时的回调
        console.log(res.data); // 输出返回的数据
        // 根据返回的数据更新UI
        if (res.statusCode === 200) {
          console.log("周报数据获取成功");
          // 处理周报数据
        } else {
          console.log("周报数据获取失败：", res.data.error);
        }
      },
      fail: (err) => {
        // 请求失败时的回调
        console.error('请求失败', err);
        // 在这里处理请求失败的情况
      }
    });
  }
})