//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '请先登录',
    userInfo: {},
    hasUserInfo: false,
    lat: 0,
    lng: 0,
    hasLocation: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  // bindViewTap: function() {
    // wx.navigateTo({
    //   url: '../signin/signin'
    // })
  // },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    var that = this;
    wx.clearStorage()
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res);
        that.setData({
          lat: res.latitude,
          lng: res.longitude
        })
      }
    })
  },
  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)

    var that = this;
    if (e.detail.value.id.length == 0) {
      wx.showToast({
        title: '学号不得为空!',
        icon: 'loading',
        duration: 1500
      })
      setTimeout(function() {
        wx.hideToast()
      }, 2000)
    } else if (e.detail.value.pw.length == 0) {
      wx.showToast({
        title: '密码不得为空!',
        icon: 'loading',
        duration: 1500
      })
      setTimeout(function() {
        wx.hideToast()
      }, 2000)
    } else {
      wx.request({
        url: 'https://szuai.club:8888/signin/stu/auth',
        data: {
          stu_id: e.detail.value.id,
          pw: e.detail.value.pw
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        }, // 设置请求的 header
        success: function(res) {
          console.log(res);
          if (res.data.retcode == 0) {
            wx.showToast({
              title: '登录成功',
              icon: "none",
              duration: 2000
            })
            wx.setStorage({
              key: 'stu_id',
              data: e.detail.value.id,
            })
            wx.navigateTo({
              url: '../signin/signin?lat=' + that.data.lat + "&lng=" + that.data.lng
            })
          } else {
            wx.showToast({
              title: '学号或密码错误',
              icon: "none",
              duration: 2000
            })
          }
          // success
        },
        fail: function(res) {
          console.log(res);
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          // fail
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})