var vm;
const util = require('../../utils/util.js')
const app = getApp()
var textData=true

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
    time_axis: [],

    task_today: [
      
    ],

    imgUrls: [],//轮播图路径
    kp: {
      cover: "/images/cat1.jpg",
      title: "肩关节活动范围受限的自我牵拉练习",
      desc: "这里要有一段很长很长很长很长很长很长很长很长很长很长很长很长很长的简介",
      id: "0003"
    },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;
    util.showLoading();
    if(textData){
      vm.setData({
        task_today:[{
          type: "kfjh",
          name: "踝泵练习",
          desc: "踝关节缓慢、有力、全范围的屈伸活动，每日500次以上。",
          xj_ids: "0001,0004",
          status: '0',
          info_id: "0001"
        },
        {
          type: "kfjh",
          name: "股四头肌收缩",
          desc: "大腿前侧肌肉用力收缩、放松。每日500次以上",
          xj_ids: "0001,0002,0003",
          status: '0',
          info_id: "0002,"
        },
        {
          type: "jhsj",
          name: "采集数据",
          desc: "您有 4 项数据需要采集"
        }]
      })
    }

    //获取用户信息
    console.log("index:onload",JSON.stringify(app.globalData.userInfo))
    vm.reLoad(app.globalData.userInfo);
  },
  reLoad: function(user){
    if (user)
    util.getUserInfo(user, function (res1) {
      console.log('res1',res1)
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
              desc: res.data.ret[x].name,
              startDate: start,
              endDate: end,
              unix_timestamp_s: res.data.ret[x].start_time,
              unix_timestamp_e: res.data.ret[x].end_time,
            })
          }
          vm.setData({
            'kfjh': kfjh
          })
          //以下为将康复计划转化为时间轴


          var temp = []

          var i;
          for (i in vm.data.kfjh) {
            if (temp.length == 0) {
              temp.push({
                time_stamp: vm.data.kfjh[i].unix_timestamp_s,
                title: [vm.data.kfjh[i].desc + "开始"],
                time: vm.data.kfjh[i].startDate
              }, {
                  time_stamp: vm.data.kfjh[i].unix_timestamp_e,
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
                  title: [vm.data.kfjh[i].desc + "开始"],
                  time: vm.data.kfjh[i].startDate
                })
              };
              if (!flagE) {
                temp.push({
                  time_stamp: vm.data.kfjh[i].unix_timestamp_e,
                  title: [vm.data.kfjh[i].desc + "结束"],
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
          //       desc: "踝关节缓慢、有力、全范围的屈伸活动，每日500次以上。",
          //         xj_ids: ["0001", "0004"],
          //           status: '0',
          //             info_id: "0001"
          // }
        }, null)

      }
      else{
        //游客模式
      }
      

    }, null)
    console.log(vm.data.time_axis)
    util.getADs(function (resAD) {
      console.log("getADs:xxxxxxxxxx", resAD.data.ret)
      var urls = [];
      for (var x in resAD.data.ret) {
        urls.push(resAD.data.ret[x].image)
      }
      vm.setData({
        imgUrls: urls
      })
    }, null)
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
    var date1 = new Date();
    date1.setHours(0)
    date1.setMinutes(0)
    date1.setSeconds(0)
    date1.setMilliseconds(0)
    date1.setFullYear(2018, 0, 7)
    console.log(Math.round(date1.getTime() / 1000), date1)
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
    vm.reLoad(app.globalData.userInfo)
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
  formSubmit: function () {
    s = location.search.substr(1);
    a = s.split('&');
    console.log(a);
  },
  jumpToCjsj: function () {
    wx.navigateTo({
      url: 'cjsj/cjsj',
    })
  },
  getInfo: function (e) {
    console.log(e);
    wx.switchTab({
      url: '../textlist/textlist?ids=' + e.currentTarget.id,
      success: function (res) { },
      fail: function (res) { console.log("调用失败",res)},
      complete: function (res) { },
    })
  },
  getkfjh: function () {
    wx.navigateTo({
      url: "/pages/my/kfjh/kfjh",
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  toTextList: function () {
    wx.switchTab({
      url: '/pages/textlist/textlist',
    })
  },
  cjsj:function(){
    wx.navigateTo({
      url: "/pages/cjsj/cjsj",
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
  
})