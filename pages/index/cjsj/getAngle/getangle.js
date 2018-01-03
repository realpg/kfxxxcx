// pages/index/cjsj/getAngle/getangle.js
//获取应用实例
const app = getApp()
var vm
var context

Page({

  /**
   * 页面的初始数据
   */
  data: {
    left: [],
    top: [],
    btn_path:"/icons/m-btn.png",
    color:'red'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;
    this.setData({
      picPath: options.src,
      version: wx.getSystemInfoSync().SDKVersion,
      index: options.index
    })
    //var imageUtil = require(options.src);  
    //console.log(imageUtil)

    var canW;
    var canH;

    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        // 可使用窗口宽度、高度
        console.log('height=' + res.windowHeight);
        console.log('width=' + res.windowWidth);
        // 计算主体部分高度,单位为px


        canH = res.windowHeight;
        canW = res.windowWidth;

        vm.setData({
          canvasHeight: canH,
          canvasWidth: canW,

        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 使用 wx.createContext 获取绘图上下文 context

    context = wx.createCanvasContext('firstCanvas',vm)
    var x0 = 0;
    var y0 = 0;

    context.drawImage(vm.data.picPath, x0, y0, vm.data.imgWidth, vm.data.imgHeight)
    context.draw()

    console.log(context, "OnReady")
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
  //移动点
  viewTouchMove: function (e) {
    
    var l=vm.data.left;
    var t=vm.data.top;
    l[e.target.id] = e.touches[0].clientX - 20;
    t[e.target.id] = e.touches[0].clientY - 20;
    console.log(l,t);
    this.setData({
      left: l,
      top: t
    })
    vm.draw();
  },
  //点击画布，添加一个点
  tap: function (e) {
    console.log(e)
    if (vm.data.left.length < 3){
      var l=vm.data.left;
      var t=vm.data.top;
      l.push(e.detail.x);
      t.push(e.detail.y);
      vm.setData({
        left:l,
        top:t
      })
    }

    vm.draw();

    // console.log(vm.data.point, context)

    // if (vm.data.point.length == 3) {
    //   var a = vm.getAngle()
    //   vm.setData({
    //     angle: a
    //   })
    // }
  },
  draw:function(){
    
    //绘制图片
    var x0 = 0;
    var y0 = 0;
    context.drawImage(vm.data.picPath, x0, y0, vm.data.imgWidth, vm.data.imgHeight)

    //如果没有两个点则返回
    var length=Math.min(vm.data.left.length,vm.data.top.length);
    
    if(length<2)
    return;

    context.draw()
    context.setStrokeStyle(vm.data.color)
    context.setLineWidth(2)

    //绘制直线
    for(var i=1;i<length;i++){  
      if(i ==1)
      context.moveTo(vm.data.left[i - 1] + 20, vm.data.top[i - 1] + 20);
      context.lineTo(vm.data.left[i] + 20, vm.data.top[i] + 20)
      console.log("from:", vm.data.left[i - 1] + 20, vm.data.top[i - 1] + 20, "to", vm.data.left[i] + 20, vm.data.top[i] + 20)
      context.stroke()
    }

    //如果有三个点就计算角度，并显示
    if (length == 3){

    }
    context.draw()
    console.log("context", context)

  }
})