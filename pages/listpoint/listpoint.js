//logs.js
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    alarms: [{title:''}],
    current_alarm: 0
  },

  //事件处理函数
  alarmTaped:function(e){
    console.log(e.target.id);
    this.setData({current_alarm:e.target.id});
  },

  backButtonTaped: function () {
    console.log("listpoint.js::backButtonTaped")
    wx.navigateTo({
      url: '../setpoint/setpoint'
    })
  },

  editButtonTaped: function () {
    console.log("listpoint.js::actionButtonTaped")
    if(this.data.alarms.length > 0){
      app.globalData.currentAlarm = app.globalData.alarms[this.data.current_alarm]
      wx.navigateTo({
        url: '../setpoint/setpoint'
      })
    }
  },

  cancelButtonTaped: function () {
    console.log("listpoint.js::cancelButtonTaped")
    wx.navigateTo({
      url: '../index/index'
    })
  },


  onLoad: function () {
    var alarms = app.globalData.alarms.map(function (x) {
      return { title: x.title }
    })
    this.setData({
      alarms:alarms
    })
  }
})
