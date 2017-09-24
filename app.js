//app.js
App({
  onLaunch: function () {
    try {
      var res = wx.getSystemInfoSync()
      this.pixelRatio = res.pixelRatio
      this.windowWidth = res.windowWidth
      this.windowHeight = res.windowHeight
    } catch (e) {
      console.log("wx.getSystemInfoSync() error!")
    }
    this.globalData.alarmPoints = wx.getStorageSync('alarmPoints') || []
  },

  globalData: {
    pixelRatio: 1,
    windowWidth: 100,
    windowHeight: 100,
    alarms: [],
    currentAlarmIndex: -1,
    currentAlarm: null,
  }
})