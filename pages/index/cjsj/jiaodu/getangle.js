// pages/index/cjsj/getAngle/getangle.js
//获取应用实例
const app = getApp()
var vm
var context
const util = require('../../../../utils/util.js')
const qiniuUploader = require("../../../../utils/qiniuUploader");
var token = ""

var qnToken = ""
// 初始化七牛相关参数
function initQiniu() {
  var options = {
    region: 'ECN', // 华东区
    uptoken: qnToken
  };
  console.log("initQiniu options:" + JSON.stringify(options))
  qiniuUploader.init(options);
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    left: [],
    top: [],
    btn_path: "../../../../icons/m-btn.png",
    lineColor: '#FF0000',
    textColor: 'black',
    colors: ["black", "white", "#FF0000", "#FFA500", "#FFFF00", "#00FF00", "#0000FF"],
    show: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;
    this.setData({
      picPath: options.src,
      version: wx.getSystemInfoSync().SDKVersion,
      index: options.index,
      side: options.side
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
  onReady: function () {
    // 使用 wx.createContext 获取绘图上下文 context

    context = wx.createCanvasContext('firstCanvas', vm)
    var x0 = (vm.data.canvasWidth - vm.data.imgWidth) / 2;
    var y0 = (vm.data.canvasHeight - vm.data.imgHeight) / 2;

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
    var l = vm.data.left;
    var t = vm.data.top;
    l[e.target.id] = e.touches[0].clientX - 10;
    t[e.target.id] = e.touches[0].clientY - 10;
    console.log('l', l, 't', t);

    if (l[e.target.id] < -10 || t[e.target.id] < -10 || l[e.target.id] > vm.data.canvasWidth - 10 || t[e.target.id] > vm.data.canvasHeight - 10)
      return;

    vm.setData({
      left: l,
      top: t
    })
    vm.draw();
  },
  //点击画布，添加一个点
  tap: function (e) {
    console.log('tap', e)
    if (vm.data.left.length < 3 && vm.data.top.length < 3) {
      var l = vm.data.left;
      var t = vm.data.top;
      l.push(e.detail.x);
      t.push(e.detail.y);
      vm.setData({
        left: l,
        top: t
      })
      vm.draw();
    }



    // console.log(vm.data.point, context)

    // if (vm.data.point.length == 3) {
    //   var a = vm.getAngle()
    //   vm.setData({
    //     angle: a
    //   })
    // }
  },
  draw: function () {

    //绘制图片
    var x0 = (vm.data.canvasWidth - vm.data.imgWidth) / 2;
    var y0 = (vm.data.canvasHeight - vm.data.imgHeight) / 2;
    context.drawImage(vm.data.picPath, x0, y0, vm.data.imgWidth, vm.data.imgHeight)

    //如果没有两个点则返回
    var length = Math.min(vm.data.left.length, vm.data.top.length);
    if (length >= 1) {
      context.drawImage(vm.data.btn_path, vm.data.left[0], vm.data.top[0], 20, 20);
      console.log("第一个点获取!", length)
    }

    if (length < 2) {
      context.draw();
      return;
    }


    context.setStrokeStyle(vm.data.lineColor)
    context.setLineWidth(2)



    //绘制直线
    for (var i = 1; i < length; i++) {
      if (i == 1) {
        context.moveTo(vm.data.left[0] + 10, vm.data.top[0] + 10);
      }


      context.lineTo(vm.data.left[i] + 10, vm.data.top[i] + 10)
      context.drawImage(vm.data.btn_path, vm.data.left[i], vm.data.top[i], 20, 20)
      console.log("from:", vm.data.left[i - 1] + 10, vm.data.top[i - 1] + 10, "to", vm.data.left[i] + 10, vm.data.top[i] + 10)
      context.stroke()
    }

    //如果有三个点就计算角度，并显示
    if (length == 3) {
      var x1 = vm.data.left[0] + 10;
      var x2 = vm.data.left[1] + 10;
      var x3 = vm.data.left[2] + 10;
      var y1 = vm.data.top[0] + 10;
      var y2 = vm.data.top[1] + 10;
      var y3 = vm.data.top[2] + 10;

      //设3个点分别为A（x1，y1）B（x2，y2）C（x3,y3）
      //对边分别为a，b，c
      //则B是所求角

      var a2 = Math.pow(x3 - x2, 2) + Math.pow(y3 - y2, 2);
      var a = Math.sqrt(a2);
      var b2 = Math.pow(x3 - x1, 2) + Math.pow(y3 - y1, 2);
      var b = Math.sqrt(b2);
      var c2 = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
      var c = Math.sqrt(c2);
      console.log("边长", a, b, c)

      var cosB = (c2 + a2 - b2) / (2 * a * c)

      //计算弧度
      var angle_radian = Math.acos(cosB);//弧度制
      var angle = angle_radian / Math.PI * 180;//角度制
      vm.setData({
        angle: angle
      })
      var angle_1 = 180 - angle;

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

      console.log('夹角', c_x, a_x, c_x - a_x)
      //设第一个点与第三个点的直线方程为y=kx+b，求k和b
      var f = c_x - a_x;
      while (f < 0) {
        f += 2 * Math.PI;
      }

      var flag = (f < Math.PI);//顺时针
      // if (k > 0 && y2 < (k * x2 + b)) {
      //   flag = true
      // } if (k < 0 && y2 > (k * x2 + b)) {
      //   flag = true
      // }

      context.moveTo(x2, y2)
      //context.beginPath();
      context.arc(x2, y2, 30, c_x, a_x, flag)
      context.stroke();
      //context.lineTo(x2, y2)
      //context.closePath();


      //var f_x, f_y;//文字位置
      // var alpha=(c_x+a_x)/2;//角平分线方向
      // f_x=x2+Math.cos(alpha)*28;
      // f_y=y2+Math.sin(alpha)*28;

      context.setFontSize(18);
      angle = angle.toFixed(2)
      angle_1 = angle_1.toFixed(2)
      context.setFillStyle(vm.data.textColor);//填充颜色,默认是黑色
      context.fillText(angle + "°  (" + angle_1 + "°)", 20, 50);

      //console.log(f_x, f_y, x2, y2, "坐标")
    }
    context.draw()
    console.log("context", context)

  },
  reset: function () {
    vm.setData({
      left: [],
      top: [],
      angle: null
    })
    vm.draw()
    console.log("重置成功");
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
            fail() {
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
          tempFilePath: path
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
    var val = prevPage.data.sj;
    console.log(val, vm.data.index, vm.data.side);
    val[vm.data.index].value[vm.data.side] = (vm.data.angle.toFixed(2));
    val[vm.data.index].attach = vm.data.files;
    prevPage.setData({
      sj: val
    })
    console.log("数据为：", prevPage.data.sj, vm.data.index)
    wx.navigateBack({
      delta: 2,
    })
  },
  edit: function () {
    vm.setData({
      show: true
    })
  },
  changecolor: function (e) {
    console.log(e)
    var index0 = e.detail.value[0];
    var index1 = e.detail.value[1];
    vm.setData({
      lineColor: vm.data.colors[index0],
      textColor: vm.data.colors[index1],
      show: false
    })
    vm.draw();
  },
  upload: function () {
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
            fail() {
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
          tempFilePath: path
        })
        {
          var param = {}
          //获取七牛上传token
          util.getQiniuToken(param, function (res) {
            console.log(JSON.stringify(res));
            if (res.data.result) {
              qnToken = res.data.ret;
              console.log("qiniu upload token:" + qnToken)
              initQiniu();
              //获取token成功后上传图片
              qiniuUploader.upload(vm.data.tempFilePath, (res) => {
                console.log("qiniuUploader upload res:" + JSON.stringify(res));
                var picture = util.getImgRealUrl(res.key)
                vm.setData({
                  files: picture
                })
                console.log("上传成功：" + JSON.stringify(vm.data.files))
                wx.showToast({
                  title: '上传成功',
                })
              }, (error) => {
                console.error('error: ' + JSON.stringify(error));
              })
            }
          })
        }
      },
      fail: function () {
        console.log("保存图片失败")
      }
    })


  }

})