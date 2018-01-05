// pages/scale/form/form.js
var vm;
const util = require('../../../utils/util.js')
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    questions: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;
    console.log(options.id)
    vm.setData({
      id: options.id
    })
    //这里根据id获取量表问题
    util.getQuesitionsById({ 'id': options.id }, function (res) {
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

  },
  formSubmit: function (e) {
    if (app.globalData.userInfo) {
      if (app.globalData.userInfo.id) {
        console.log('form发生了submit事件，携带数据为：', e.detail.value)

        wx.showLoading({
          title: '上传中',
        })
        var result = "";
        for (var i in e.detail.value) {
          console.log(e.detail.value[i])
          result += i + '_' + e.detail.value[i] + ";"
        }
        console.log(result)
        //这里上传数据
        var param = {
          user_id: app.globalData.userInfo.id,
          lb_id: vm.data.id,
          result: result
        }
        util.answerLB(param,
          function (res) {
            console.log("res1:", res.data)
            wx.showModal({
              title: '成功',
              content: '提交成功，点击确定返回',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 1
                  })
                }

              }
            })
          }, null)
      }
      else{
        wx.showModal({
          title: '用户信息缺失',
          content: '量表结果上传功能将无法使用，请重新注册',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              app.login(function () {
                
              });
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })  
      }
    } else {
      wx.showModal({
        title: '用户信息缺失',
        content: '量表结果上传功能将无法使用，请重新注册',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            app.login(function () {
              
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  }

  ,
})