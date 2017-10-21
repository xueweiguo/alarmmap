var  EARTH_RADIUS  =  6378137.0;    //单位M  
var  PI  =  Math.PI;

function  getRad(d) {
  return  d * PI / 180.0;
}  

function getDistance(lat1, lng1, lat2, lng2) {
  var  radLat1  =  getRad(lat1);
  var  radLat2  =  getRad(lat2);
  var  a  =  radLat1  -  radLat2;
  var  b  =  getRad(lng1)  -  getRad(lng2);
  var  s  =  2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)  +  Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s  =  s * EARTH_RADIUS;
  s  =  Math.round(s * 10000) / 10000.0;
  return  s;
}  

function getLocation(callback) {
  //onsole.log('util.getLocation')
  wx.getLocation({
    type: 'gcj02', // 返回 可以 用于 wx. openLocation 的 经纬度 
    success: function( res ) {
      callback.success(res)
    }
  })
}

// 获取某个坐标的地址和周边的pois信息 
function getPoisByLocation(latitude, longitude, callback ) { 
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
  getLocation: getLocation,
  getPoisByLocation: getPoisByLocation,
  getDistance:getDistance,
}
