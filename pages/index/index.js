//index.js
//获取应用实例

import { Alarm } from '../../utils/alarm.js'

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
        app.globalData.currentAlarm = new Alarm({latitude:res.latitude, 
                                                longitude:res.longitude})
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
  
  showMap: function() {
    var that = this    
    var markers = app.globalData.alarms.map(function (x) {
      return { longitude: x.longitude, latitude: x.latitude }
    })
    var here = app.globalData.here
    var loc_text = undefined
    if(here != undefined){
      markers.push({longitude:here.longitude,
                    latitude: here.latitude,
                    iconPath: '/images/control.png'})
      loc_text = here.latitude.toFixed(6) + ',' + here.longitude.toFixed(6)
    }

    this.mapCtx = wx.createMapContext('alarmMap')
    this.mapCtx.includePoints({
        padding:[20],
        points:markers
    })

    this.setData({
      location: loc_text,
      markers: markers
    }) 
  },

  onLoad:function(){
    var that = this
    app.checkAlarms(function(){
      that.showMap();
    });
    
    startTimer(10000,function(){
      //console.log("OnTimer!")
      var now = new Date();
      wx.setTopBarText({
        text: now.getMinutes() + ":" + now.getSeconds(),
      })
      app.checkAlarms(function () {
        that.showMap();
      });
    });
  },

})
