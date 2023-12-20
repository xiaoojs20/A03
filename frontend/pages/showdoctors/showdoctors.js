// pages/showdoctors/showdoctors.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    doctors: [],
    showDoctorData: false,
    doctorName:'',
    doctorTitle: '',
    doctorSchool: '',
    doctorDegree: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.handleGetDoctors();
  },

  // 获取北京市医生列表
  handleGetDoctors() {
    wx.request({
      url: 'http://localhost:8000/user/get_doctor',
      success: (res) => {
        // 请求成功时的回调
        console.log(res.data); // 输出返回的数据
        // 在这里你可以对返回的数据进行处理
        const doctorsInfo = res.data.doctors.slice(1);
        this.setData({
          doctors: doctorsInfo,
        });
      },
      fail: (err) => {
        // 请求失败时的回调
        console.error('请求失败', err);
      }
    });
  },

  // 显示医生详细信息
  showDoctorDetails(event){
    const {index} = event.currentTarget.dataset;
    const doctor = this.data.doctors[index];
    this.setData({
      showDoctorData: true,
      doctorName: doctor.real_name,
      doctorTitle: doctor.title,
      doctorSchool: doctor.school,
      doctorDegree: doctor.degree,
    });
  },

  // 关闭医生详情页面
  onCloseDoctor(){
    this.setData({
      showDoctorData: false,
    });
  }
})