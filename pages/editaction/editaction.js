//editaction.js
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    title:'',
    alarms: [1, 2, 3],
    monitor_array: ['接近监控点', '离开监控点'],
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
    app.playRingtone(e.detail.value)
  },

  okButtonTaped: function () {
    console.log("editaction.js::okButtonTaped")
    var alarm = app.globalData.currentAlarm
    alarm.setMonitorType(this.data.monitor_array[this.data.monitor_index])
    alarm.setActionType(this.data.action_array[this.data.action_index])

    if (alarm.action_type == '播放提示音') {
      var url = app.getRingtoneUrl(this.data.media_index)
      alarm.setMedia(url)
    } else {
      alarm.setTimer(this.data.timer_array[this.data.timer_index])
    }
    app.addAlarm(alarm)
    app.globalData.currentAlarm = undefined;

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
    var medias = app.getRingtoneNames()
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
  },
})

