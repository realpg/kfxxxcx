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
          if (questions[i].type == 1 || questions[i].type == 0) {
            var ansAndPoint = questions[i].answer.split("@q=");
            questions[i].option = [];
            questions[i].point = [];
            questions[i].answer = "";
            for (var j = 1; j < ansAndPoint.length; j++) {
              questions[i].option.push(ansAndPoint[j].split("&p=")[0]);
              questions[i].point.push(ansAndPoint[j].split("&p=")[1]);
            }
          } else if (questions[i].type == 2) {
            //填空题
            questions[i].questions = questions[i].question.split("()");
            questions[i].answers = [];
            for (var x = 0; x < questions[i].questions.length - 1; x++)
              questions[i].answers.push({
                value: "",
                width: "100rpx"
              })
            console.log("answers:", questions[i].question, questions[i].answers)
          } else if (questions[i].type == 3) {
            var question = questions[i].answer.split("@q=")[1].split("&opt=")[0];
            var option = questions[i].answer.split("&opt=")[1].split("&p=")[0];
            var point = questions[i].answer.split("&p=")[1];
            console.log("type:3", 'q=', question, 'opt=', option, 'p=', point);
            questions[i].questions = [];
            for (var j in question.split(',')) {
              questions[i].questions.push(question.split(',')[j]);
            }
            questions[i].questions.pop();

            questions[i].options = [];
            for (var k in option.split(',')) {
              questions[i].options.push(option.split(',')[k]);
            }
            questions[i].options.pop();

            questions[i].points = [];
            questions[i].results = [];
            for (var j in point.split(';')) {
              var p = [];
              var q = [];
              for (var k in point.split(';')[j].split(',')) {
                p.push(point.split(';')[j].split(',')[k]);
              }
              p.pop()
              for (var l in p) {
                q.push(false)
              }
              questions[i].results.push(q);
              questions[i].points.push(p);
            }
            questions[i].points.pop();
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
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    wx.showLoading({
      title: '上传中',
    })
    var result = "";
    var questions = vm.data.questions;
    for (var i in questions) {
      console.log(e.detail.value[i])
      var answer = questions[i].type == 2 ? questions[i].answer+"" : questions[i].answer

        result +='@a=' + answer
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



  },
  biaoge: function (e) {
    var index = e.target.id.split("-")[0];
    var i = e.target.id.split("-")[1];
    var j = e.target.id.split("-")[2];
    var questions = vm.data.questions;
    console.log(questions)

    for (var k in questions[index].results[i]) {
      questions[index].results[i][k] = (k == j)
    }
    questions[index].answer = "";
    for (var m in questions[index].results) {
      for (var n in questions[index].results[m]) {
        if (questions[index].results[m][n])
          questions[index].answer += n + ","
      }
    }

    vm.setData({
      questions: questions
    })
  },
  tiankong: function (e) {
    console.log(e);
    var index = e.target.id.split("-")[0];
    var i = e.target.id.split("-")[1];
    var questions = vm.data.questions;

    questions[index].answers[i].value = e.detail.value;
    var width = e.detail.value.length * 34;
    questions[index].answers[i].width = (width > 100 ? width : 100) + "rpx";

    questions[index].answer ="";
    for (var x in questions[index].answers){
      questions[index].answer += "&bk="+questions[index].answers[x].value;
    }
      
    vm.setData({
      questions: questions
    })
  },
  xuanze: function (e) {
    var index = e.target.id;
    var questions = vm.data.questions;
    questions[index].answer = "" + e.detail.value
    console.log(questions[index])
    vm.setData({
      questions: questions
    })
  }
})