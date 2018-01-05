// pages/my/kfjh/kfjh.js
var vm;
const util = require('../../../utils/util.js')
const app = getApp()

function formatTime(time) {
  let unixtime = time
  let unixTimestamp = new Date(unixtime * 1000)
  let Y = unixTimestamp.getFullYear()
  let M = ((unixTimestamp.getMonth() + 1) > 10 ? (unixTimestamp.getMonth() + 1) : '0' + (unixTimestamp.getMonth() + 1))
  let D = (unixTimestamp.getDate() > 10 ? unixTimestamp.getDate() : '0' + unixTimestamp.getDate())
  let toDay = Y + '-' + M + '-' + D
  return toDay
}

function compare(property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    kfjh: [],
    kfjhExist: false    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;
    var user=app.globalData.userInfo

    //以下为将康复计划转化为时间轴
    var now = new Date();
    var timestamp = Math.round(now.getTime() / 1000);

    var temp = []
    util.getUserInfo(user, function (res1) {
      console.log('res1', res1)
      if (res1.data.result) {
        console.log("user_res:", res1)


        var user = res1.data.ret;
        user.gender = user.gender == '2' ? "女性" : (user.gender == '1' ? "男性" : "保密");
        user.birthday = user.birthday.substr(0, 10);
        app.storeUserInfo(user);



        // 在这里获取数据，包括：康复计划，首页轮播图，宣教信息
        var uid = app.globalData.userInfo.id;
        util.getKFJHByUserId({ id: uid }, function (res) {
          var kfjh = [];
          for (var x in res.data.ret) {
            var start = formatTime(res.data.ret[x].start_time)
            var end = formatTime(res.data.ret[x].end_time)
            kfjh.push({
              name: res.data.ret[x].name,
              startDate: start,
              endDate: end,
              unix_timestamp_s: res.data.ret[x].start_time,
              unix_timestamp_e: res.data.ret[x].end_time,
            })
          }
          vm.setData({
            'kfjh': kfjh,
            kfjhExist:true
          })
          console.log("康复计划",kfjh)
          //以下为将康复计划转化为时间轴


          var temp = []

          var i;
          for (i in vm.data.kfjh) {
            if (temp.length == 0) {
              temp.push({
                time_stamp: vm.data.kfjh[i].unix_timestamp_s,
                title: [vm.data.kfjh[i].name + "开始"],
                time: vm.data.kfjh[i].startDate
              }, {
                  time_stamp: vm.data.kfjh[i].unix_timestamp_e,
                  title: [vm.data.kfjh[i].name + "结束"],
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
                  temp[j].title.push(vm.data.kfjh[i].name + "开始");
                  flagS = true;
                }
                if (temp[j].time_stamp == vm.data.kfjh[i].unix_timestamp_e) {
                  temp[j].title.push(vm.data.kfjh[i].name + "结束");
                  flagE = true;
                }
              }
              if (!flagS) {
                temp.push({
                  time_stamp: vm.data.kfjh[i].unix_timestamp_s,
                  title: [vm.data.kfjh[i].name + "开始"],
                  time: vm.data.kfjh[i].startDate
                })
              };
              if (!flagE) {
                temp.push({
                  time_stamp: vm.data.kfjh[i].unix_timestamp_e,
                  title: [vm.data.kfjh[i].name + "结束"],
                  time: vm.data.kfjh[i].endDate
                })
              }
            }
          }
          temp = temp.sort(compare('time_stamp'))
          //只留下部分计划（3个）
          temp = temp.slice(0, 3);


          vm.setData({
            time_axis: temp
          })

          //以下为生成今日任务
          // var task_t=[];
          // if
          // {
          //   type: "kfjh",
          //     name: "踝泵练习",
          //       name: "踝关节缓慢、有力、全范围的屈伸活动，每日500次以上。",
          //         xj_ids: ["0001", "0004"],
          //           status: '0',
          //             info_id: "0001"
          // }
        }, null)

      }
      else {
        //游客模式
      }


    }, null)

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