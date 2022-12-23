const SphericalMercator = require("@mapbox/sphericalmercator");

var origin = [-86.945623, 40.470332];
var iter;
var destination = [-86.872238, 40.46873];

var merc = new SphericalMercator({
  size: 256,
  antimeridian: true,
});

const grid = [];
for (var i = 0; i < 20; i++) {
  for (var j = 0; j < 20; j++) {
    var pixelOrigin = merc.px(origin, 22);
    const pixelDest1 = [pixelOrigin[0], pixelOrigin[1] - 152];
    const pixelDest2 = [pixelOrigin[0] + 152, pixelOrigin[1] - 152];
    const pixelDest3 = [pixelOrigin[0] + 152, pixelOrigin[1]];
    const cordDest1 = merc.ll(pixelDest1, 22);
    const cordDest2 = merc.ll(pixelDest2, 22);
    const cordDest3 = merc.ll(pixelDest3, 22);

    if (j == 0) {
      iter = cordDest3;
    }
    newBoxObj = {
      "geometry": {
        "type": "Polygon",
        "coordinates": [[origin, cordDest1, cordDest2, cordDest3, origin]],
      },
      "type": "Feature",
      "properties": {
        "fill": "#" + Math.floor(Math.random() * 16777215).toString(16),
        "fill-opacity": 0.5,
      },
    };

    grid.push(newBoxObj);
    origin = cordDest1;
  }
  origin = iter;
}

const fs = require("fs");

// create a JSON object

// convert JSON object to a string
const gridObj = {
  "type": "FeatureCollection",
  "features": grid,
};
const data = gridObj;

// write JSON string to a file
fs.writeFile("grid.geojson", data, (err) => {
  if (err) {
    throw err;
  }
  console.log("JSON data is saved.");
});
