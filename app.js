//app.js
const util = require('./utils/util.js')

var vm = null

App({
  onLaunch: function () {
    //获取vm
    vm = this
    //获取用户缓存数据
    var userInfo = wx.getStorageSync("userInfo");
    console.log("local storage userInfo:" + JSON.stringify(userInfo));
    //如果没有缓存
    if (!util.judgeIsAnyNullStr(userInfo)) {
      vm.globalData.userInfo = wx.getStorageSync("userInfo");
      console.log("vm.globalData.userInfo:" + JSON.stringify(vm.globalData.userInfo));
    }
  },
  //监听小程序打开
  onShow: function () {
    //获取用户地理位置

  },
  //获取系统信息
  getSystemInfo: function (cb) {
    if (vm.globalData.systemInfo) {
      typeof cb == "function" && cb(vm.globalData.systemInfo)
    } else {
      wx.getSystemInfo({
        success: function (ret) {
          vm.globalData.systemInfo = ret
          console.log("app wx.getSystemInfo:" + JSON.stringify(ret))
          typeof cb == "function" && cb(vm.globalData.systemInfo)
        }
      })
    }
  },
  //向globalData中存储数据
  storeUserInfo: function (obj) {
    console.log("storeUserInfo :" + JSON.stringify(obj))
    wx.setStorage({
      key: "userInfo",
      data: obj
    })
    vm.globalData.userInfo = obj
  },
  globalData: {
    userInfo: null,
    systemInfo: null
  }
})