// pages/cjsj/cjsj.js
var vm;
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "positions": [
      { name: "肩关节", number: 11, img: null }, { name: "肘关节", number: 1, img: null }, { name: "腕关节", number: 1, img: null }, { name: "髋关节", number: 1, img: null }, {
        name: "膝关节", number: 15, img: "http://twst.isart.me/o_1c43goua0loomdslkn60nv5t1a.png", img_array: ["http://twst.isart.me/o_1c43goua0loomdslkn60nv5t1a.png"]
      }, { name: "踝关节", number: 1, img: null }, { name: "颈椎", number: 1, img: null }, { name: "胸椎", number: 1, img: null }, { name: "腰椎", number: 1, img: null }],
    sjx: [
      {
        id: 1,
        name: "肩部皮温",
        doctor_id: 1,
        position: 1,
        type: 1,
        side: 0,
        desc: "肩部皮温"
      },
      {
        id: 1,
        name: "肩部皮疼",
        doctor_id: 1,
        position: 1,
        type: 2,
        side: 1,
        desc: "肩部皮疼"
      },
      {
        id: 1,
        name: "肩部角度",
        doctor_id: 1,
        position: 1,
        type: 3,
        side: 0,
        desc: "肩部角度"
      }, {
        id: 1,
        name: "肩部围度",
        doctor_id: 1,
        position: 1,
        type: 4,
        side: 1,
        desc: "肩部围度"
      }
    ],
    sj: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;
    util.getHposList(null, function (res) {
      console.log(res.data)

      var positions=res.data.ret;
      for (var x in positions){
        positions[x].h_posList=[];
        for (var y = 1; y <= positions[x].number;y++){
          positions[x].h_posList.push(y);
        }
      }
      if (res.data.result) {
        vm.setData({
          positions: positions
        })
      }
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
  addSJ: function () {
    console.log("添加数据采集");
    var sj = vm.data.sj;
    sj.push({
      position: null
    })
    vm.setData({
      sj: sj
    })
  },
  choosePosition: function (e) {
    console.log('changePosition', e.detail.value, e)
    var id = vm.data.positions[e.detail.value].id;
    var index = e.target.id.substr(2);
    var idx = e.detail.value;
    var sj = vm.data.sj;
    sj[index].position = e.detail.value;

    //根据位置获取数据项列表
    util.getListByHPosId({ hpos_id: id }, function (res) {
      console.log(res.data.ret);
      sj[index].sjxs = res.data.ret
      vm.setData({
        sj: sj
      })
    }, null)
  },
  chooseSjx: function (e) {
    var index = e.target.id.substr(3);
    var idx = e.detail.value;
    var sj = vm.data.sj;
    console.log('changeSjx', sj)
    sj[index].sjx = sj[index].sjxs[idx];
    sj[index].sjx_id = sj[index].sjxs[idx].id;
    sj[index].value = sj[index].sjx.side == 0 ? [0] : [0, 0];
    //根据位置获取数据项列表
    vm.setData({
      sj: sj
    })
  },
  changePosition_d: function (e) {

    var index = e.target.id.substr(4);
    var c_pos = parseInt(e.detail.value) + 1;
    var sj = vm.data.sj;
    sj[index].c_pos = c_pos;
    console.log('changePosition_d', index, c_pos);
    vm.setData({
      sj: sj
    })
  },
  changeSide: function (e) {
    var index = e.target.id.substr(4);
    var array = ["l", "r"];
    var c_side = array[e.detail.value];
    var sj = vm.data.sj;
    sj[index].c_side = c_side;
    console.log('changePosition_d', index, c_side);
    vm.setData({
      sj: sj
    })
  },
  GetPiwen: function (e) {
    var i = parseInt(e.target.id);//接收index值
    var side = e.target.id[e.target.id.length - 1] == 'r' ? 1 : 0;
    console.log(i, side, 'side')
    wx.navigateTo({
      url: 'piwen/piwen?index=' + i + '&side=' + side,
    })
  },
  GetPiteng: function (e) {
    var i = parseInt(e.target.id);//接收index值
    var side = e.target.id[e.target.id.length - 1] == 'r' ? 1 : 0;
    console.log(i, side, 'side')
    wx.navigateTo({
      url: 'piteng/piteng?index=' + i + '&side=' + side,
    })
  },
  GetAngle: function (e) {
    var i = parseInt(e.target.id);//接收index值
    var side = e.target.id[e.target.id.length - 1] == 'r' ? 1 : 0;
    console.log(i, side, 'side')
    wx.navigateTo({
      url: './jiaodu/chooseImg?index=' + i + '&side=' + side,
    })
  },
  GetWeidu: function (e) {
    var i = parseInt(e.target.id);//接收index值
    var side = e.target.id[e.target.id.length - 1] == 'r' ? 1 : 0;
    console.log(i, side, 'side')
    wx.navigateTo({
      url: 'weidu/weidu?index=' + i + '&side=' + side,
    })
  },
  submit: function () {
    console.log("submit", JSON.stringify(vm.data.sj))
    var param = {
      userCase_id: 0,
      cjsjs: vm.data.sj
    }
    util.reportCJSJ(param, function (res) {
      console.log(res)
      if (res.data.result) {
        wx.showModal({
          title: '提交成功',
          content: '点击确定返回首页',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log(res)
              wx.navigateBack({
                delta: 1,
              })
            }
          }
        })

      }

    }, null)
  }
})