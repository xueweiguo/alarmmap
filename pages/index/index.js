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
    scale: 10,
    markers: [{
      id: 0,
      latitude: 0,
      longitude: 0,
      width: 50,
      height: 50
    }],
    second:30,
    alarms: [{ title: '' }],
    current_alarm:0
  },

  //事件处理函数
  onReady: function (e) {
    
  },

  alarmTaped: function (e) {
    console.log(e.target.id);
    this.setData({ current_alarm: e.target.id });
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

  cancelButtonTaped: function () {
    var current = app.globalData.alarms[this.data.current_alarm]
    if(current != undefined){
      if(current.state == "fired"){
        current.cancel()
        this.showMap(true)
      }
    }
  },

  deleteButtonTaped: function () {
    var current = app.globalData.alarms[this.data.current_alarm]
    if (current != undefined) {
      app.deleteAlarm(this.data.current_alarm)
      this.showMap(true)
    }
  },

  showButtonTaped: function () {
    console.log("index.js::showButtonTaped")
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onShow:function(){
    this.showMap(true);
  },
  
  showMap: function(first_show) {
    var that = this    
    var here = app.globalData.here
    var markers = app.globalData.alarms.map(function (x) {
      return {
        longitude: x.longitude,
        latitude: x.latitude,
      }
    })

    if (here != undefined) {
      markers.push({
        longitude: here.longitude,
        latitude: here.latitude,
        iconPath: '/images/control.png'
      })
    }

    var alarms = app.globalData.alarms.map(function (x) {
      return {
        title: x.title,
        status: x.getStatus(here)
      }
    })

    this.setData({
      markers: markers,
      alarms: alarms
    })

    if (first_show == true) {
      this.mapCtx.includePoints({
        padding: [20],
        points: markers
      })
    }
  },

  onLoad:function(){
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('alarmMap')
    var that = this
    app.checkAlarms(function () {
      that.showMap(true);
    });

    startTimer(10000, function () {
      //console.log("OnTimer!")
      var now = new Date();
      wx.setTopBarText({
        text: now.getMinutes() + ":" + now.getSeconds(),
      })
      app.checkAlarms(function () {
        that.showMap(false);
      });
    });
  },

})
