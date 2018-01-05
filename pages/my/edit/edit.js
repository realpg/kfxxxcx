// pages/my/edit/edit.js
var vm;
const util = require('../../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actionSheetHidden: true,
    tempAvatarPath: "",
    date: "2017 - 09 - 01"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;

    vm.setData({
      user: app.globalData.userInfo,
      tempAvatarPath: app.globalData.userInfo.avatar
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
  changeAvatar: function (e) {
    console.log(e)
    vm.setData({
      actionSheetHidden: !vm.data.actionSheetHidden
    })
  },
  submit: function (e) {
    wx.showModal({
      title: '提醒',
      content: '确定更改？',
      success: function (res) {
        if (res.confirm) {
          var user_data = e.detail.value;
          // util.getQiniuToken()
          user_data.avatar = vm.data.tempAvatarPath//需要更改:应该先上传头像到服务器


          var param = e.detail.value;
          param.user_id = vm.data.user.id
          param.token = vm.data.user.token
          console.log("param:", param)
          util.updateUserById(param, function (res1) {
            console.log(res1.data)
            if (res1.data.result) {
              app.storeUserInfo(res1.data.ret)
              wx.showModal({
                title: '成功',
                content: "上传成功！",
                showCancel: false,
                success: function (res2) {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              })
            }
            else {
              wx.showModal({
                title: '失败',
                content: res1.data.message,
                showCancel: false,
                success:function(res2){
                  wx.navigateBack({
                    delta:1
                  })
                }
              })
            }
          })
        }
      }
    })

  },
  cancle: function () {
    wx.showModal({
      title: '提醒',
      content: '放弃更改并退出？',
      success: function (res) {
        if (res.confirm) {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },
  actionSheetChange: function () {
    vm.setData({
      actionSheetHidden: !vm.data.actionSheetHidden
    })
  },
  chooseImage: function () {
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        // var img = new Image();

        // // 改变图片的src
        // img.src = res.tempFilePaths;
        // var height = img.width / 750 * img.height;

        vm.setData({
          tempAvatarPath: res.tempFilePaths[0],
        })
        vm.setData({
          actionSheetHidden: !vm.data.actionSheetHidden
        })
      }
    })
  },
  takePhoto: function () {
    var _this = vm;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        // var img = new Image();

        // // 改变图片的src
        // img.src = res.tempFilePaths;
        // var height = img.width / 750 * img.height;

        _this.setData({
          tempAvatarPath: res.tempFilePaths[0],
          //photoHeight:width
        })
        vm.setData({
          actionSheetHidden: !vm.data.actionSheetHidden
        })
      }
    })
  },
  bindDateChange: function (e) {
    vm.setData({
      "user.birthday": e.detail.value
    })
    console.log(vm.data.date, typeof (vm.data.date))
  },
  bindGenderChange: function (e) {
    vm.setData({
      "user.gender": ['保密', '男性', '女性'][e.detail.value]
    })
  }
})