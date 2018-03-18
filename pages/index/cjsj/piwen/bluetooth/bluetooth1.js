// pages/index/cjsj/piwen/bluetooth/bluetooth.js
var vm;
const app = getApp();

// 初始化蓝牙适配器  

// 初始化蓝牙适配器  
function chushihua() {
  wx.openBluetoothAdapter({
    success: function (res) {
      vm.setData({
        msg: "初始化蓝牙适配器成功！" + JSON.stringify(res),
      })
      //监听蓝牙适配器状态  
      wx.onBluetoothAdapterStateChange(function (res) {
        vm.setData({
          sousuo: res.discovering,//? "在搜索。" : "未搜索。"
          status: res.available// ? "可用。" : "不可用。"
        })
      })
      setTimeout(function () { zhuangtai() }, 3000)
    }
  })
}

//// 本机蓝牙适配器状态  
function zhuangtai() {
  wx.getBluetoothAdapterState({
    success: function (res) {
      vm.setData({
        msg: "本机蓝牙适配器状态" + "/" + JSON.stringify(res.errMsg),
        sousuo: res.discovering,//? "在搜索。" : "未搜索。",
        status: res.available,//? "可用。" : "不可用。",
      })
      //监听蓝牙适配器状态  
      wx.onBluetoothAdapterStateChange(function (res) {
        vm.setData({
          sousuo: res.discovering,// ? "在搜索。" : "未搜索。",
          status: res.available,// ? "可用。" : "不可用。",
        })
      })
      setTimeout(function () { sousuo() }, 3000)
    }
  })
}

//搜索设备  
function sousuo() {
  wx.startBluetoothDevicesDiscovery({
    success: function (res) {
      vm.setData({
        msg: "搜索设备" + JSON.stringify(res),
      })
      //监听蓝牙适配器状态  
      wx.onBluetoothAdapterStateChange(function (res) {
        vm.setData({
          sousuo: res.discovering ? "在搜索。" : "未搜索。",
          status: res.available ? "可用。" : "不可用。",
        })
      })
      setTimeout(function () { jiance() }, 3000);

    }
  })
}

// 获取所有已发现的设备  
function huoqu() {
  console.log("")
  wx.getBluetoothDevices({
    success: function (res) {
      //是否有已连接设备  
      wx.getConnectedBluetoothDevices({
        success: function (res) {
          console.log(JSON.stringify(res.devices), res, "连接中的设备");
          if (res.devices.length > 0)
            vm.setData({
              connectedDeviceId: res.devices[0].deviceId
            })
        }
      })

      vm.setData({
        msg: "搜索设备" + JSON.stringify(res.devices),
        devices: res.devices,
      })
      //监听蓝牙适配器状态  
      wx.onBluetoothAdapterStateChange(function (res) {
        vm.setData({
          sousuo: res.discovering ? "在搜索。" : "未搜索。",
          status: res.available ? "可用。" : "不可用。",
        })
      })
    }
  })
}

//停止搜索周边设备  
function stopsousuo() {
  console.log("检测中")
  wx.stopBluetoothDevicesDiscovery({
    success: function (res) {
      vm.setData({
        msg: "停止搜索周边设备" + "/" + JSON.stringify(res.errMsg),
        sousuo: res.discovering ? "在搜索。" : "未搜索。",
        status: res.available ? "可用。" : "不可用。",
      })
    }
  })
}
//检测是否有设备
function jiance() {
  console.log("检测中")
  huoqu();
  var devices = vm.data.devices;
  for (var x in devices) {
    if (devices[x].name.indexOf("TMP-Sensor") != -1) {
      vm.setData({
        shebei: devices[x]
      })
      lianjie();
      return true;
    }
  }
  setTimeout(function () { jiance(); }, 3000)
}

//连接设备  
function lianjie() {
  var device = vm.data.shebei;
  console.log("连接设备中",device);
  wx.createBLEConnection({
    deviceId: device.deviceId,
    success: function (res) {
      console.log("连接成功", res.errMsg);
      vm.setData({
        connectedDeviceId: device.deviceId,
        msg: "已连接" + device.deviceId,
        msg1: "",
      })
      stopsousuo();
      fuwu();
    },
    fail: function () {
      console.log("连接失败");
    },
    complete: function () {
      console.log("连接结束");
    }

  })
  console.log(vm.data.connectedDeviceId);
}

// 获取连接设备的service服务  
function fuwu() {
  console.log("获取服务中");
  wx.getBLEDeviceServices({
    // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
    deviceId: vm.data.connectedDeviceId,
    success: function (res) {
      console.log('device services:', JSON.stringify(res.services));
      vm.setData({
        services: res.services,
        msg: JSON.stringify(res.services),
      })
      jiancefuwu();
    }
  })
}

//检测服务中
function jiancefuwu() {
  var services = vm.data.services;
  console.log("检测服务中",services)
  for (var x in services) {
    if (services[x].uuid.indexOf("FFF0") != -1 || services[x].uuid.indexOf("fff0") != -1) {
      vm.setData({
        fuwu: services[x]
      })
      console.log("获取服务成功", services[x]);
      return true;
    }
  }
  setTimeout(function () { jiance(); }, 3000)
}

//获取特征值
function tezhengzhi(){
  wx.getBLEDeviceCharacteristics({
    // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
    deviceId: that.data.connectedDeviceId,
    // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取  
    serviceId: that.data.services[0].uuid,
    success: function (res) {
      for (var i = 0; i < res.characteristics.length; i++) {
        if (res.characteristics[i].properties.notify) {
          console.log("11111111", that.data.services[0].uuid);
          console.log("22222222222222222", res.characteristics[i].uuid);
          that.setData({
            notifyServicweId: that.data.services[0].uuid,
            notifyCharacteristicsId: res.characteristics[i].uuid,
          })
        }
        if (res.characteristics[i].properties.write) {
          that.setData({
            writeServicweId: that.data.services[0].uuid,
            writeCharacteristicsId: res.characteristics[i].uuid,
          })

        } else if (res.characteristics[i].properties.read) {
          that.setData({
            readServicweId: that.data.services[0].uuid,
            readCharacteristicsId: res.characteristics[i].uuid,
          })
          that.getvalue(that.data.connectedDeviceId, that.data.services[0].uuid, res.characteristics[0].uuid)
        }
      }
      console.log('device getBLEDeviceCharacteristics:', res.characteristics);


      that.setData({
        msg: JSON.stringify(res.characteristics),
      })
    },
    fail: function () {
      console.log("fail");
    },
    complete: function () {
      console.log("complete");
    }
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;
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
  start() {
    chushihua();
  }
})