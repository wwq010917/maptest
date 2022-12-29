import mapboxgl from "mapbox-gl";
import jsondata from './grid.geojson'
import React, { useEffect, useRef } from "react";

import SphericalMercator from "@mapbox/sphericalmercator";
import "./Map.css";

var source;


const merc = new SphericalMercator({
  size: 512,
  antimeridian: true,
});
var features = [];
var origin = [-86.945623, 40.470332];
var count = 0;
for (var i = 0; i < 50; i++) {
  for (var j = 0; j < 50; j++) {
    var pixelOrigin = merc.px(origin, 22);
    const pixelDest1 = [pixelOrigin[0], pixelOrigin[1] - 725];
    const pixelDest2 = [pixelOrigin[0] + 725, pixelOrigin[1] - 725];
    const pixelDest3 = [pixelOrigin[0] + 725, pixelOrigin[1]];
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
      id:count,
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
const geojsonString = source.data;
console.log(geojsonString)




mapboxgl.accessToken =
  "pk.eyJ1Ijoid3dxMDEwOTE3IiwiYSI6ImNsYXIxYjFocjAwNHozdnFxbDlkN2l3anEifQ.cVluyRrnbcBLDZoJMOGysQ";

var iter

// Create a new SphericalMercator object


// Initialize the grid array


const Map = () => {
 
  const mapContainerRef = useRef(null);

  //Latitude: 40.424373, Longitude: -86.938912;
  //40.438338, -86.910677;
  //new dest -86.93891119211912,40.424372413678505
  // 40.470332, -86.945623;

  var origin = [-86.945623, 40.470332];

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: origin,
      zoom: 15, // starting zoom
    });
    map.on("load",  () => {
 
      map.addSource('polygons',source);
      
      
      map.addLayer({
        id: 'main',
        type: 'fill',
        source: 'polygons',
      
        paint: {
          'fill-color': [
            "case",
               ["==", ["feature-state", "fillColor"], null], "white",
               "red"
             ],
        
          'fill-outline-color':'black',
        },
      });

    });
    map.on('click', function(e) {
      var features = map.queryRenderedFeatures(e.point, { layers: ['main'] });
      console.log(features)
      if (!features.length) {
      return;
      }
      const clickedPolygon = features[0]
      console.log(clickedPolygon.id)
      map.setFeatureState({ source: 'polygons', id: clickedPolygon.id }, { fillColor: 'red' });
      console.log()
      });
    // Clean up on unmount    
    return () => map.remove();
  }, []);

  return <div className="map-container" ref={mapContainerRef} />;
};

export default Map;