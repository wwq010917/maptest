const SphericalMercator = require("@mapbox/sphericalmercator");
const merc = new SphericalMercator({
  size: 512,
  antimeridian: true,
});

const fs = require("fs");
let startstr = `{
  "type": "FeatureCollection",
  "features": [
    `;
let endstr = `
  ]
}`;
// Open the file for writing
var featureString;
fs.truncate("polygons.geojson", 0, (error) => {
  fs.open("polygons.geojson", "w", (error, fd) => {
    if (error) {
      console.error(error);
      return;
    }
    fs.appendFile(fd, startstr, (error) => {
      if (error) {
        console.error(error);
      }
    });
    // Start the loop to generate the features
    //[-87.096306,40.214224,-86.694305,40.563003]

    var features = [];
    var origin = [-87.096306, 40.214224];
    var count = 0;
    //2000*2000
    for (var i = 0; i < 2000; i++) {
      for (var j = 0; j < 2000; j++) {
        var pixelOrigin = merc.px(origin, 22);
        if (count == 0) {
          console.log(pixelOrigin);
        }
        //2810 == 40m
        const pixelDest1 = [pixelOrigin[0], pixelOrigin[1] - 1405];
        //(x,y)
        const pixelDest2 = [pixelOrigin[0] + 1405, pixelOrigin[1] - 1405];
        const pixelDest3 = [pixelOrigin[0] + 1405, pixelOrigin[1]];
        const cordDest1 = merc.ll(pixelDest1, 22);
        const cordDest2 = merc.ll(pixelDest2, 22);
        const cordDest3 = merc.ll(pixelDest3, 22);
        if (j == 0) {
          iter = cordDest3;
        }
        var coordinates = [[origin, cordDest1, cordDest2, cordDest3, origin]];
        var feature = {
          id: count,
          geometry: {
            type: "Polygon",
            coordinates: coordinates,
          },
          type: "Feature",
          properties: {
            id: count,
            color: "red",
          },
        };

        // Convert the feature to a string in GeoJSON format
        if (count != 200 * 200 - 1) {
          featureString = JSON.stringify(feature) + ",\n";
        } else {
          featureString = JSON.stringify(feature);
        }

        // Append the feature string to the file
        fs.appendFile(fd, featureString, (error) => {
          if (error) {
            console.error(error);
          }
        });

        origin = cordDest1;
        count++;
      }
      origin = iter;
    }
    fs.appendFile(fd, endstr, (error) => {
      if (error) {
        console.error(error);
      }
    });

    // Close the file when the loop is done
    fs.close(fd, (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Successfully written to polygons.geojson");
      }
    });
  });
});
