//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

function countdown(that) {
  var second = that.data.second
  if (second == 0) {
    console.log("Time Out...");
    util.playRingtone(3);
    return;
  }else{
    console.log("counterDown!");
    var time = setTimeout(function () {
      that.setData({
        second: second - 1
      });
      countdown(that);
    },
      1000
    )
  }
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
  
  onShow: function() {
    var that = this
    if (app.globalData.currentAlarm != null){
      if (app.globalData.currentAlarmIndex == -1){
        //edit alarm
        app.globalData.alarms.push(app.globalData.currentAlarm);
      }else{
        //new alarm 
        app.globalData.alarms[app.globalData.currentAlarmIndex] = app.globalData.currentAlarm;
      }
      app.globalData.currentAlarm = null;
    }

    if (app.globalData.alarms.length > 0){
      var locations = app.globalData.alarms.map(function (x) {
                        return { longitude: x.longitude, latitude: x.latitude }
                      })
      this.mapCtx = wx.createMapContext('alarmMap')
      this.mapCtx.includePoints({
        padding:[10],
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
    console.log(getCurrentPages())
  },

  onLoad:function(){
    //countdown(this);
  },
})
