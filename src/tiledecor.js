var TileliveDecorator = require("tilelive-decorator");

var uri =
  'decorator+s3://test/{z}/{x}/{y}?key=id&sourceProps={"keep":["id","name"]}&redis=redis://localhost:6379';
new TileliveDecorator(uri, function (err, source) {
  // source.getTile(z, x, y, callback);
});
