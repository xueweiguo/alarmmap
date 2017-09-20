//setpoint.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    longitude: 0,
    latitude: 0,
    location: ',',
    pois:{},
    controls: [{
      id: 1,
      iconPath: '/images/control.png',
      position: {
        left: (app.windowWidth - 16) / 2,
        top: (app.windowHeight * 0.5 - 16) / 2,
        width: 16,
        height: 16
      },
      clickable: true
    }],
    info_index:[0]
   },
  

  //事件处理函数
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('alarmMap')
  },

  regionChanged: function (e) {
    console.log("setpoints.js regionChanged")
    var that = this
    this.mapCtx.getCenterLocation ({
      success: function(res) {
        type: 'gcj02', // 返回 可以 用于 wx. openLocation 的 经纬度
        util.getPoisByLocation(res.latitude, res.longitude, function(data){
          console.log(data)
          that.setData({
            pois:data,
            location: res.latitude.toFixed(4) + ',' + res.longitude.toFixed(4),
          });
        })
        app.globalData.currentAlarm = {
            longitude: res.longitude,
            latitude: res.latitude
        };
      }
    })
  },

  pikerChange: function (e) {
    const val = e.detail.value
    app.globalData.currentAlarm.title = this.data.pois.pois[val]
  },

  editActionButtonTaped: function () {
    console.log("setpoint.js::editActionButtonTaped")
    wx.navigateTo({
      url: '../editaction/editaction'
    })
  },

  backButtonTaped: function () {
    console.log("setpoint.js::cancelButtonTaped")
    wx.navigateBack(1)
  },

  onLoad: function () {
    console.log("setpoint.js::onLoad")
    var that = this
    var latitude = app.globalData.currentAlarm.latitude
    var longitude = app.globalData.currentAlarm.longitude
    var location = latitude.toFixed(4) + ',' + longitude.toFixed(4)
    that.setData({
       longitude: longitude,
       latitude: latitude,
       location: location,
    });
  },
})
