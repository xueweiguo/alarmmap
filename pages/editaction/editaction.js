//editaction.js
const util = require('../../utils/util.js')

Page({
  data: {
    alarms: [1, 2, 3],
    type_array: ['提示音1', '提示音2', '提示音2'],
    type_index:0,
    timer_array: ['定时器1', '定时器2', '定时器3','定时器4'],
    timer_index: 0,
    media_array: ['提示音1', '提示音2', '提示音3'],
    media_index: 0,
    files:[],
    savedFile:"",
    msg:"",
    src: 'https://raw.githubusercontent.com/xueweiguo/alarmmap/master/ringtones/store_03'
  },

  //事件处理函数
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
  },

  bindTypeChange: function (e) {
    console.log('editaction.js::bindTypeChange: ' + e.detail.value)
    this.setData({
      type_index: e.detail.value
    })
    var that = this
 
    var Urls = ['https://raw.githubusercontent.com/xueweiguo/alarmmap/master/ringtones/store_01',
      'https://raw.githubusercontent.com/xueweiguo/alarmmap/master/ringtones/store_04',
      'https://raw.githubusercontent.com/xueweiguo/alarmmap/master/ringtones/store_06']
    var fileUrl = Urls[e.detail.value];
    wx.downloadFile({
      url: fileUrl,
      success: function (res) {
        wx.playVoice({
          filePath: res.tempFilePath
        })
      }
    })
  },

  bindTimerChange: function (e) {
    console.log('editaction.js::bindTimerChange: ' + e.detail.value)
    this.setData({
      timer_index: e.detail.value
    })
    this.audioCtx.play()
  },

  bindMediaChange: function (e) {
    console.log('editaction.js::bindMediaChange: ' + e.detail.value)
    this.setData({
      media_index: e.detail.value
    })
  },


  backButtonTaped: function () {
    console.log("editaction.js::backButtonTaped")
    wx.navigateBack(1)
  },

  okButtonTaped: function () {
    console.log("editaction.js::okButtonTaped")
    wx.navigateTo({
      url: '../index/index'
    })
  },

  cancelButtonTaped: function () {
    console.log("editaction.js::calcelButtonTaped")
    wx.navigateBack(2)
  },

  onLoad: function () {
    var that = this
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
     
    wx.getSavedFileList({
      success: function (res) {
        console.log(res.fileList)
        that.setData({
          files:res.fileList
        })
      }
    })
  }
})

