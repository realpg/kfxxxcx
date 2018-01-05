//app.js
import wxValidate from 'utils/wxValidate'
var vm;
const util = require('/utils/util.js')

App({
  onLaunch: function () {
    vm = this
    //获取用户缓存数据
    
  },
  //登录处理
  login: function (callBack) {
    //通过login获取code，再通过code获取用户openid
    wx.login({
      success: function (res) {
        console.log("wx.login:" + JSON.stringify(res))
        if (res.code) {
          util.getOpenId({ code: res.code }, function (ret) {
            console.log("getOpenId:" + JSON.stringify(ret))
            if (ret.data.result) {
              var openId = ret.data.ret.openid;
              var param = {
                xcx_openid: openId,
                account_type: "xcx"
              }
              vm.loginServer(param, callBack);
            }
          }, null)
        }
      }
    })
  },
  //远程调用登录接口
  loginServer: function (param, callBack) {
    console.log("loginServer param:" + JSON.stringify(param))
    util.login(param, function (ret) {
      console.log("login:" + JSON.stringify(ret))
      //如果登录成功，跳转到首页
      if (ret.data.result) {
        vm.globalData.user=ret.data.ret;
        vm.storeUserInfo(ret.data.ret)
        console.log("登录成功", vm.globalData.user)
        callBack();
      } else {
        //登录失败，则引导到进行注册的页面
        console.log("登录失败", param)
        util.navigateToRegister(param);   //将openid带过去
      }

    }, null)
  },

  wxValidate: function (rules, messages) { new wxValidate(rules, messages) },
  //向globalData中存储数据
  storeUserInfo: function (obj) {
    if (util.judgeIsAnyNullStr(obj.token))
    obj.token = vm.globalData.userInfo.token;
    console.log("storeUserInfo :" + JSON.stringify(obj))
    wx.setStorage({
      key: "userInfo",
      data: obj
    })
    vm.globalData.userInfo = obj
  },
  globalData: {
    userInfo: null,
  }

})