// pages/info/info.js
Page({
  data: {
    nickname: '',
    avatarUrl: '',
  },

  // 每次进入更新头像等
  onShow() {
    console.log("onShow");
    this.getImage(); // 在onShow生命周期函数中调用getImage函数
    this.setData({
      nickname: getApp().globalData.nickname,
    });
  },

  // 进入编辑个人信息主页
  handleEditInfo() {
    wx.navigateTo({
      url: '/pages/edituserinfo/edituserinfo'
    });
    console.log("跳转至个人信息编辑界面");
  },

  // 获取头像
  getImage() {
    // 下载文件
    wx.downloadFile({
      url: 'http://43.143.205.76:8000/user/get_image?user_id=' + getApp().globalData.userid,
      success: (downloadRes) => {
        if (downloadRes.statusCode === 200) {
          // 下载成功
          console.log(downloadRes);
          const filePath = downloadRes.tempFilePath;
          this.setData({
            avatarUrl: filePath,
          })
        } else {
          console.error('下载文件失败', downloadRes);
        }
      },
      fail: (err) => {
        console.error('下载文件失败', err);
      }
    });
  },

  onLoad: function () {
    //调用应用实例的方法获取全局数据
    this.setData({
      nickname: getApp().globalData.nickname,
    });
  },
})