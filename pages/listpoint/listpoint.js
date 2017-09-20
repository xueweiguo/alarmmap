//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    alarms: [1, 2, 3, 4, 5]
  },

  //事件处理函数
  backButtonTaped: function () {
    console.log("listpoint.js::backButtonTaped")
    wx.navigateTo({
      url: '../setpoint/setpoint'
    })
  },

  actionButtonTaped: function () {
    console.log("listpoint.js::actionButtonTaped")
    wx.navigateTo({
      url: '../editaction/editaction'
    })
  },

  cancelButtonTaped: function () {
    console.log("listpoint.js::cancelButtonTaped")
    wx.navigateTo({
      url: '../index/index'
    })
  },


  onLoad: function () {
    /*
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
    */
  }
})
