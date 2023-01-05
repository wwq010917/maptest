const SphericalMercator = require("@mapbox/sphericalmercator");
const merc = new SphericalMercator({
  size: 512,
  antimeridian: true,
});
var features = [];
var origin = [-87.096306,40.214224];
//[-87.096306,40.214224,-86.694305,40.563003]
var count = 0;
for (var i = 0; i < 300; i++) {
  for (var j = 0; j < 300; j++) {
    var pixelOrigin = merc.px(origin, 22);
    const pixelDest1 = [pixelOrigin[0], pixelOrigin[1] - 1405.38];
    const pixelDest2 = [pixelOrigin[0] + 1405.38, pixelOrigin[1] - 1405.38];
    const pixelDest3 = [pixelOrigin[0] + 1405.38, pixelOrigin[1]];
    const cordDest1 = merc.ll(pixelDest1, 22);
    const cordDest2 = merc.ll(pixelDest2, 22);
    const cordDest3 = merc.ll(pixelDest3, 22);
    if (j == 0) {
      iter = cordDest3;
    }
    var coordinates = [[origin, cordDest1, cordDest2, cordDest3, origin],
    ];
   // function that returns a random owner
    
    var feature = {
      id: count,
      geometry: {
        type: "Polygon",
        coordinates: coordinates,
      },
      type: "Feature",
      properties:{}
    };
    features.push(feature);
    origin = cordDest1;
    count++;
  }
  origin = iter;
}
console.log(count)
var source = {
  type: "geojson",
  data: {
    type: "FeatureCollection",
    features: features,
  },
};
const fs = require('fs');

// Convert the source data to a string in GeoJSON format
const geojsonString = JSON.stringify(source.data);

// Write the string to a file asynchronously
fs.writeFile('polygons.geojson', geojsonString, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.log('Successfully written to polygons.geojson');
  }
});
