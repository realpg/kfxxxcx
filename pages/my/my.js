const app = getApp();
var vm;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    remind: 3
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;

    vm.setData({
      user: app.globalData.userInfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    vm.setData({
      user: app.globalData.userInfo
    })
    console.log(vm.data.user)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  ToHistory: function () {
    wx.navigateTo({
      url: './CJhistory/CJhistory',
    })
  },
  ToLBHistory: function () {
    wx.navigateTo({
      url: './LBhistory/LBhistory',
    })
  },
  info: function () {
    wx.navigateTo({
      url: '/pages/my/info/info',
    })
  },
  ToKfjh: function () {
    wx.navigateTo({
      url: '/pages/my/kfjh/kfjh',
    })
  },
  ToMessage: function () {
    wx.navigateTo({
      url: './message/message',
    })
  },
  Feedback: function () {
    wx.navigateTo({
      url: './feedback/feedback',
    })
  },
  medicalRecord: function () {
    wx.navigateTo({
      url: './medicalRecord/medicalRecord',
    })
  }
})