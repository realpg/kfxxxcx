//获取应用实例
const app = getApp()
var vm
var context

Page({

  /**
   * 页面的初始数据
   */
  data: {
    point: new Array(),
    p: [{
      x: -15,
      y: -15,
      display: "none"
    }, {
      x: -10,
      y: -10,
      display: "none"
    }, {
      x: -20,
      y: -20,
      display: "none"
    }
    ],
    angle: null,

    flag: {
      num: -1,//记录被触摸的点
      isTouched: false //记录是否触碰改变的点
    },
    picPath: '../../img/123.jpg',
    linecolor: "#ff0000",
    textcolor: "white",
    version: "",
    a: "",
    c: "",
    tempFilePaths: '',
    canvasWidth: 0,
    canvasHeight: 0,
    colorBoardWidth: 0,
    colorBoardHeight: 0,
    colors: ["black", "white", "#FF0000", "#FFA500", "#FFFF00", "#00FF00", "#0000FF"],
    colorBoardPosition: {},

    imgWidth: 0,
    imgHeight: 0,
    index: 0,
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

    var imgWidth = options.imgW;
    var imgHeight = options.imgH;
    var WdH = imgWidth / imgHeight;//宽高比
    var HdW = imgHeight / imgWidth;//高宽比

    var canW;
    var canH;

    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        // 可使用窗口宽度、高度
        console.log('height=' + res.windowHeight);
        console.log('width=' + res.windowWidth);
        // 计算主体部分高度,单位为px


        canH = res.windowHeight - 45;
        canW = res.windowWidth;

        vm.setData({
          canvasHeight: canH,
          canvasWidth: canW,

        })
      }
    })


    if (HdW * canW <= canH)//按照宽度对齐，高度要小于canvas的高度
    {
      vm.setData({
        imgWidth: canW,
        imgHeight: HdW * canW,
        colorBoardWidth: canW,
        colorBoardHeight: canH - canW * HdW,
        colorBoardPositon: { x: 0, y: HdW * canW }
      })
    }
    else {
      vm.setData({
        imgWidth: canH * WdH,
        imgHeight: canH,
        colorBoardWidth: canW - canH * WdH,
        colorBoardHeight: canH,
        colorBoardPosition: { x: canH * WdH, y: 0 }
      })
    }

    console.log(vm.data)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */


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
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
  onReady: function (e) {
    // 使用 wx.createContext 获取绘图上下文 context

    context = wx.createCanvasContext('firstCanvas')
    var x0 = 0;
    var y0 = 0;

    context.drawImage(vm.data.picPath, x0, y0, vm.data.imgWidth, vm.data.imgHeight)
    context.draw()

    console.log(context, "OnReady")
  },
  // touchStart: function (e) {
  //   if (point.length == 0)
  //     point.push(e.touches);
  //   console.log("sdf")
  // },
  tap: function (e) {
    console.log(e)
    if (vm.data.point.length < 3)
      vm.data.point.push(e.detail)
    console.log(vm.data.point, context)
    vm.drawPoints();

    if (vm.data.point.length == 3) {
      var a = vm.getAngle()
      vm.setData({
        angle: a
      })
    }
  },
  reset: function () {
    var n = vm.data.point.length;
    for (var i = 0; i < n; i++) {
      vm.data.point.pop();
    }

    var x0 = 0;
    var y0 = 0;
    context.drawImage(vm.data.picPath, x0, y0, vm.data.imgWidth, vm.data.imgHeight)
    context.draw()
    vm.setData({
      'p[0].display': "none",
      'p[1].display': "none",
      'p[2].display': "none",
      angle: null
    })
    console.log("重置成功");
  },
  movePoint0: function (e) {

    var x = e.touches[0].pageX;
    var y = e.touches[0].pageY;


  },
  moveEnd0: function (e) {
    vm.setData({
      flag: { num: 0, isTouched: true }
    })
  },
  moveEnd1: function (e) {
    vm.setData({
      flag: { num: 1, isTouched: true }
    })
  },
  moveEnd2: function (e) {
    vm.setData({
      flag: { num: 2, isTouched: true }
    })
  },
  touchEnd: function (e) {
    if (!vm.data.flag.isTouched)
      return;//如果


    var x = e.changedTouches[0].x;
    var y = e.changedTouches[0].y;

    console.log("e.detail:", e.detail);

    var point_t = [];
    point_t = vm.data.point;


    point_t[vm.data.flag.num].x = x;
    point_t[vm.data.flag.num].y = y;


    vm.setData({
      'point': point_t
    })

    console.log("page", x, y)

    vm.drawPoints()


    var a = vm.getAngle()
    vm.setData({
      angle: a
    })
    console.log("canvas", e);
    vm.data.flag = false;
  },
  chooseimage: function () {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        _this.setData({
          tempFilePaths: res.tempFilePaths
        })
      }
    })
  },
  upload: function () {
    var path = '';
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("当前时间戳为：" + timestamp);

    wx.canvasToTempFilePath({
      canvasId: "firstCanvas",
      success: function (res) {
        console.log(res.tempFilePath)
        path = res.tempFilePath;
        wx.uploadFile({
          url: '',//上传地址
          filePath: path,
          name: 'timestamp',
        })
      },
      fail: function () {
        console.log("保存图片失败")
      }
    })
  },
  saveCanvas: function () {
    var path = '';
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("当前时间戳为：" + timestamp);

    wx.getSetting({
      success(res) {
        if
 (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope:
            'scope.writePhotosAlbum',
            success() {
              console.log('授权成功')
            },
            fail(){
              console.log("授权失败")
            }
          })
        }
      }
    })

    wx.canvasToTempFilePath({
      canvasId: "firstCanvas",
      success: function (res) {
        console.log("临时地址", res.tempFilePath)
        path = res.tempFilePath;
        vm.setData({
          tempFilePaths: path
        })
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success: function (res) {
            console.log("成功 ", res)
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
      },
      fail: function () {
        console.log("保存图片失败")
      }
    })
  },
  submit: function () {
    if (vm.data.angle == null) {
      wx.showModal({
        title: '提交失败',
        content: '获取角度失败，请先获取角度',
        showCancel: false
      })
      return;
    }
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 3]//当前页面前一个的前一个页面
    var val = prevPage.data.value;
    val[vm.data.index] = vm.data.angle.toFixed(2);
    prevPage.setData({
      value: val
    })
    console.log("数据为：", prevPage.data.value, vm.data.index)
    wx.navigateBack({
      delta: 2,
    })
  },
  drawLines: function () {
    var x0 = 0;
    var y0 = 0;
    context.drawImage(vm.data.picPath, x0, y0, vm.data.imgWidth, vm.data.imgHeight)
    // context.draw()
    if (vm.data.point.length == 0) {
      return;
    }

    var a = vm.data.point;
    var p;
    for (p in a) {
      context.moveTo(a[p].x, a[p].y)
      context.beginPath();
      context.arc(a[p].x, a[p].y, 10, 0, 2 * Math.PI)
      context.setFillStyle(vm.data.linecolor);//填充颜色,默认是黑色
      context.setStrokeStyle(vm.data.linecolor);//边框颜色,默认是黑色

      context.fill();//画实心圆
      context.stroke();

      context.closePath();
    }

    context.setStrokeStyle(vm.data.color)
    context.setLineWidth(2)
    // context.rect(0, 0, 200, 200)
    // context.stroke()
    // context.setStrokeStyle("#ff0000")
    // context.setLineWidth(2)
    context.moveTo(a[0].x, a[0].y);


    if (vm.data.point.length > 1) {
      context.lineTo(vm.data.point[1].x, vm.data.point[1].y)
    }
    if (vm.data.point.length > 2) {
      context.lineTo(vm.data.point[2].x, vm.data.point[2].y)
    }



    console.log("a:", a);


    if (vm.data.point.length == 3) {
      var x1 = vm.data.point[0].x;
      var x2 = vm.data.point[1].x;
      var x3 = vm.data.point[2].x;
      var y1 = vm.data.point[0].y;
      var y2 = vm.data.point[1].y;
      var y3 = vm.data.point[2].y;

      //设3个点分别为A（x1，y1）B（x2，y2）C（x3,y3）
      //对边分别为a，b，c
      //则B是所求角

      var a2 = Math.pow(x3 - x2, 2) + Math.pow(y3 - y2, 2);
      var a = Math.sqrt(a2);
      var b2 = Math.pow(x3 - x1, 2) + Math.pow(y3 - y1, 2);
      var b = Math.sqrt(b2);
      var c2 = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
      var c = Math.sqrt(c2);

      var cosB = (c2 + a2 - b2) / (2 * a * c)


      var angle_radian = Math.acos(cosB);//弧度制
      var angle = angle_radian / Math.PI * 180;//角度制
      var angle_1 = 180 - angle;
      console.log("Yes")

      //绘制圆弧和角度数字
      var tanc = (y1 - y2) / (x1 - x2)
      var tana = (y3 - y2) / (x3 - x2)//c，a边的COS值
      var c_x = Math.atan(tanc);
      var a_x = Math.atan(tana);

      vm.setData({
        c: c_x + "  ",
        a: a_x + "  "
      })


      if (x2 > x1) {
        c_x = Math.PI + c_x;
      }
      if (x2 > x3) {
        a_x = Math.PI + a_x;
      }

      //设第一个点与第三个点的直线方程为y=kx+b，求k和b
      var k = (y1 - y3) / (x1 - x3)
      var b = y1 - k * x1;


      var flag = false;//顺时针
      if (k > 0 && y2 < (k * x2 + b)) {
        flag = true
      } if (k < 0 && y2 > (k * x2 + b)) {
        flag = true
      }

      //部分系统的arc()不太正常所以删掉了最后的flag

      context.moveTo(x2, y2)
      //context.beginPath();
      context.arc(x2, y2, 20, c_x, a_x)
      //context.lineTo(x2, y2)
      //context.closePath();


      //var f_x, f_y;//文字位置
      // var alpha=(c_x+a_x)/2;//角平分线方向
      // f_x=x2+Math.cos(alpha)*28;
      // f_y=y2+Math.sin(alpha)*28;

      context.setFontSize(18);
      angle = angle.toFixed(2)
      angle_1 = angle_1.toFixed(2)
      context.setFillStyle(vm.data.textcolor);//填充颜色,默认是黑色
      context.fillText(angle + "°  (" + angle_1 + "°)", 20, 50);

      //console.log(f_x, f_y, x2, y2, "坐标")
    }
  },
  getAngle: function () {
    var x1 = vm.data.point[0].x;
    var x2 = vm.data.point[1].x;
    var x3 = vm.data.point[2].x;
    var y1 = vm.data.point[0].y;
    var y2 = vm.data.point[1].y;
    var y3 = vm.data.point[2].y;

    //设3个点分别为A（x1，y1）B（x2，y2）C（x3,y3）
    //对边分别为a，b，c
    //则B是所求角

    var a2 = Math.pow(x3 - x2, 2) + Math.pow(y3 - y2, 2);
    var a = Math.sqrt(a2);
    var b2 = Math.pow(x3 - x1, 2) + Math.pow(y3 - y1, 2);
    var b = Math.sqrt(b2);
    var c2 = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
    var c = Math.sqrt(c2);

    var cosB = (c2 + a2 - b2) / (2 * a * c)


    var angle_radian = Math.acos(cosB);//弧度制
    var angle = angle_radian / Math.PI * 180;//角度制
    console.log("角度", angle)

    // //绘制圆弧和角度数字
    // var cosc = (x1 - x2) / c
    // var cosa = (x3 - x2) / a//c，a边的COS值
    // var c_x = Math.acos(cosc);
    // var a_x = Math.acos(cosa);

    // context.moveTo(x2, y2)
    // context.arc(x2, y2, angle_radian, c_x, a_x)
    // context.draw();
    // console.log(a_x, c_x)

    return angle;
  },
  drawPoints: function () {
    console.log("画点")

    var b = [];

    var a = vm.data.point;


    console.log("a:", a);

    if (a.length == 0) {

      return;
    }

    for (var i = 0; i < 3; i++) {
      if (i < a.length) {
        b.push({
          x: a[i].x - 16,
          y: a[i].y - 24,
          display: "inline"
        })
      }
      else {
        b.push({
          x: 0,
          y: 0,
          display: "none"
        })
      }
    }
    vm.setData({
      p: b
    })
    vm.drawLines();
    context.stroke()
    context.draw()
  },
  changeLineColor: function (e) {
    if (e.target.id != null && e.target.id.length > 4) {
      console.log("线段改变颜色", e.target.id.substr(4))
      vm.setData({
        linecolor: e.target.id.substr(4)
      })
      vm.drawPoints()
    }
  },
  changeTextColor: function (e) {
    if (e.target.id != null && e.target.id.length > 4) {
      console.log("文字改变颜色", typeof (e.target.id))
      vm.setData({
        textcolor: e.target.id.substr(4)
      })
      vm.drawPoints()

    }
  }
})