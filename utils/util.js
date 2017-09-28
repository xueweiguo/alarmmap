function getLocationAndOpenMap(callback) {
  wx.getLocation({
    type: 'gcj02', // 返回 可以 用于 wx. openLocation 的 经纬度 
    success: function( res ) {
       callback(res.longitude, res.latitude)
    }
  })
}

// 获取某个坐标的地址和周边的pois信息 
function getPoisByLocation(longitude, latitude, callback ) { 
  // 具体json 返回格式可自行参考腾讯地图API接口文档
  var key = "M6VBZ-BPRHX-YPK45-7Q4GC-Z3F7T-7YFO7";  //需要到http://lbs.qq.com/申请
  var url = "https://apis.map.qq.com/ws/geocoder/v1/?location=" + latitude + "," + longitude + "&key="+ key+"&get_poi=1"; 
  var defaultUrl = "http://www.apayado.com/pois.json?" + new Date().getTime();
  wx.request( { 
    url: url, 
    success: function( res ) {
      callback(res.data.result);
    }, 
    fail: function (res) { 
      getDefaultPoiData(defaultUrl, function (res) {
        callback(res);
      });
    }
  });
}

module.exports = {
  getLocationAndOpenMap: getLocationAndOpenMap,
  getPoisByLocation: getPoisByLocation,
}
