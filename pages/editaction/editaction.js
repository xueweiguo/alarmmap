//editaction.js
const util = require('../../utils/util.js')

Page({
  data: {
    alarms: [1, 2, 3],
    type_array: ['播放提示音', '启动定时器', '停止定时器'],
    type_index:0,
    timer_array: ['定时器1', '定时器2', '定时器3','定时器4'],
    timer_index: 0,
    media_array: ['提示音1', '提示音2', '提示音3'],
    media_index: 0,
    files:[],
    savedFile:"",
    msg:"",
    src: 'https://raw.githubusercontent.com/xueweiguo/alarmmap/master/ringtones/neusong.mp3'
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
    wx.downloadFile({
      url: 'https://raw.githubusercontent.com/xueweiguo/alarmmap/master/ringtones/neusong.mp3', //仅为示例，并非真实的资源
      success: function (res) {
        wx.playVoice({
          filePath: res.tempFilePath
        })
      }
    })
    //
    /*
    console.log(that.data.savedFile);
    //that.data.savedFile = "https://www.geocities.jp/weiguo_xue/ringtones/1.mp3"
    that.data.savedFile = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46'
    wx.playVoice({
      filePath: that.data.savedFile, 
      success: function () {
        that.setData({
          msg:"play success!"
        })
      },
      fail: function (res) {
        that.setData({
          msg: res.errMsg
        })         
      }
    })
    */
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
    }, 10000)

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

