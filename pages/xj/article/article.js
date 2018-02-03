// pages/textlist/article/atricle.js
var vm
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 2,
    title: "",
    desc: "",
    author: "",
    doctor_id: "",
    img: "",
    seq: 0,
    status: "",
    type: "",
    show_num: 0,
    doctor: {
    },
    types: {
      data: []
    },
    steps: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;

    vm.setData({
      id: options.id
    })
    console.log("界面接收id:", vm.data.id)
    util.showLoading()
    // 在这里根据ID获取宣教信息
    util.getArticle({ id: vm.data.id }, function (res) {
      console.log("article:", res.data.ret)
      vm.setData({
        id: res.data.ret.id,
        title: res.data.ret.title,
        desc: res.data.ret.desc,
        author: res.data.ret.author,
        steps: res.data.ret.steps,
        types: res.data.ret.types
      })
    }, null)
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

  }
})