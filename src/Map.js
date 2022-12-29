import mapboxgl from "mapbox-gl";
import jsondata from './grid.geojson'
import React, { useEffect, useRef } from "react";

import SphericalMercator from "@mapbox/sphericalmercator";
import "./Map.css";

var source;


console.log(jsondata)


mapboxgl.accessToken =
  "pk.eyJ1Ijoid3dxMDEwOTE3IiwiYSI6ImNsYXIxYjFocjAwNHozdnFxbDlkN2l3anEifQ.cVluyRrnbcBLDZoJMOGysQ";

var iter

// Create a new SphericalMercator object
const merc = new SphericalMercator({
  size: 256,
  antimeridian: true,
});

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
      style: "mapbox://styles/wwq010917/clc17tdok002214qfpxm06uoc",
      center: origin,
      zoom: 15, // starting zoom
    });
    map.on("load",  () => {
 
      map.addSource('polygons', {
        type: 'vector',
        url: 'mapbox://wwq010917.9zvjdy8e',
      });
      
      
      map.addLayer({
        id: 'main',
        type: 'fill',
        source: 'polygons',
        'source-layer': 'polygons-dxcex8',
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
      if (!features.length) {
      return;
      }
      const clickedPolygon = features[0]
      console.log(clickedPolygon.id)
      map.setFeatureState({ source: 'polygons', sourceLayer: 'polygons-dxcex8', id: clickedPolygon.id }, { fillColor: 'red' });
      console.log()
      });
    // Clean up on unmount
    return () => map.remove();
  }, []);

  return <div className="map-container" ref={mapContainerRef} />;
};

export default Map;