var vm;
const util = require('../../utils/util.js')
const app = getApp()


Page({
  data: {
    index:0,
    open:true
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

    vm=this
    // 从服务器获取量表界面
    util.showLoading();
    var name=[];
    var id=[];
    util.getLbList(function(res){
      
      if(res.data.result){
        var list=res.data.ret.sort((a, b) => { a.show_num - b.show_num})
        for(var x in list){
          name.push(list[x].name);
          id.push(list[x].id)
        }
      }
      vm.setData({
        name:name,
        id:id
      })
      console.log("lblist", vm.data.name, vm.data.id)
    },null)
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  selected:function(e){
    vm.setData({index:e.detail.value})
  },
  startTest:function(e){
    console.log(e.target.id)
    var index =parseInt(e.target.id);
    wx.navigateTo({
      url: "./form/form?id="+vm.data.id[index],
    })
  },
  history:function(){
    wx.navigateTo({
      url: "./history/history",
    })
  },
  open: function () {
    vm.setData({
      open: true
    })
  },
  close: function () {
    vm.setData({
      open: false
    })
  }
})