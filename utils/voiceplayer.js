//voice player
function prepare(){
  var that = this
  var info_pair = wx.getStorageSync('url2FileMap') || [];
  this.urlMap = new Map();
  info_pair.forEach(function(pair){
    that.urlMap.set(pair.url, pair.file);
  });
}

function saveMap(){
  var info_pair = []
  this.urlMap.forEach(function(file, url, map){
    info_pair.push({url:url, file:file})
  });
  wx.setStorageSync('url2FileMap', info_pair);
}

  //播放铃声文件，优先使用缓存文件，根据需要下载。
  //var url = that.getRingtoneUrl(index)
function play(url) {
  const app = getApp()
  var that = this
  var savedFile = this.urlMap.get(url)
  if (savedFile != undefined) {
    //已经存在缓存文件，直接播放缓存文件
    app.addLog('播放缓存铃声')
    wx.playVoice({
      filePath: savedFile,
      fail: function () {
        //播放缓存文件失败，清除缓存文件信息
        that.urlMap.delete(url);
        that.saveMap();
        //下载并播放缓存文件
        that.downloadAndPlay(url)
      },
    })
  } else {
    //没有缓存文件，下载并播放
    app.addLog('that.downloadAndPlay')
    that.downloadAndPlay(url)
  }
}

  //下载，保存，播放铃声文件。
 function downloadAndPlay(url) {
   const app = getApp()
    var that = this
    that.downloadFile({
      url: url,
      success: function (savedFilePath) {
        app.addLog('saveFileSuccess')
        //下载成功，播放文件
        app.addLog('播放下载铃声')
        wx.playVoice({
          filePath: savedFilePath,
        })
        //更新缓存文件信息。
        that.urlMap.set(url,savedFilePath);
        that.saveMap();
      }
    })
  }

  //下载并保存文件
  function downloadFile(parameter) {
    const app = getApp()
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
  }

module.exports = {
  prepare: prepare,
  play: play,
  downloadAndPlay:downloadAndPlay,
  downloadFile:downloadFile,
  saveMap:saveMap
}