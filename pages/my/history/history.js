// pages/my/history/history.js
var vm;
const util = require('../../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    history: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;

    //先从服务器获取历史数据
    util.getKFSJByUserId({ id: app.globalData.user.id }, function (res) {
      var history = [];
      if (res.data.result) {
        console.log(res.data.ret)
        for (var x in res.data.ret) {
          var date = res.data.ret[x].created_at.substr(0, 10);
          if (history.length == 0) {
            history.push({
              date: date,
              measure: [{ name: res.data.ret[x].sjx.name, value: res.data.ret[x].value }]
            })
          } else {
            var flag = true;
            for (var y in history) {
              if (history[y].date == date) {
                history[y].measure.push({ name: res.data.ret[x].sjx.name, value: res.data.ret[x].value })
                flag = false;
              }
            }
            if (flag) {
              history.push({
                date: date,
                measure: [{ name: res.data.ret[x].sjx.name, value: res.data.ret[x].value }]
              })
            }
          }
        }
        console.log(history)
      }
      history = history.sort((a, b) => { return a > b ? -1 : 1 })
      vm.setData({
        history: history
      });
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