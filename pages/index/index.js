//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

function startTimer(interval, onTimer) {
  var time = setTimeout(function () {
      onTimer();
      startTimer(interval, onTimer);
    },
    interval
  )
}

Page({
  data: {
    longitude: 0,
    latitude: 0,
    location: ',',
    scale: 10,
    markers: [{
      id: 0,
      latitude: 0,
      longitude: 0,
      width: 50,
      height: 50
    }],
    second:30
  },

  //事件处理函数
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文
    
  },
  
  newButtonTaped: function () {
    console.log("index.js::newButtonTaped")
    this.mapCtx = wx.createMapContext('alarmMap')
    this.mapCtx.getCenterLocation({
      success: function (res) {
        app.globalData.currentAlarm = {
          longitude: res.longitude,
          latitude: res.latitude
        }
        wx.navigateTo({
          url: '../setpoint/setpoint'
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  editButtonTaped: function () {
    console.log("index.js::editButtonTaped")
    wx.navigateTo({
      url: '../listpoint/listpoint'
    })
  },

  showButtonTaped: function () {
    console.log("index.js::showButtonTaped")
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  
  onShow: function() {
    var that = this    
    if (app.globalData.alarms.length > 0){
      var locations = app.globalData.alarms.map(function (x) {
                        return { longitude: x.longitude, latitude: x.latitude }
                      })
      this.mapCtx = wx.createMapContext('alarmMap')
      this.mapCtx.includePoints({
        padding:[20],
        points:locations
      })
      this. mapCtx.getCenterLocation({
        success: function (res) {
          var latitude = res.latitude
          var longitude = res.longitude
          console.log(res)
          var location = latitude.toFixed(2) + ',' + longitude.toFixed(2)
          that.setData({
            location: location,
            markers: locations
          }) 
        },
        fail:function(res){
          console.log(res)
        }
      })
    }else{
      wx.getLocation({
        type: 'gcj02', // 返回 可以 用于 wx. openLocation 的 经纬度 
        success: function (res) {
          var latitude = res.latitude
          var longitude = res.longitude
          console.log(res)
          var location = latitude.toFixed(2) + ',' + longitude.toFixed(2)
          that.setData({ longitude: longitude, 
                        latitude: latitude, 
                        location: location,
                        markers: [{latitude: latitude,
                                    longitude: longitude,
                                  }]
                      });
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }
    console.log("Page count = " + getCurrentPages().length)
  },

  onLoad:function(){
    startTimer(30000,function(){
      //console.log("OnTimer!")
      var now = new Date();
      wx.setTopBarText({
        text: now.getMinutes() + ":" + now.getSeconds(),
      })
      wx.getLocation({
        success: function(res) {
          app.checkAlarms(res.latitude, res.longitude);
        },
      })
    });
  },

})
