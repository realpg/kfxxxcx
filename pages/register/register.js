// pages/register/register.js
const util = require('../../utils/util.js')

var xcx_openid;
var userInfo;

//获取应用实例
var app = getApp()

var vm = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    real_name: "",
    phonenum: "",
    vertify_code: "",
    birthday: "",
    cd_time: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;
    console.log("onLoad options:" + JSON.stringify(options));
    var obj = JSON.parse(options.jsonStr);
    //获取页面传入的参数 带xcx_openid
    xcx_openid = obj.xcx_openid;
    console.log("xcx_openid:" + xcx_openid);
    //设置生日
    this.setData({
      birthday: util.getToday()
    });
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
    wx.setNavigationBarTitle({
      title: "绑定手机号"
    })
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
  //点击注册
  clickRegister: function (e) {
    var that = this;
    
    var param = {
      account_type: "xcx",
      xcx_openid: xcx_openid,
      phonenum: that.data.phonenum,
      vertify_code: that.data.vertify_code,
      real_name: that.data.real_name,
      birthday: that.data.birthday
    }
    

    util.register(param, function (ret) {
      console.log('注册ret', ret, ret.data.result)
      if (ret.data.result) {
        util.showToast("注册成功",ret.data);
        console.log(ret.data)
        app.storeUserInfo(ret.data.ret);
        app.globalData.user = ret.data.ret;
        wx.showModal({
          title: '成功',
          content: '注册成功，请完善用户信息',
          showCancel: false,
          success: function (resm) {
            if (resm.confirm) {
              var param1 = param;
              console.log('用户点击确定',param1)
              
              //测试获取微信信息
              wx.getUserInfo({
                success: function (res) {
                  var userInfo = res.userInfo
                  console.log(userInfo)
                  param1.nick_name = userInfo.nickName
                  param1.avatar= userInfo.avatarUrl
                  param1.gender = userInfo.gender //性别 0：未知、1：男、2：女
                  param1.province = userInfo.province
                  param1.city = userInfo.city
                  param1.country = userInfo.country
                  util.updateUserById(param1, function (res1) {
                    console.log("微信资料同步", res1.data)
                    if (res1.data.result) {
                      app.storeUserInfo(res1.data.ret)
                      wx.showModal({
                        title: '成功',
                        content: "更新资料成功！",
                        showCancel: false,
                        success: function (res2) {
                          //更新成功
                        }
                      })
                    }
                    else {
                      //根据微信更新用户资料
                    }
                  })
                }
              })
              
              
              wx.navigateBack({
                delta: 1
              })
              
            }
          }
        })
      } else {
        wx.showModal({
          title: '失败',
          content: '验证码错误',
          showCancel: false
        })
      }
    })
  },
  //选择生日
  birthdayChange: function (e) {
    console.log("birthdayChange e:" + JSON.stringify(e));
    this.setData({
      birthday: e.detail.value
    })
  },
  //点击发送验证码
  clickSendSMS: function (e) {
    console.log("clickSendSMS e:" + JSON.stringify(e));
    var that = this;
    if (that.data.phonenum.length < 11) {
      console.log("手机号位数不足")
      return;
    }
    var param = {
      phonenum: that.data.phonenum
    }
    console.log("param:" + JSON.stringify(param));
    util.sendVertifyCode(param, function (ret) {
      if (ret.data.result == true) {
        util.showToast("发送成功");
        vm.setData({
          cd_time: 100
        })
        vm.timeout();
      }
    })
  },
  timeout() {

    setTimeout(function () {
      vm.setData({
        cd_time: vm.data.cd_time - 1
      })
      if (vm.data.cd_time == 0)
        return;
      else
        vm.timeout();
    }, 1000)
  },
  //输入姓名
  realNameInput: function (e) {
    var that = this;
    console.log("realNameInput:" + JSON.stringify(e));
    that.setData({
      real_name: e.detail.value
    })
  },
  //输入手机号
  phonenumInput: function (e) {
    var that = this;
    console.log("phonenumInput:" + JSON.stringify(e));
    that.setData({
      phonenum: e.detail.value
    })
  },
  //输入验证码
  vertifyCodeInput: function (e) {
    var that = this;
    console.log("phonenumInput:" + JSON.stringify(e));
    that.setData({
      vertify_code: e.detail.value
    })
  }
})