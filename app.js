//app.js
App({
  onLaunch: function () {
    wx.getSystemInfo({
      success: res => {
        console.log(res.devicePixelRatio)
        this.globalData.devicePixelRatio = res.devicePixelRatio
      }
    })
  },
  globalData: {
    devicePixelRatio: null
  }
})