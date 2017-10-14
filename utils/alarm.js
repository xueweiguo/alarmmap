//alarm.js:

const util = require('./util.js')
const voiceplayer = require('./voiceplayer.js')

const CHECK_BUFFER_SIZE = 3

//构造函数
function Alarm(data){
  this.latitude = data.latitude
  this.longitude = data.longitude
  this.state = "ready"
  this.checkBuffer = []
  this.title = data.title
  this.monitor_type = data.monitor_type
  this.action_type = data.action_type
  this.media_url = data.media_url
  this.timer = data.timer
}

//定义原型
Alarm.prototype ={
  constructor:Alarm,

  setTitle: function (t) {
    this.title = t
  },

  setMonitorType:function(m_type){
    this.monitor_type = m_type
  },

  setActionType: function (a_type) {
    this.action_type = a_type
  },

  setMedia: function (url) {
    this.media_url = url
  },

  setTimer: function(t_name) {
    this.timer = t_name
  },

  cancel: function(){
    this.state = 'ready'
    this.checkBuffer.length = 0
  },

  getStatus: function(location){
    var status = undefined
    if (this.monitor_type == '接近监控点') {
      status = "接近,"
    }else{
      status = "离开,"
    }
    
    if(location != undefined){
      status += this.getDistance(location.latitude, location.longitude).toFixed(0)
    }else{
      status += '?'
    }
    status += "m,"
    
    var sum = 0;
    this.checkBuffer.forEach(function (value) { sum += value })
    status += sum    
    status += ","

    status += this.state;
    return status
  },

  getDistance: function (latitude, longitude) {
    return util.getDistance(this.latitude, this.longitude, latitude, longitude)
  },

  checkLocation: function (latitude, longitude, accuracy) {
    const app = getApp()
    var that = this;
    var distance = this.getDistance(latitude, longitude)
    //app.addLog(distance + "," + accuracy)

    //50m
    if (distance < 50) {
      this.checkBuffer.push(1)
    } else {
      this.checkBuffer.push(-1)
    }

    if (this.checkBuffer.length > CHECK_BUFFER_SIZE) {
      this.checkBuffer.shift()
    }

    var sum = 0;
    that.checkBuffer.forEach(function (value) {sum += value})

    //app.addLog(sum)
    if (this.monitor_type == '接近监控点') {
      //app.addLog('接近监控点')
      if ((this.state == 'ready') || (this.state == 'fired')) {
        if (sum == -CHECK_BUFFER_SIZE) {
          this.state = 'armed'
        }
      } else if (this.state == 'armed') {
        if (sum == CHECK_BUFFER_SIZE) {
          this.state = 'fired'
        }
      }
    } else {
      //app.addLog('离开监控点')
      if ((this.state == 'ready') || (this.state == 'fired')) {
        if (sum == CHECK_BUFFER_SIZE) {
          this.state = 'armed'
        }
      } else if (this.state == 'armed') {
        if (sum == -CHECK_BUFFER_SIZE) {
          this.state = 'fired'
        }
      }      
    }
    /*
    if (this.checkBuffer.length == CHECK_BUFFER_SIZE){
        this.state = 'fired'
    }
    */
    
    //app.addLog(this.state)
  },

  executeAction: function () {
    const app = getApp()
    app.addLog('playVoice:' + this.media_url)
    voiceplayer.play(this.media_url) 
  },
};

module.exports = {
  Alarm:Alarm,
}



