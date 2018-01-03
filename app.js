//app.js
import wxValidate from 'utils/wxValidate'
var vm;
const util = require('/utils/util.js')

App({
  onLaunch: function () {
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
  wxValidate: function (rules, messages) { new wxValidate(rules, messages) },
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
    user: {
      name: "",
      nickname: "这是一串昵称",
      real_name: "李狗蛋",
      birthday: "1978 - 09 - 01",
      avatar: "/images/avatar.jpg",
      phonenum: "13012345678",
    },
  }

})