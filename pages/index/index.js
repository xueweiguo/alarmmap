//index.js
//获取应用实例
const app = getApp()

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
  },

  //事件处理函数
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('alarmMap')
  },

  newButtonTaped: function () {
    console.log("index.js::newButtonTaped")
    
    this.mapCtx.getCenterLocation({
      success: function (res) {
        app.globalData.currentAlarm = {
          longitude: res.longitude,
          latitude: res.latitude
        }
        wx.navigateTo({
          url: '../setpoint/setpoint'
        })
      }
    })

    
  },

  editButtonTaped: function () {
    console.log("index.js::editButtonTaped")
    wx.navigateTo({
      url: '../listpoint/listpoint'
    })
  },
  
  onShow: function() {
    var that = this
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
      }
    })
  },
})
