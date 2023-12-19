// pages/doctorcertificate/doctorcertificate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    fileCount: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  handleUpload(event) {
    const { file } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    /*
    wx.uploadFile({
      url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'file',
      formData: { user: 'test' },
      success(res) {
        // 上传完成需要更新 fileList
        const { fileList = [] } = this.data;
        fileList.push({ ...file, url: res.data });
        this.setData({ fileList });
      },
    });
    */
    const { fileList = [] } = this.data;
    fileList.push(file);
    const fileCount = fileList.length;
    this.setData({ fileList, fileCount });
  },

  // 处理确认上传
  handleConfirm(){
    wx.showToast({
      title: '上传成功',
      icon: 'success',
      duration: 2000,
    });
    this.setData({ fileList: [], fileCount: 0 });
  }
})