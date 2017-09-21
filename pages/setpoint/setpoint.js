//setpoint.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    longitude: 0,
    latitude: 0,
    location: ',',
    poisData:{},
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
   
  },

  regionChanged: function (e) {
    console.log("setpoints.js regionChanged")
    this.getPoisInformation()
  },

  pikerChange: function (e) {
    const val = e.detail.value
    app.globalData.currentAlarm.title = this.data.pois[val].title
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

  //生命周期
  onShow: function(){
    console.log("setpoints.js onShow")
    this.getPoisInformation()
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
  //内部处理

  getPoisInformation:function(){
    var that = this
    var mapCtx = wx.createMapContext('alarmMap')
    mapCtx.getCenterLocation({
      success: function (res) {
        util.getPoisByLocation(res.longitude, res.latitude, function (data) {
          console.log(data)
          that.setData({
            pois: data.pois,
            location: res.latitude.toFixed(4) + ',' + res.longitude.toFixed(4),
          });
          app.globalData.currentAlarm = {
            longitude: res.longitude,
            latitude: res.latitude,
            title: data.pois[0].title
          };
        })
      }
    })
  },
})
