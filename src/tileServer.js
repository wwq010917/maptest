var express = require("express");
var http = require("http");
var app = express();
var tilelive = require("@mapbox/tilelive");
var TileliveDecorator = require("tilelive-decorator");
var VectorTile = require("@mapbox/vector-tile").VectorTile;
var Protobuf = require("pbf");
var Decorator = require("@mapbox/tile-decorator");
TileliveDecorator.registerProtocols(tilelive);
require("@mapbox/mbtiles").registerProtocols(tilelive);
var zlib = require("zlib");
//Depending on the OS the path might need to be 'mbtiles:///' on OS X and linux

tilelive.load("mbtiles:./compressed12.mbtiles", function (err, source) {
  if (err) {
    throw err;
  }
  app.set("port", 7777);

  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  app.get(/^\/v2\/tiles\/(\d+)\/(\d+)\/(\d+).pbf$/, function (req, res) {
    var z = req.params[0];
    var x = req.params[1];
    var y = req.params[2];

    console.log("get tile %d, %d, %d", z, x, y);

    source.getTile(z, x, y, function (err, tile, headers) {
      if (err) {
        res.status(404);
        res.send(err.message);
        console.log(err.message);
      } else {
        res.set(headers);
        //console.log(tile);
        console.log("tile is ");
        console.log(tile);
        zlib.gunzip(tile, function (err, tile) {
          var pbf = new Protobuf(tile);
          //console.log(pbf);
          var tile = Decorator.read(pbf.buf);
          var layer = tile.layers[0];
          console.log(tile.layers[1]);
          console.time("get keys");
          var ids = Decorator.getLayerValues(layer, "id");
          //console.log(ids);

          var ids = Decorator.getLayerValues(layer, "id");
          //datbase
          var newProps = ids.map(function () {
            return { color: "bs" };
          });
          var keys = ["id"];
          Decorator.selectLayerKeys(layer, keys);
          console.time("decorate");
          Decorator.updateLayerProperties(layer, newProps);
          console.timeEnd("decorate");
          console.time("merge");
          var numFeatures = layer.features.length;
          console.log(numFeatures);
          Decorator.mergeLayer(layer);
          // console.log(Decorator.read(newBuf).layers[0].features);
          //console.log(tile);
          // console.log(tile.layers[0]);
          // Decorator.updateLayerProperties(tile.layers[0], props);
          // Decorator.selectLayerKeys(tile.layers[0], ["type", "foo"]);
          // Decorator.mergeLayer(tile.layers[0]);
          //console.log(newBuf.buffer);
          //  res.send(newBuf.buffer)
          //res.send(buffer);
          // console.log(Decorator.read(newBuf.buffer).layers[0]);
          var callback;
          var final = Decorator.write(tile);
          console.log(Decorator.read(final).layers[0].keys);
          zlib.gzip(new Buffer(final), (error, data) => {
            if (!error) {
              // convert to base64
              console.log();
              console.log("sending data");
              console.log(data);
              //res.send(data);
            }
          });

          // console.log(pbf.finish(newBuf);
          // console.log(tile.layers[0].features[0]);
          //console.log(ids);
          //res.send(newBuf);
          //Decorator.updateLayerProperties(layer, newProps);
          //console.log(ids);
          //var tiles = new VectorTile();
          // res.send(pbf);
          // console.log(tiles.layers.polygons.feature(1));
        });
        //res.send(tile);
      }
    });
  });

  http.createServer(app).listen(app.get("port"), function () {
    console.log("Express server listening on port " + app.get("port"));
  });
});
