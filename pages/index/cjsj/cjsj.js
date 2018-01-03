var vm

Page({

  /**
   * 页面的初始数据
   */
  data: {
    kfmb_jhsj: [{
      name: "皮疼",
      id: "xxxxx",
      mode: "slider",
      options: ['O度 不痛', 'Ⅰ度 轻度痛', 'II度 中度痛', 'III度 重度痛', 'Ⅳ度 严重痛'],
    }, {
      name: "皮温",
      id: "xxxx",
      mode: "input",
    },
    {
      name: "角度",
      id: 'xxxx',
      mode: "measure",
    },
    {
      name: "围度",
      id: 'xxxx',
      mode: "measure",
    }],
    value: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;

    var i;
    var a = [];
    for (i in vm.data.kfmb_jhsj) {
      a.push(0)
    }
    vm.setData({
      value: a
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
  GetAngle: function (e) {
    var i = parseInt(e.target.id);//接收index值
    wx.navigateTo({
      url: 'chooseImg?index='+i,
    })
  },
  setSlider: function (e) {
    var i = parseInt(e.target.id);//接收index值
    var tArray = vm.data.value;
    tArray[i] = e.detail.value+1

    vm.setData({
      value: tArray
    })

    console.log(vm.data.value)
  },
  submit:function(){
    var i;
    for (i in vm.data.value)
    {
      if (vm.data.value[i] == 0 || isNaN(vm.data.value[i])){
        wx.showModal({
          title: '提交失败',
          content: '请将数据全部填写完毕',
          showCancel: false
        });
        return;
      }
    }
    var timestamp = Math.round(new Date().getTime() / 1000);
    console.log("数据提交完成:", vm.data.value,"当前时间戳为",timestamp)
    wx.navigateBack({
      delta: 1
    })
  },
  bindinput:function(e){
    var val=vm.data.value;
    var i=parseInt(e.target.id);
    val[i] =parseInt(e.detail.value);
    vm.setData({
      value:val
    })
    console.log(val)
  }
})