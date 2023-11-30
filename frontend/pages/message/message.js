// pages/message/message.js
Page({
  data: {
    active: 0
  },
  onChange(event) {
    const index = event.detail;
    const pages = ['correction', 'forum', 'message', 'info'];
    const url = `../${pages[index]}/${pages[index]}`;
    wx.navigateTo({
      url,
      success: () => {
        console.log('成功跳转到', url);
      },
      fail: (error) => {
        console.error('跳转失败', error);
      }
    });
  }
})