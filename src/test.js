var fs = require("fs");
var path = require("path");
var test = require("tape").test;
var Decorator = require("@mapbox/tile-decorator");

var buf = fs.readFileSync(path.join(__dirname, "test.pbf"));
var decorated = fs.readFileSync(path.join(__dirname, "test-decorated.pbf"));

// Looks up for a feature's attribute
// See: mapbox/vector-tile-spec/tree/master/2.1#44-feature-attributes
function getAttribute(layer, feature, attribute) {
  // Check if attribute exists in layer
  var attributeKeyIndex = layer.keys.indexOf(attribute);
  if (attributeKeyIndex === -1) return null;

  // Scan feature's tags to find a matching key and return its value
  for (var i = 0, j = feature.tags.length; i < j; i += 2) {
    if (feature.tags[i] === attributeKeyIndex) {
      return layer.values[feature.tags[i + 1]];
    }
  }

  return null;
}

test("updateLayerProperties filtering half of the features", function (t) {
  var tile = Decorator.read(buf);
  var layer = tile.layers[0];
  console.log(layer.keys);
  // Check initial values
  var featureCount = layer.features.length;
  t.equal(featureCount, 10031);
  t.equal(getAttribute(layer, layer.features[0], "id"), 14869990);
  t.equal(getAttribute(layer, layer.features[1], "id"), 14869996);
  // Decorate with 50% of 'foo'
  var keys = ["id", "type"];
  var props = layer.features.map(function (feature, index) {
    return index % 2 === 1 ? { foo: "bar" } : { color: "red" };
  });
  Decorator.selectLayerKeys(layer, keys);
  Decorator.updateLayerProperties(layer, props);
  Decorator.mergeLayer(layer);
  var newBuf = Decorator.write(tile);
  console.log(Decorator.read(newBuf.buffer).layers[0]);
  // Filter some features

  var required = ["foo"];
  Decorator.filterLayerByKeys(layer, required);
  Decorator.selectLayerKeys(layer, keys);

  t.end();
});
