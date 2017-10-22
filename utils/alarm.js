//alarm.js:

const util = require('./util.js')
const voiceplayer = require('./voiceplayer.js')

const CHECK_BUFFER_SIZE = 3

const DISTANCE_OUTER = 500
const DISTANCE_INNER = 50

const SUSPEND = 'suspend'
const READY = 'ready'
const ARMED = 'armed'
const FIRED = 'fired'
const ACCEPTED = 'accepted'

const ENTER_ALARM = "接近监控点"
const LEAVE_ALARM = "离开监控点"

//构造函数
function Alarm(data){
  this.latitude = data.latitude
  this.longitude = data.longitude
  this.state = SUSPEND
  this.checkBuffer = []
  this.title = data.title
  this.monitor_type = data.monitor_type
  this.action_type = data.action_type
  this.media_url = data.media_url
  this.timer = data.timer
  this.distance = -1
  this.playCounter = 0
  this.testIndex = 0;
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

  setState: function(_state){
    const app = getApp()
    this.state = _state
    this.checkBuffer.length = 0
    if(_state == FIRED){
      this.playCounter = 0;
    }
    else if(_state == SUSPEND){
      this.distance = -1
    }
    app.addLog(this.title + ',' + this.state)
  },

  getState: function(){
    return this.state;
  },

  isActive: function(){
    return (this.state == READY
      || this.state == ARMED)
  },

  accept: function(){
    this.setState(ACCEPTED)  
  },

  suspend: function () {
    this.setState(SUSPEND)
  },

  resume: function () {
    this.setState(READY)
  },

  getStatus: function(){
    var status = undefined
    
    if(this.monitor_type == ENTER_ALARM){
      status = 'enter,'
    }else{
      status = 'leave,'
    }
    
    if(this.distance != -1){
      status += this.distance.toFixed(0)
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
    /*
    var test = 
    [800, 700, 600, 500, 400, 300, 200, 100, 
    90, 80, 70, 60, 50, 40, 52, 43, 53, 81, 101, 
    201, 301, 401, 501, 502, 403, 304, 204, 105, 
    96, 87, 78, 69, 50, 41, 42, 43, 54, 89, 100, 
    110, 123, 145, 156]
    if(this.testIndex < test.length){
      return test[this.testIndex++]
    }else{
      return 0
    }
    */
    return util.getDistance(this.latitude, this.longitude, latitude, longitude)
  },

  checkLocation: function (latitude, longitude, accuracy) {
    const app = getApp()
    var that = this;
    
    this.distance = this.getDistance(latitude, longitude)
    //app.addLog(distance + "," + accuracy)

    if (this.checkBuffer.length > CHECK_BUFFER_SIZE) {
      this.checkBuffer.shift()
    }

    var sum = 0;
    that.checkBuffer.forEach(function (value) {sum += value})

    //app.addLog(sum)
    if (this.monitor_type == ENTER_ALARM){
      this.enterAlarmCheck(this.distance, accuracy);
    } else {
      this.leaveAlarmCheck(this.distance, accuracy);
    }
  },

  enterAlarmCheck: function (distance, accuracy){
    if (this.state == READY) {
      if (distance < DISTANCE_OUTER) {
        this.checkBuffer.push(1)
      } else {
        this.checkBuffer.push(-1)
      }
      if (this.checkBuffer.length > CHECK_BUFFER_SIZE){
        this.checkBuffer.shift()
      }
      var sum = this.checkBuffer.reduce(function(x,y){return x + y}, 0)
      if (sum == CHECK_BUFFER_SIZE) {
        this.setState(ARMED)
      }
    } else if (this.state == ARMED) {
      //100m
      if (distance < DISTANCE_INNER) {
        this.checkBuffer.push(1)
      } else if (distance > DISTANCE_OUTER) {
        this.checkBuffer.push(-1)
      }
      if (this.checkBuffer.length > CHECK_BUFFER_SIZE) {
        this.checkBuffer.shift()
      }
      var sum = this.checkBuffer.reduce(function (x, y) { return x + y }, 0)
      if (sum == CHECK_BUFFER_SIZE) {
        this.setState(FIRED)
      }else if (sum == -CHECK_BUFFER_SIZE) {
        this.setState(READY)
      }
    } else if (this.state == FIRED){ //fired
      this.checkBuffer.push(1)
      if(this.checkBuffer.length == 10){
        this.setState(ACCEPTED)
      }
    } else{
      if (distance > DISTANCE_INNER) {
        this.checkBuffer.push(1)
      } else {
        this.checkBuffer.push(-1)
      }
      if (this.checkBuffer.length > CHECK_BUFFER_SIZE) {
        this.checkBuffer.shift()
      }
      var sum = this.checkBuffer.reduce(function (x, y) { return x + y }, 0)
      if (sum == CHECK_BUFFER_SIZE) {
        this.setState(READY)
      }
    }
  },

  leaveAlarmCheck: function (distance, accuracy){
    //app.addLog('离开监控点')
    if (this.state == READY) {
      //100m
      if (distance < DISTANCE_INNER) {
        this.setState(ARMED)
      }
    } else if (this.state == ARMED) {
       if (distance > DISTANCE_INNER) {
        this.checkBuffer.push(1)
      } else {
        this.checkBuffer.push(-1)
      }
      if (this.checkBuffer.length > CHECK_BUFFER_SIZE) {
        this.checkBuffer.shift()
      }
      var sum = this.checkBuffer.reduce(function (x, y) { return x + y }, 0)
      if (sum == CHECK_BUFFER_SIZE) {
        this.setState(FIRED)
      } 
    } else if (this.state == FIRED) { //fired
      this.checkBuffer.push(1)
      if (this.checkBuffer.length == 10) {
        this.setState(ACCEPTED)
      }
    } else {
      if (distance < DISTANCE_INNER) {
        this.checkBuffer.push(1)
      } else {
        this.checkBuffer.push(-1)
      }
      if (this.checkBuffer.length > CHECK_BUFFER_SIZE) {
        this.checkBuffer.shift()
      }
      var sum = this.checkBuffer.reduce(function (x, y) { return x + y }, 0)
      if (sum == CHECK_BUFFER_SIZE) {
        this.setState(READY)
      }
    }
  },

  executeAction: function () {
    const app = getApp()
    voiceplayer.play(this.media_url) 
    if (++this.playCounter == 10){
      this.setState("accepted")
    }
    //console.log("this.playCounter = " + this.playCounter)
  },
};

module.exports = {
  Alarm:Alarm,
}



