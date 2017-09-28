//logs.js
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },

  onLoad:function(){
    this.setData({logs:app.globalData.logs.map(function(x){
        var timestr = x.time.getHours() + ':' + x.time.getMinutes() + ':' + x.time.getSeconds();
        return timestr + ' ' + x.message
      })
    })
  }
})
