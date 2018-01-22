// pages/cjsj/cjsj.js
var vm;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "positions": [
      { name: "肩关节", number: 11, img: null }, { name: "肘关节", number: 1, img: null }, { name: "腕关节", number: 1, img: null }, { name: "髋关节", number: 1, img: null }, {
        name: "膝关节", number: 15, img: "http://twst.isart.me/o_1c43goua0loomdslkn60nv5t1a.png", img_array: ["http://twst.isart.me/o_1c43goua0loomdslkn60nv5t1a.png"]},{ name: "踝关节", number: 1, img: null }, { name: "颈椎", number: 1, img: null }, { name: "胸椎", number: 1, img: null }, { name: "腰椎", number: 1, img: null }],
    sjx:[
      {
        id:1,
        name:"肩部皮温",
        doctor_id:1,
        position:1,
        type:1,
        side:0,
        desc:"肩部皮温"
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
      },{
        id: 1,
        name: "肩部围度",
        doctor_id: 1,
        position: 1,
        type: 4,
        side: 1,
        desc: "肩部围度"
      }
    ],
    sj:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm=this;
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
  addSJ:function(){
    console.log("添加数据采集");
    var sj=vm.data.sj;
    sj.push({
      position:null
    })
    vm.setData({
      sj:sj
    })
  },
  choosePosition:function(e){
    console.log('changePosition',vm.data.sj)
    var index=e.target.id.substr(2);
    var position = e.detail.value;
    var sj=vm.data.sj;
    sj[index].position=position;
    sj[index].position_d=1;
    
    //根据位置获取数据项列表
    vm.setData({
      sj:sj
    })
  },
  chooseSjx: function (e) {
    var index = e.target.id.substr(3);
    var idx = e.detail.value;
    var sj = vm.data.sj;
    console.log('changeSjx',sj)
    sj[index].sjx = vm.data.sjx[idx];
    sj[index].sjx_id = vm.data.sjx[idx].id;
    sj[index].value = sj[index].sjx.side==0?[0]:[0, 0]; 
    //根据位置获取数据项列表
    vm.setData({
      sj: sj
    })
  },
  changePosition_d:function(e){
    console.log('changePosition_d',e);
    var index = e.target.id.substr(4);
    var position_d = e.detail.value;
    var sj = vm.data.sj;
    sj[index].position_d = position_d;
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
    var side = e.target.id[e.target.id.length - 1]=='r'?1:0;
    console.log(i,side,'side')
    wx.navigateTo({
      url: 'chooseImg?index=' + i+ '&side='+side,
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
  submit:function(){
    console.log("submit", JSON.stringify(vm.data.sj))
  }
})