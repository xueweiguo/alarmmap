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
    this.globalData.alarms = wx.getStorageSync('alarms') || []
  },

  addAlarm: function(alarm){
    if (alarm.dateTime == null) {
      //edit alarm
      alarm.dateTime = new Date()
      this.globalData.alarms.push(alarm);
    } else {
      //new alarm 
      //app.globalData.alarms.push(app.globalData.currentAlarm);
      this.globalData.alarms.forEach(function (a, i, alarms) {
        if (a.dateTime == alarm.dateTime){
          alarms[i] = alarm
        }  
      })
    }
    wx.setStorageSync('alarms', this.globalData.alarms)
  },

  deleteAlarm: function(index){
    if(index >= 0 && index < this.globalData.alarms.length) {
      this.globalData.alarms.splice(index, 1);
      wx.setStorageSync('alarms', this.globalData.alarms)
    }
  },

  globalData: {
    pixelRatio: 1,
    windowWidth: 100,
    windowHeight: 100,
    alarms: [],
    currentAlarm: null,
  }
})