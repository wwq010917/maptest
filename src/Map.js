import mapboxgl from "mapbox-gl";
import ColorPanel from './color.js'
import React, { useEffect, useRef,useState } from "react";
import "./Map.css";



mapboxgl.accessToken =
  "pk.eyJ1Ijoid3dxMDEwOTE3IiwiYSI6ImNsYXIxYjFocjAwNHozdnFxbDlkN2l3anEifQ.cVluyRrnbcBLDZoJMOGysQ";

var iter
let layer7;
var color = 'red'


const Map = () => {


  const handleColorChange = (selectedColor) => {
    console.log(selectedColor)
    color = selectedColor
    console.log(color)
  };

  const mapContainerRef = useRef(null);


  var origin = [-86.945623, 40.470332];

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/wwq010917/clcd19za9008f14qqtna3k281",
      center: origin,
      zoom: 22, // starting zoom
    });
    map.on("load",  () => {
      
      const layers = map.getStyle().layers;
      console.log(layers);
      for (const layer of layers) {
      if (layer.id === 'test7') {
        layer7 = layer;
      break;
      }
      }
      console.log(layer7)
      map.addSource('polygons', {
        type: 'vector',
        url: 'mapbox://wwq010917.test3',
      });
      map.addControl(new mapboxgl.NavigationControl());
  
    });
    map.on('click', function(e) {
      console.log(color)
      var features = map.queryRenderedFeatures(e.point, { layers: ['test7'] });
      if (!features.length) {
      return;
      }
      const clickedPolygon = features[0]
      console.log(clickedPolygon.id)
      map.setPaintProperty("test7", "fill-color", [
        "case",
        ["!=", ["feature-state", "fillColor"], null],
        ["feature-state", "fillColor"],
        "white",
        
      ]);
      map.setFeatureState(
        { source: "composite", sourceLayer: "test7", id: clickedPolygon.id }, { fillColor: color });
      });

    
    // Clean up on unmount
    return () => map.remove();
  }, []);

  return (
    <div>
       <div className=".color-panel">
        <ColorPanel onColorChange={handleColorChange} />
      </div>
      <div className="map-container" ref={mapContainerRef} />
      
    </div>
  );
};

export default Map;