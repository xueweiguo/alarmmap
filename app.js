//app.js

var ringtoneName = ['ringtone1', 'ringtone2', 'ringtong3', 'neusong']
var ringtoneUrl = [
    'https://raw.githubusercontent.com/xueweiguo/alarmmap/master/ringtones/1.silk',
      'https://raw.githubusercontent.com/xueweiguo/alarmmap/master/ringtones/2.silk',
        'https://raw.githubusercontent.com/xueweiguo/alarmmap/master/ringtones/3.silk',
          'https://raw.githubusercontent.com/xueweiguo/alarmmap/master/ringtones/neusong.silk'
]

var ringtoneName = ['ringtone1', 'ringtone2', 'ringtong3', 'neusong']
var ringtoneUrl = [
  'https://raw.githubusercontent.com/xueweiguo/alarmmap/master/ringtones/1.silk',
  'https://raw.githubusercontent.com/xueweiguo/alarmmap/master/ringtones/2.silk',
  'https://raw.githubusercontent.com/xueweiguo/alarmmap/master/ringtones/3.silk',
  'https://raw.githubusercontent.com/xueweiguo/alarmmap/master/ringtones/neusong.silk'
]

const util = require('./utils/util.js')

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
    this.globalData.alarms = wx.getStorageSync('alarms') || []
    //读出缓存文件信息。
    this.globalData.urlMap = wx.getStorageSync('urlMap') || []
    this.addLog("app.onLaunch")
  },

  addAlarm: function(alarm){
    if (alarm.dateTime == null) {
      //edit alarm
      alarm.dateTime = new Date()
      this.globalData.alarms.push(alarm);
    } else {
      //new alarm 
      //app.globalData.alarms.push(app.globalData.currentAlarm);
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

  checkAlarms: function (latitude, longitude) {
    var that = this;
    this.globalData.alarms.forEach(function(v, i, alarms){
      var msg = util.getGreatCircleDistance(latitude, longitude, v.latitude, v.longitude)
      that.addLog(msg)
    })
  },

  getRingtoneNames: function(){
    return ringtoneName;
  },

  getRingtoneUrl: function (index){
      return ringtoneUrl[index];
  },

  getRingoneUrlByName: function (name){
    var index = ringtones.indexOf(name);
    if (index != -1) {
      index = 0;
    }
    return ringtones[index];
  },

  //下载并保存文件
  downloadFile: function(parameter){
    var that = this
    wx.downloadFile({
      url: parameter.url,
      success: function (res) {
        //保存临时文件，以供将来使用
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: function (save_res) {
            parameter.success(save_res.savedFilePath)
          }
        })
      },
    })  
  },

  //下载，保存，播放铃声文件。
  downloadAndPlayRingtone:function(url){
    var that = this
    that.downloadFile({
      url: url,
      success: function (savedFilePath) {
        //that.addLog('saveFileSuccess')
        //下载成功，播放文件
        that.addLog('播放下载铃声')
        wx.playVoice({
          filePath: savedFilePath,
        })
        //更新缓存文件信息。
        that.globalData.urlMap[url] = savedFilePath;
        wx.setStorageSync('urlMap', that.globalData.urlMap);
      }
    })
  },

  //播放铃声文件，优先使用缓存文件，根据需要下载。
  playRingtone: function(index) {
    var that = this
    var url = that.getRingtoneUrl(index)
    var savedFile = that.globalData.urlMap[url]
    if (savedFile != undefined){      
      //已经存在缓存文件，直接播放缓存文件
      that.addLog('播放缓存铃声')
      wx.playVoice({
        filePath: savedFile,
        fail:function(){
          //播放缓存文件失败，清除缓存文件信息
          that.globalData.urlMap[url] = undefined;
          wx.setStorageSync('urlMap', that.globalData.urlMap);
          //下载并播放缓存文件
          that.downloadAndPlayRingtone(url)
        },
      })
    }else{
      //没有缓存文件，下载并播放
      that.downloadAndPlayRingtone(url)
    }
  },

  addLog:function(msg){
    this.globalData.logs.push({time:new Date, message:msg});
    if(this.globalData.logs.length > 100){
      this.globalData.logs.length.shift();
    }
  },

  globalData: {
    pixelRatio: 1,
    windowWidth: 100,
    windowHeight: 100,
    alarms: [],
    urlMap: [],  //铃声缓存文件信息。
    currentAlarm: null,
    logs:[],
  }
})