//index.js
//获取应用实例

import { Alarm } from '../../utils/alarm.js'

const app = getApp()
const util = require('../../utils/util.js')

const START_MONITOR = '开始监控'
const STOP_MONITOR = '停止监控'
const DELETE_ALARM = '删除'
const ACCEPT_ALARM = "接受"

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
    current_alarm:0,
    accept_btn_color:'black',
    monitor_on:false
  },

  //事件处理函数
  onReady: function (e) {
    
  },

  alarmTaped: function (e) {
    console.log(e.target.id);
    this.setData({ current_alarm: e.target.id });
    this.showAlarms();
  },

  controlButtonTaped:function(){
    if (this.data.control_title == START_MONITOR) {
      this.startMonitor()
      this.setData({
        control_title:STOP_MONITOR
      })
    } else {
      this.stopMonitor()
    }
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

  acceptButtonTaped: function (e) {
    console.log(e.target.id);
    var current = app.globalData.alarms[this.data.current_alarm]
    if(current != undefined){
      if(current.state == "fired"){
        current.accept()
        this.showAlarms(true)
      }
    }
  },

  deleteButtonTaped: function (e) {
    var current = app.globalData.alarms[this.data.current_alarm]
    if (current != undefined) {
      app.deleteAlarm(this.data.current_alarm)
      this.showAlarms(true)
    }
  },

  showButtonTaped: function () {
    console.log("index.js::showButtonTaped")
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onShow:function(){
    this.showAlarms(true);
  },
  
  showAlarms: function(first_show) {
    //console.log('showAlarms')
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
        status: x.getStatus()
      }
    })

    var accept_btn_color = 'lightgray'
    var current = app.globalData.alarms[this.data.current_alarm]
    if (current != undefined && current.getState() == 'fired') {
      accept_btn_color = 'black'
    }

    this.setData({
      markers: markers,
      alarms: alarms,
      accept_btn_color: accept_btn_color,
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
      that.showAlarms(true);
    },
    true);
  },

  startMonitor:function(){
    app.addLog('startMonitor!')
    var that = this
    app.resumeAlarms()
    app.checkAlarms(function () {
      that.showAlarms(true);
    },
    true);
    this.startTimer(15000, function () {
    //this.startTimer(5000, function () {
      var now = new Date();
      wx.setTopBarText({
        text: now.getMinutes() + ":" + now.getSeconds(),
      })
      app.checkAlarms(function () {
        that.showAlarms(false);
      },
      false);
    });
    this.setData({
      monitor_on: true,
    })
  },

  stopMonitor:function(){
    var that = this
    app.suspendAlarms()
    app.checkAlarms(function () {
      that.showAlarms(true);
      },
      true
    );
    this.setData({
      monitor_on: false,
    })
    app.addLog('stopMonitor')
  },

  startTimer: function(interval, onTimer) {
    var that = this
    var time = setTimeout(function () {
        if (that.data.monitor_on == true) {
              onTimer();
              that.startTimer(interval, onTimer);
        }
      },
      interval
    )
  },
})
