//editaction.js
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    title:'',
    alarms: [1, 2, 3],
    monitor_array: ['接近监控点', '离开监控点半'],
    monitor_index:0,
    action_array: ['播放提示音', '启动定时器', '停止定时器', '暂停定时器', '再开定时器'],
    action_index: 0,
    timer_array: ['定时器1', '定时器2', '定时器3','定时器4'],
    timer_index: 0,
    media_array: [],
    media_index: 0,
    files:[],
    savedFile:"",
    msg:"",
  },

  //事件处理函数
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
  },

  bindMonitorTypeChange: function (e) {
    console.log('editaction.js::bindMonitorTypeChange: ' + e.detail.value)
    this.setData({
      monitor_index: e.detail.value
    })
  },

  bindActionTypeChange: function (e) {
    console.log('editaction.js::bindActionTypeChange: ' + e.detail.value)
    this.setData({
      action_index: e.detail.value
    })
  },

  bindTimerChange: function (e) {
    console.log('editaction.js::bindTimerChange: ' + e.detail.value)
    this.setData({
      timer_index: e.detail.value
    })
   // this.audioCtx.play()
  },

  bindMediaChange: function (e) {
    console.log('editaction.js::bindMediaChange: ' + e.detail.value)
    this.setData({
      media_index: e.detail.value
    })
    util.playRingtone(e.detail.value)
  },

  okButtonTaped: function () {
    console.log("editaction.js::okButtonTaped")
    app.globalData.currentAlarm.moitor_type = this.data.monitor_array[this.data.monitor_index]
    app.globalData.currentAlarm.action_type = this.data.action_array[this.data.action_index]

    if (app.globalData.currentAlarm.action_type == '播放提示音') {
      app.globalData.currentAlarm.media = this.data.media_array[this.data.media_index]
    } else {
      app.globalData.currentAlarm.timer = this.data.timer_array[this.data.timer_index]
    }
    
    if (app.globalData.currentAlarmIndex == -1) {
      //edit alarm
        app.globalData.alarms.push(app.globalData.currentAlarm);
    } else {
       //new alarm 
      app.globalData.alarms[app.globalData.currentAlarmIndex] = app.globalData.currentAlarm;
    }
    app.globalData.currentAlarm = null;

    console.log(app.globalData.currentAlarm);
    wx.navigateBack({
      delta: getCurrentPages().length - 1
    })
  },

  cancelButtonTaped: function () {
    console.log("editaction.js::calcelButtonTaped")
    app.globalData.currentAlarm = null
    wx.navigateBack({
      delta:getCurrentPages().length - 1 
    })
  },

  onLoad: function () {
    var that = this
    var title = app.globalData.currentAlarm.title;
    var medias = util.getRingtoneNames()
    var index = medias.indexOf(title);
    if(index == -1)
    {
      index = 0
    }

    that.setData({
      title: title,
      media_array: medias,
      media_index : index
    })
   /*
    wx.getSavedFileList({
      success: function (res) {
        console.log(res.fileList)
        that.setData({
          files: res.fileList
        })
      }
    })
    */
  },
    /*
    wx.startRecord({
      success: function (res) {
        var tempFilePath = res.tempFilePath
        wx.saveFile({
          tempFilePath: tempFilePath,
          success: function (res) {
            that.data.savedFile = res.savedFilePath
          }
        })
      },
      fail: function (res) {
        //录音失败
      }
    })
    setTimeout(function () {
      //结束录音  
      wx.stopRecord()      
    }, 4000)
    */
    /*
    wx.playVoice({
      filePath: "/ringtones/1.mp3",
      success: function () {
        console.log("play success!");
      },
      fail: function (res) {
        console.log(res);
      }
    })
    
    */
})

