//app.js

import { Alarm } from './utils/alarm.js'

var ringtoneName = ['ringtone1', 'ringtone2', 'ringtong3', 'neusong']
var ringtoneUrl = [
  'https://raw.githubusercontent.com/xueweiguo/alarmmap/master/ringtones/1.silk',
  'https://raw.githubusercontent.com/xueweiguo/alarmmap/master/ringtones/2.silk',
  'https://raw.githubusercontent.com/xueweiguo/alarmmap/master/ringtones/3.silk',
  'https://raw.githubusercontent.com/xueweiguo/alarmmap/master/ringtones/neusong.silk'
]

const util = require('./utils/util.js')
const voiceplayer = require('./utils/voiceplayer.js')

App({
  onLaunch: function () {
    try {
      var res = wx.getSystemInfoSync()
      this.pixelRatio = res.pixelRatio
      this.windowWidth = res.windowWidth
      this.windowHeight = res.windowHeight
    } catch (e) {
      console.log("wx.getSystemInfoSync() error!")
    }
    //读出监控点信息。
    var that = this
    var alarm_array = wx.getStorageSync('alarms') || []
    alarm_array.forEach(function(alarm_data){
      that.globalData.alarms.push(new Alarm(alarm_data));
    })

    this.addLog("app.onLaunch")
    voiceplayer.prepare()
  },

  addAlarm: function(alarm){
    if (alarm.dateTime == null) {
      //edit alarm
      alarm.dateTime = new Date()
      this.globalData.alarms.push(alarm);
    } else {
      //new alarm 
      this.globalData.alarms.push(app.globalData.currentAlarm);
      this.globalData.alarms.forEach(function (a, i, alarms) {
        if (a.dateTime == alarm.dateTime){
          alarms[i] = alarm
        }  
      })
    }
    wx.setStorageSync('alarms', this.globalData.alarms)
  },

  deleteAlarm: function(index){
    if(index >= 0 && index < this.globalData.alarms.length) {
      this.globalData.alarms.splice(index, 1);
      wx.setStorageSync('alarms', this.globalData.alarms)
    }
  },

  checkAlarms: function (callback) {
    var that = this;
    that.globalData.here = undefined
    util.getLocation({
      success: function (res) {
        that.globalData.here = {
          latitude: res.latitude,
          longitude: res.longitude,
          accuracy: res.accuracy
        }
        var index = 0;
        var first_fired = undefined;
        while (index < that.globalData.alarms.length) {
          var alarm = that.globalData.alarms[index]
          alarm.checkLocation(res.latitude, res.longitude, res.accuracy)
          if (alarm.state == 'fired') {
            that.addLog(alarm.title + " fired.")
            if(first_fired == undefined){
              first_fired = alarm
            }
          }
          index++
        }
        if(first_fired != undefined){
          that.addLog(first_fired.title + " executeAction()")
          first_fired.executeAction()
        }
        callback()
      },
    })
  },

  getRingtoneNames: function () {
    return ringtoneName;
  },

  getRingtoneUrl: function (index) {
    return ringtoneUrl[index];
  },

  getRingoneUrlByName: function (name) {
    var index = ringtones.indexOf(name);
    if (index != -1) {
      index = 0;
    }
    return ringtones[index];
  },

  addLog:function(msg){
    this.globalData.logs.unshift({time:new Date, message:msg});
    if(this.globalData.logs.length > 100){
      this.globalData.logs.pop();
    }
  },

  globalData: {
    pixelRatio: 1,
    windowWidth: 100,
    windowHeight: 100,
    here: undefined,
    alarms: [],
    currentAlarm: null,
    logs:[],
  }
})