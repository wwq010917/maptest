const ogr2ogr = require('ogr2ogr').default
// Using ECMAScript modules or Typescript

// Promise API
(async() {
  // Convert path to GeoJSON.
  let {data} = await ogr2ogr('/path/to/spatial/file')
  console.log(data)

  // Convert GeoJSON object to ESRI Shapefile stream.
  let {stream} = await ogr2ogr(data, {format: 'ESRI Shapefile'})

  // Convert ESRI Shapefile stream to KML text.
  let {text} = await ogr2ogr(stream, {format: 'KML'})
  console.log(text)
})

