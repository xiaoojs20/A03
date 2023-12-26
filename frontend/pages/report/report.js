// pages/report/report.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    month_url: "",
    week_url:"",
    month_array: [],
    week_array: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.handleGetMonthReport();
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

  // 获取月报
  handleGetMonthReport(){
    wx.request({
      url: 'http://43.143.205.76:8000/clockin/report/', // 接口 URL 地址
      method: 'POST', // 请求方法
      data: {
        user_id: getApp().globalData.userid, // 用户的唯一标识符
        //user_id: "o-Hbd6bbDxfCqNpz5xsTgMLKDR3Q",
        report_type: 'monthly' // 请求月报
      },
      header: {
        'content-type': 'application/json' // 设置请求的 header
      },
      //responseType: 'arraybuffer', // 设为 arraybuffer 类型
      success: (res) => {
        // 请求成功时的回调
        console.log(res.data); // 输出返回的数据
        // 根据返回的数据更新UI
        if (res.statusCode === 200) {
          console.log("月报数据获取成功");
          const boundary = getBoundary(res.header['Content-Type']); // 获取 boundary
          const parts = splitIntoParts(res.data, boundary); // 拆分成多个部分
          console.log(parts);
          let dataArray = null;
          let imageSrc = null;

          parts.forEach((part) => {
            if (part.type === 'application/json') { // 处理 JSON 数据部分
              const jsonStr = String.fromCharCode.apply(null, new Uint8Array(part.data));
              const jsonObj = JSON.parse(jsonStr);
              dataArray = jsonObj.report_data;
            } else if (part.type === 'image/png') { // 处理图片数据部分
              const base64Data = arrayBufferToBase64(part.data);
              imageSrc = 'data:image/png;base64,' + base64Data;
            }
          });

        // 更新UI，展示数组和图片数据
        this.setData({
          dataArray: dataArray,
          month_url: imageSrc
        });
        } else {
          console.log("月报数据获取失败：", res.data.error);
        }
      },
      fail: (err) => {
        // 请求失败时的回调
        console.error('请求失败', err);
        // 在这里处理请求失败的情况
      }
    });
  },

  // 获取周报
  handleGetWeekReport(){
    wx.request({
      url: 'http://43.143.205.76:8000/clockin/report/', // 接口 URL 地址
      method: 'POST', // 请求方法
      data: {
        user_id: getApp().globalData.userid, // 用户的唯一标识符
        //user_id: "o-Hbd6bbDxfCqNpz5xsTgMLKDR3Q",
        report_type: 'weekly' // 请求周报
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
  },

  // 获取 boundary
  getBoundary(contentType) {
  const parts = contentType.split(';');
  const part = parts.find((part) => part.trim().startsWith('boundary='));
  return part ? part.trim().substring('boundary='.length) : null;
},
})

// 获取 boundary
function getBoundary(contentType) {
  const parts = contentType.split(';');
  const part = parts.find((part) => part.trim().startsWith('boundary='));
  return part ? part.trim().substring('boundary='.length) : null;
}

// 拆分成多个部分
function splitIntoParts(data, boundary) {
  const parts = [];
  let start = 0;
  let end = 0;

  while (end < data.byteLength) {
    while (data[end] !== 0x0d || data[end + 1] !== 0x0a) { // 查找分界点
      end++;
    }
    const header = String.fromCharCode.apply(null, new Uint8Array(data.slice(start, end)));
    const typeMatch = header.match(/Content-Type: (.+)/);
    const type = typeMatch ? typeMatch[1] : null;
    start = end + 2;
    end = start;
    while (end < data.byteLength) {
      if (data[end] === 0x2d && data[end + 1] === 0x2d &&
          String.fromCharCode.apply(null, new Uint8Array(data.slice(end + 2, end + 2 + boundary.length))) === boundary) { // 判断是否到达分界点
        parts.push({ type, data: data.slice(start, end) });
        start = end + 2 + boundary.length;
        end = start;
        break;
      }
      end++;
    }
  }

  return parts;
}

// 将 ArrayBuffer 转换为 Base64 格式
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}