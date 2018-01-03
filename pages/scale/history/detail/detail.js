// pages/scale/history/detail/detail.js
var vm;
const util = require('../../../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;
    console.log(options.lb_id, options.result)
    var str = options.result.split(";");
    var results = [];
    for (var i in str) {
      results[i] = [];
      str[i]=str[i].substr(2)
      console.log("str:",str[i])

      for (var j = 0; j < 10; j++)//假设选项最多为10项
        if (str[i].search(j)>=0)
          results[i].push(true);
        else
          results[i].push(false);
    }

    console.log("detail.results:", results)
    vm.setData({
      id: options.lb_id,
      results: results
    })
    //这里根据id获取量表问题

    util.getQuesitionsById({ 'id': options.lb_id }, function (res) {
      if (res.data.result) {
        console.log("成功获得量表问题", res.data.ret)
        var questions = res.data.ret.questions;
        for (var i in questions) {
          var ansAndPoint = questions[i].answer.split("@q=");
          questions[i].answer = [];
          questions[i].point = [];
          for (var j = 1; j < ansAndPoint.length; j++) {
            questions[i].answer.push(ansAndPoint[j].split("&p=")[0]);
            questions[i].point.push(ansAndPoint[j].split("&p=")[1]);
          }
        }

        console.log("ques", questions)
        vm.setData({
          info: res.data.ret,
          questions: questions
        })
        wx.setNavigationBarTitle({
          title: vm.data.info.name,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }

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