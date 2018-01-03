// pages/my/kfjh/kfjh.js
var vm;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kfjh: [
      {
        startDate: "2018.1.7",
        desc: "股四头肌收缩1",
        endDate: "2018.1.31",
        unix_timestamp_s: 1515254400,
        unix_timestamp_e: 1517328000
      },
      {
        startDate: "2017.12.31",
        desc: "踝泵练习1",
        endDate: "2018.1.31",
        unix_timestamp_s: 1514649600,
        unix_timestamp_e: 1517328000
      },
      {
        startDate: "2017.12.31",
        desc: "康复计划1",
        endDate: "2018.3.31",
        unix_timestamp_s: 1514649600,
        unix_timestamp_e: 1522425600
      },
      {
        startDate: "2018.1.8",
        desc: "股四头肌收缩2",
        endDate: "2019.1.31",
        unix_timestamp_s: 1515254400,
        unix_timestamp_e: 1517328000
      },
      {
        startDate: "2018.12.3",
        desc: "踝泵练习2",
        endDate: "2019.1.31",
        unix_timestamp_s: 1514649600,
        unix_timestamp_e: 1517328000
      },
      {
        startDate: "2018.12.31",
        desc: "康复计划2",
        endDate: "2019.3.31",
        unix_timestamp_s: 1514649600,
        unix_timestamp_e: 1522425600
      },
    ],
    kfjhExist: false    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;

    //以下为将康复计划转化为时间轴
    var now = new Date();
    var timestamp = Math.round(now.getTime() / 1000);

    if(vm.data.kfjh==null||vm.data.kfjh.length==0)
      return;
    var temp = []

    var i;
    for (i in vm.data.kfjh) {
      if (temp.length == 0) {
        temp.push({
          time_stamp: vm.data.kfjh[i].unix_timestamp_s,
          passed: vm.data.kfjh[i].unix_timestamp_stimestamp,
          title: [vm.data.kfjh[i].desc + "开始"],
          time: vm.data.kfjh[i].startDate
        }, {
            time_stamp: vm.data.kfjh[i].unix_timestamp_e,
            passed: vm.data.kfjh[i].unix_timestamp_s < timestamp,
            title: [vm.data.kfjh[i].desc + "结束"],
            time: vm.data.kfjh[i].endDate
          }
        )
      }
      else {
        var flagS = false;
        var flagE = false;
        var j
        for (j in temp) {
          if (temp[j].time_stamp == vm.data.kfjh[i].unix_timestamp_s) {
            temp[j].title.push(vm.data.kfjh[i].desc + "开始");
            flagS = true;
          }
          if (temp[j].time_stamp == vm.data.kfjh[i].unix_timestamp_e) {
            temp[j].title.push(vm.data.kfjh[i].desc + "结束");
            flagE = true;
          }
        }
        if (!flagS) {
          temp.push({
            time_stamp: vm.data.kfjh[i].unix_timestamp_s,
            passed: vm.data.kfjh[i].unix_timestamp_s < timestamp,
            title: [vm.data.kfjh[i].desc + "开始"],
            time: vm.data.kfjh[i].startDate
          })
        };
        if (!flagE) {
          temp.push({
            time_stamp: vm.data.kfjh[i].unix_timestamp_e,
            passed: vm.data.kfjh[i].unix_timestamp_s < timestamp,
            title: [vm.data.kfjh[i].desc + "结束"],
            time: vm.data.kfjh[i].endDate
          })
        }

      }

    }
    temp = temp.sort((a,b)=>a-b)
    vm.setData({
      time_axis: temp,
      kfjhExist:true
    })

    console.log(vm.data.time_axis)
    console.log("当前时间戳：", timestamp,"now:",now)
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

  }
})