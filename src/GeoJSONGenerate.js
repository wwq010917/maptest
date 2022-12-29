const SphericalMercator = require("@mapbox/sphericalmercator");
const merc = new SphericalMercator({
  size: 256,
  antimeridian: true,
});
var features = [];
var origin = [-86.945623, 40.470332];
var count = 0;
for (var i = 0; i < 50; i++) {
  for (var j = 0; j < 50; j++) {
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
      properties: { color: "#" + Math.floor(Math.random() * 16777215).toString(16), owner: "" },
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

// Write the string to a file
fs.writeFileSync('polygons.geojson', geojsonString);
