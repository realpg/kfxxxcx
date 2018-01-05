var vm;
const util = require('../../utils/util.js')

var touchDot = 0;//触摸时的原点 
var time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动 
var interval = "";// 记录/清理时间记录 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    text: [
    ],
    perPage:10,
    page:1,
    searchResult: [],
    open:false,
    typelist: [{
      id: "", name: "全部", desc: "全部"
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this
    var ids=options.ids
    console.log("文章列表",ids)
    //从服务器获取资讯列表
    util.showLoading()
    util.getArticleList({},function(res){
      console.log("res",res.data.ret.data);
      var text=[];
      for (var x in res.data.ret.data){
        text.push({
          id: res.data.ret.data[x].id,
          name: res.data.ret.data[x].title,
          desc: res.data.ret.data[x].desc,
          imgsrc: res.data.ret.data[x].img ? res.data.ret.data[x].img : "../../images/cat1.jpg"
        })
      }
      text=text.sort(function(a,b){return a.id-b.id})
      vm.setData({
        text:text
      })
    },null)
    //从服务器获取资讯类型列表
    util.getArticleTypeList(function(res){
      var typelist = res.data.ret.data
      console.log("typelist=", typelist)
      typelist.unshift({
        id: "", name: "全部", desc:"全部"
      })
      console.log("tpyelist",typelist)
      vm.setData({
        typelist:typelist
      })
      util.hideLoading()
    },null)
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
    if (vm.data.text.length > vm.data.perPage * vm.data.page)
    vm.setData({
      page:vm.data.page+1
    })
    console.log("page=",vm.data.page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    var input = e.detail.value
    this.setData({
      inputVal: input
    });

    var searchResult = [];
    for (var x in vm.data.text) {
      if (vm.data.text[x].name.toUpperCase().match(e.detail.value)|| 
        vm.data.text[x].desc.toUpperCase().match(e.detail.value)) {
        searchResult.push(vm.data.text[x])
      }
    }
    vm.setData({
      searchResult: searchResult
    })
  },
  tap_change:function(){
    vm.setData({
      open:!vm.data.open
    })
    console.log("点击");
  },
  chooseType:function(e){
    console.log(e.currentTarget.id.substr(4))
    //从服务器获取资讯列表
    util.getArticleList({ type: e.currentTarget.id.substr(4)}, function (res) {
      console.log("res:", res.data.ret.data);
      var text = [];
      for (var x in res.data.ret.data) {
        text.push({
          id: res.data.ret.data[x].id,
          name: res.data.ret.data[x].title,
          desc: res.data.ret.data[x].desc,
          imgsrc: res.data.ret.data[x].img ? res.data.ret.data[x].img : "../../images/cat1.jpg"
        })
      }
      text = text.sort(function (a, b) { return a.id - b.id })
      vm.setData({
        text: text
      })
    }, null)
    vm.setData({
      open: !vm.data.open
    })
    vm.clearInput()
  },
  // 触摸开始事件 
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点 
    // 使用js计时器记录时间  
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸移动事件 
  touchMove: function (e) {
    var touchMove = e.touches[0].pageX;
    console.log("touchMove:" + touchMove + " touchDot:" + touchDot + " diff:" + (touchMove - touchDot));
    // 向左滑动  
    if (touchMove - touchDot <= -40 ) {
      console.log('../左滑页面/左滑页面')
      vm.setData({
      open:false
      });
    }
    // 向右滑动 
    if (touchMove - touchDot >= 40 ) {
      console.log('向右滑动');
      console.log( '../右滑页面/右滑页面');
      vm.setData({
        open: true
      });
    }
  },
  // 触摸结束事件 
  touchEnd: function (e) {
    clearInterval(interval); // 清除setInterval 
    time = 0;
  }, 
})