// pages/cjsj/piteng/piteng.js
var vm;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: 0,
    img: "../../../../images/6.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;
    console.log("weidu onload", options.index, options.side)
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
  changeValue: function (e) {

    var val = Math.round(e.detail.value * 10) / 10;
    val = val.toFixed(1);
    console.log(e.detail, val)
    if (val >=0&&val<2) {
      vm.setData({
        img: "../../../../images/6.png"
      })
    }
    else if (val < 4) {
      vm.setData({
        img: "../../../../images/5.png"
      })
    }
    else if (val < 6) {
      vm.setData({
        img: "../../../../images/4.png"
      })
    }
    else if (val < 8) {
      vm.setData({
        img: "../../../../images/3.png"
      })
    }
    else if (val < 10) {
      vm.setData({
        img: "../../../../images/2.png"
      })
    }
    else {
      vm.setData({
        img: "../../../../images/1.png"
      })
    }

    vm.setData({
      value: val
    })
  },
  submit: function () {
    if (vm.data.value == 0) {
      wx.showModal({
        title: '提交失败',
        content: '获取角度失败，请先获取角度',
        showCancel: false
      })
      return;
    }
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]//当前页面前一个的前一个页面
    var val = prevPage.data.sj;
    console.log(val, vm.data.index, vm.data.side);
    val[vm.data.index].value[vm.data.side] = (vm.data.value);
    prevPage.setData({
      sj: val
    })
    console.log("数据为：", prevPage.data.sj, vm.data.index)
    wx.navigateBack({
      delta: 1,
    })
  },
})