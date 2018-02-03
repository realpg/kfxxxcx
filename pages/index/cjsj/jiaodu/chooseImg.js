var vm
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths: '',
    isPhotoToken: false,
    actionSheetHidden: true,
    imgW: 0,
    imgH: 0,
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;
    vm.setData({
      index: options.index,
      side: options.side
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
  chooseImage: function () {
    var _this = vm;
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

        _this.setData({
          tempFilePaths: res.tempFilePaths,
          isPhotoToken: true,
          //photoHeight:width
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
          tempFilePaths: res.tempFilePaths,
          isPhotoToken: true,
          //photoHeight:width
        })
        vm.setData({
          actionSheetHidden: !vm.data.actionSheetHidden
        })
      }
    })
  },
  submit: function () {
    wx.navigateTo({
      url: 'getangle?src=' + vm.data.tempFilePaths + '&imgW=' + vm.data.imgW + '&imgH=' + vm.data.imgH + '&index=' + vm.data.index + '&side=' + vm.data.side,
    })
  },
  actionSheetTap: function (e) {
    vm.setData({
      actionSheetHidden: !vm.data.actionSheetHidden
    })
    console.log(e)
  },
  imageLoad: function (e) {
    console.log(e.detail)
    vm.setData({
      imgW: e.detail.width,
      imgH: e.detail.height
    })
  },
  actionSheetChange: function () {
    vm.setData({
      actionSheetHidden: !vm.data.actionSheetHidden
    })
  }
})