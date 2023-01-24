const SphericalMercator = require("@mapbox/sphericalmercator");
const merc = new SphericalMercator({
  size: 512,
  antimeridian: true,
});
const endpoint = [-86.69425383210182, 40.563148756166015];
const startpoint = [-87.09630623459816, 40.214223726606235];
const clickedPolygon = features[0];
const y = 1945;
const x = 1707;
const pendpoint = merc.px(endpoint, 22);
const pstartpoint = merc.px(startpoint, 22);
const samplepoint = [e.lngLat.lng, e.lngLat.lat];
const psamplepoint = merc.px(samplepoint, 22);
let xdiff = pendpoint[0] - pstartpoint[0];
let ydiff = pendpoint[1] - pstartpoint[1];
let samplexdiff = psamplepoint[0] - pstartpoint[0];
let sampleydiff = psamplepoint[1] - pstartpoint[1];

console.log(
  //data is xdiff/x and y diff / y
  Math.abs(Math.ceil(sampleydiff / 1405.0005858230813)) +
    Math.abs(Math.ceil(samplexdiff / 1405.0015424164524) - 1) * 1945
);
