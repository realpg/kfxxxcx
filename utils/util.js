//测试标识
var TESTMODE =false;
//服务器地址
var SERVER_URL = "http://kfxx.isart.me";
var DEBUG_URL = "http://localhost/kfypt/public";
var SERVER_URL = (TESTMODE) ? DEBUG_URL : SERVER_URL;



///接口调用相关方法///////////////////////////////////////////

//进行接口调用的基本方法
function wxRequest(url, param, method, successCallback, errorCallback) {
  showLoading();
  console.log("wxRequest url:" + JSON.stringify(url) + " param:" + JSON.stringify(param));
  if (!judgeIsAnyNullStr(getApp().globalData.userInfo)) {
    //user_id未设置
    if (judgeIsAnyNullStr(param.user_id)) {
      param.user_id = getApp().globalData.userInfo.id;
    }
    param.token = getApp().globalData.userInfo.token;
  }
  console.log("param：" + JSON.stringify(param))
  wx.request({
    url: url,
    data: param,
    header: {"content-Type": "application/json"},
    // header: { 'content-type': 'application/x-www-form-urlencoded' },
    method: method,
    success: function (ret) {
      console.log("ret:" + JSON.stringify(ret))
      successCallback(ret)
    },
    fail: function (err) {
      console.log("wxRequest fail:" + JSON.stringify(err))
      
    },
    complete:function(){
      hideLoading()
    }
  });
}

//获取七牛token
function getQiniuToken(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/user/getQiniuToken', param, "POST", successCallback, errorCallback);
}

//获取用户的OpenId
function getOpenId(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/user/getXCXOpenId', param, "GET", successCallback, errorCallback);
}

//登录
function login(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/user/login', param, "POST", successCallback, errorCallback);
}

//发送验证码
function sendVertifyCode(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/user/sendVertifyCode', param, "POST", successCallback, errorCallback);
}


//注册
function register(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/user/register', param, "POST", successCallback, errorCallback);
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
//根据id获取用户信息
function getUserInfo(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/user/getById', param, "GET", successCallback, errorCallback);
}
//根据id更新用户资料
function updateUserById(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/user/updateById', param, "POST", successCallback, errorCallback);
}

//获取首页轮播图
function getADs(param, successCallback, errorCallback){
  wxRequest(SERVER_URL + '/api/ad/getADs', param, "GET", successCallback, errorCallback);
}
//获取文章列表
function getArticleList(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/xj/getByCon', param, "GET", successCallback, errorCallback);
}
//获取文章类型列表
function getArticleTypeList( successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/xj/getXJTypes', "", "GET", successCallback, errorCallback);
}
//获取文章
function getArticle(param,successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/xj/getXJInfoById',param, "GET", successCallback, errorCallback);
}
//获取量表列表
function getLbList( successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/lb/getList', "", "GET", successCallback, errorCallback);
}
//通过id获取量表问题
function getQuesitionsById(param, successCallback, errorCallback){
  wxRequest(SERVER_URL + '/api/lb/getQuestionsById', param, "GET", successCallback, errorCallback);
}

//通过id上传问题答案
function answerLB(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/lb/answerLB', param, "POST", successCallback, errorCallback);
}
//
function getAnswerHistoryById(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/lb/getAnswerHistory', param, "GET", successCallback, errorCallback);
}


//通过id获取病历
function getBLByUserId(param,successCallback,errorCallback){
  wxRequest(SERVER_URL + '/api/kfjh/getBLByUserId', param, "GET", successCallback, errorCallback);
}

//通过id获取康复计划
function getKFJHByUserId(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/kfjh/getKFJHByUserId', param, "GET", successCallback, errorCallback);
}
//通过id获取计划数据
function getKFSJByUserId(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/kfjh/getKFSJByUserId', param, "GET", successCallback, errorCallback);
}


const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//判断是否有空字符串
function judgeIsAnyNullStr() {
  if (arguments.length > 0) {
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i] == null || arguments[i] == "" || arguments[i] == undefined || arguments[i] == "undefined" || arguments[i] == "未设置") {
        return true;
      }
    }
  }
  return false;
}


//展示toast
function showToast(msg, img) {
  console.log(img);
  if (judgeIsAnyNullStr(img)) {
    wx.showToast({
      title: msg,
      icon: 'success',
      duration: 1500,
    })
  } else {
    wx.showToast({
      title: msg,
      icon: 'success',
      duration: 1500,
      image: img
    })
  }
}

//展示modal
function showModal(title, content, confirmCallBack, cancelCallBack) {
  wx.showModal({
    title: title,
    content: content,
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
        confirmCallBack(res)
      } else if (res.cancel) {
        console.log('用户点击取消')
        cancelCallBack(res)
      }
    }
  })
}

//错误modal
function showErrorModal(msg) {
  wx.showModal({
    title: '调用失败',
    content: msg,
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
}

//展示loadding
function showLoading(msg) {
  if (!wx.canIUse('showLoading')) {
    return;
  }
  if (judgeIsAnyNullStr(msg)) {
    msg = "加载中";
  }
  wx.showLoading({
    title: msg,
  })
}

//隐藏loadding
function hideLoading() {
  if (!wx.canIUse('hideLoading')) {
    return;
  }
  wx.hideLoading();
}


//优化字符串输出，如果str为空，则返回r_str
function conStr(str, r_str) {
  if (judgeIsAnyNullStr(str)) {
    return r_str;
  }
  return str;
}



module.exports = {
  getQiniuToken: getQiniuToken,
  getOpenId: getOpenId,
  login: login,
  register: register,
  sendVertifyCode: sendVertifyCode,
  getUserInfo: getUserInfo,
  updateUserById: updateUserById,
  getADs:getADs,
  getArticleList: getArticleList,
  getArticleTypeList:getArticleTypeList,
  getArticle: getArticle,
  getLbList: getLbList,
  getQuesitionsById: getQuesitionsById,
  answerLB: answerLB,
  getAnswerHistoryById: getAnswerHistoryById,
  getBLByUserId: getBLByUserId,
  getKFJHByUserId:getKFJHByUserId,
  getKFSJByUserId: getKFSJByUserId,

  formatTime: formatTime,
  showLoading: showLoading,
  hideLoading: hideLoading,
  showToast: showToast,
  showModal: showModal,
  judgeIsAnyNullStr: judgeIsAnyNullStr,
}
