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
  console.log("本机蓝牙适配器状态")
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
  console.log("搜索设备")
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

    },fail:function(res){
      console.log("搜索设备失败",res);
      setTimeout(function () { zhuangtai() }, 3000);
    }
  })
}

// 获取所有已发现的设备  
function huoqu(callback) {
  console.log("获取所有已发现的设备")
  wx.getBluetoothDevices({
    success: function (res) {
      //是否有已连接设备  
      wx.getConnectedBluetoothDevices({
        success: function (res) {
          console.log(JSON.stringify(res.devices), res, "连接中的设备");
          if (res.devices.length > 0) {
            vm.setData({
              connectedDeviceId: res.devices[0].deviceId
            })

          }

        }
      })

      vm.setData({
        msg: "搜索设备" + JSON.stringify(res.devices),
        devices: res.devices,
      })
      callback();
      //监听蓝牙适配器状态  
      wx.onBluetoothAdapterStateChange(function (res) {
        vm.setData({
          sousuo: res.discovering ? "在搜索。" : "未搜索。",
          status: res.available ? "可用。" : "不可用。",
        })
      })
    }
  })
  return true;
}

//停止搜索周边设备  
function stopsousuo() {
  console.log("停止搜索周边设备 ")
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
  huoqu(function () {
    var devices = vm.data.devices;
    for (var x in devices) {
      if (devices[x].name.indexOf("TMP-Sensor") != -1) {
        vm.setData({
          shebei: devices[x]
        })
        setTimeout(function () { lianjie() }, 1000);
        return true;
      }
    }
    setTimeout(function () { jiance(); }, 3000)
  });
}

//连接设备  
function lianjie() {
  console.log("连接设备 ")
  var device = vm.data.shebei;
  console.log("连接设备中", device);
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
      setTimeout(function () { fuwu() }, 1000);
    },
    fail: function (res) {
      console.log("连接失败", res);
      error();
      setTimeout(function () { console.log("重新连接中"); lianjie(); }, 3000)
    },
    complete: function (res) {
      console.log("连接结束", res);
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
      
    }
    , complete: function (res) {
      console.log('获取服务完成:', JSON.stringify(res));
      if(res.errCode!=0 &&vm.data.services.length==0){
        error();
        fuwu();
      }
      else{
        setTimeout(function () { jiancefuwu() }, 1000);
      }
    }
  })
}

//检测服务中
function jiancefuwu() {
  var services = vm.data.services;
  console.log("检测服务中", services)
  for (var x in services) {
    if (services[x].uuid.indexOf("FFF0") != -1 || services[x].uuid.indexOf("fff0") != -1) {
      vm.setData({
        readService: services[x]
      })
      console.log("获取服务成功", services[x]);
      tezhengzhi();
      return true;
    }
  }
  setTimeout(function () { jiance(); }, 3000)
}

//获取特征值
function tezhengzhi() {
  console.log("获取特征值")
  wx.getBLEDeviceCharacteristics({
    // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
    deviceId: vm.data.connectedDeviceId,
    // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取  
    serviceId: vm.data.readService.uuid,
    success: function (res) {
      console.log("获取特征值成功")
      vm.setData({
        msg: "All" + JSON.stringify(res.characteristics),
      })


      for (var i = 0; i < res.characteristics.length; i++) {
        if (res.characteristics[i].uuid.indexOf("FFF1") != -1 || res.characteristics[i].uuid.indexOf("fff1") != -1) {

          vm.setData({
            readServicweId: vm.data.readService.uuid,
            readCharacteristicsId: res.characteristics[i].uuid,
            msg: "FFF1" + JSON.stringify(res.characteristics[i]),
          })

          if (res.characteristics[i].properties.notify) {
            enableNotify();
          }
          // readValue();
          return true;

        }

        // if (res.characteristics[i].properties.notify) {
        //   console.log("11111111", that.data.services[0].uuid);
        //   console.log("22222222222222222", res.characteristics[i].uuid);
        //   that.setData({
        //     notifyServicweId: that.data.services[0].uuid,
        //     notifyCharacteristicsId: res.characteristics[i].uuid,
        //   })
        // }
        // if (res.characteristics[i].properties.write) {
        //   that.setData({
        //     writeServicweId: that.data.services[0].uuid,
        //     writeCharacteristicsId: res.characteristics[i].uuid,
        //   })

        // } else if (res.characteristics[i].properties.read) {
        //   that.setData({
        //     readServicweId: that.data.services[0].uuid,
        //     readCharacteristicsId: res.characteristics[i].uuid,
        //   })
        //   // that.getvalue(that.data.connectedDeviceId, that.data.services[0].uuid, res.characteristics[0].uuid)
        // }
      }
      console.log('device getBLEDeviceCharacteristics:', res.characteristics);
    },
    fail: function () {
      console.log("fail");
    },
    complete: function (res) {
      console.log("complete", res);
    }
  })
}


function readValue() {
  console.log("读取特征值中");
  // setTimeout(function () {
  wx.readBLECharacteristicValue({
    // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接  [**new**]
    deviceId: vm.data.connectedDeviceId,
    // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
    serviceId: vm.data.readServicweId,
    // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
    characteristicId: vm.data.readCharacteristicsId,
    success: function (res) {
      console.log('readBLECharacteristicValue:', res)
      // vm.setData({
      //   msg: "FFF1 readBLECharacteristicValue" +JSON.stringify(res),
      // })

    },
    complete: function (res) {
      console.log("读取特征值完成", res)
      if (res.errCode == 0) {
        vm.setData({
          readValue: true
        })
      }
      if (!vm.data.readValue) {
        readValue();
      }
      else {
        onchange();
      }
    }
  })
  //   readValue();
  // }, 3000)
}

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}


function enableNotify() {
  console.log("开启notify")
  vm.setData({
    msg: "FFF1 enableNotify" + JSON.stringify(vm.data.readCharacteristicsId),
  })

  wx.notifyBLECharacteristicValueChange({
    // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接  
    deviceId: vm.data.connectedDeviceId,
    // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
    serviceId: vm.data.readServicweId,
    // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
    characteristicId: vm.data.readCharacteristicsId,
    state: true, // 启用 notify 功能
    success: function (res) {
      console.log('notifyBLECharacteristicValueChange success', res.errMsg)
      vm.setData({
        msg: "FFF1 success enableNotify" + JSON.stringify(res),
      })

    },
    fail: function (res) {
      vm.setData({
        msg: "FFF1 fail enableNotify" + JSON.stringify(res.errMsg),
      })
    },
    complete: function (res) {
      console.log("启用notify完成,返回为", res)
      if (JSON.stringify(res).search("fail") != -1) {
        setTimeout(function () {
          console.log("重新连接")
          reconnect(0);
        }, 3000)
      }
      vm.setData({
        msg: "FFF1 complete enableNotify" + JSON.stringify(res) + "[" + vm.data.connectedDeviceId + "][" + vm.data.readServicweId + "][" + vm.data.readCharacteristicsId,
      })
      onchange();
      readValue();
    }

  })
}

function onchange() {
  console.log("监听特征值变化")
  // setTimeout(function () {
  wx.onBLECharacteristicValueChange(function (res) {
    // console.log('characteristic value comed:', characteristic)
    // console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
    // console.log(ab2hext(res.value))
    // vm.setData({
    //   msg: "FFF1 readValue"+JSON.stringify(ab2hext(res.value)),
    // })

    vm.setData({
      msg: "FFF1 valueChange" + JSON.stringify(ab2hex(res.value)),
    })
    console.log("设备的特征值改变", res, JSON.stringify(ab2hex(res.value)))
    var value = JSON.stringify(ab2hex(res.value));
    var battery = string16to10(value.slice(1, 3))
    console.log("电量", battery, value.slice(1, 3))
    var wendu = []
    for (var x = 5; x < 21; x += 4) {
      var high = string16to10(value.slice(x, x + 2))
      var low = string16to10(value.slice(x + 2, x + 4))
      wendu.push({
        high: high,
        low: low
      })
      console.log("读取的温度为", high + '.' + low, value.slice(x, x + 4))
    }
    console.log("温度", wendu, value.slice(5, 21));
    vm.setData({
      read:true,
      success_time:vm.data.success_time+1
    })
    // reconnect(1);
  })
  //   onchange();
  // }, 3000)
}

function string16to10(number_code) {
  var origin_number = parseInt(number_code, 16)
  return origin_number;
}
function reconnect(success) {
  var try_time = parseFloat(vm.data.try_time) + 1;
  var success_time =parseFloat(vm.data.success_time + success);
  console.log("尝试" + try_time+"次,成功"+success_time+"次");
  vm.setData({
    try_time: parseInt(try_time),
    success_time: parseInt(success_time),
    chenggonglv: success_time / try_time
  })

if(!vm.data.read)
  closeConnection(function () { 
    wx.closeBluetoothAdapter({
      success: function (res) {
        console.log(res)
        console.log("成功关闭连接，5秒后重连")
        setTimeout(function () {
          chushihua();
        }, 5000)
      }
    })
    
    
    });
}

function closeConnection(callback) {
  console.log("关闭连接")
  wx.closeBLEConnection({
    // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接  
    deviceId: vm.data.connectedDeviceId,
    success: function (res) {
      console.log("关闭成功")
      callback();
    },
    fail: function () {
      closeConnection(callback);
    }
  })
}
function error(){
  vm.setData({
    errTime:vm.data.errTime+1
  })
  if(vm.data.errTime>20){
    vm.setData({
      errTime: 0
    })
    reconnect();
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    chenggonglv: 0,
    try_time: 0,
    success_time: 0,
    errTime:0,
    read:false //如贵能读取到值则为true
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
    closeConnection(function(){
      wx.closeBluetoothAdapter({
        success: function (res) {
          console.log(res)
        }
      })
    });
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
  },
  reconnect:function()
  {
    reconnect();
  }
})
