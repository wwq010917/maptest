import mapboxgl from "mapbox-gl";
import ColorPanel from "./color.js";
import React, { useEffect, useRef, useState } from "react";
import "./Map.css";

mapboxgl.accessToken =
  "pk.eyJ1Ijoid3dxMDEwOTE3IiwiYSI6ImNsYXIxYjFocjAwNHozdnFxbDlkN2l3anEifQ.cVluyRrnbcBLDZoJMOGysQ";

var iter;
let layer7;
var color = "red";

const Map = () => {
  const handleColorChange = (selectedColor) => {
    console.log(selectedColor);
    color = selectedColor;
    console.log(color);
  };

  const mapContainerRef = useRef(null);

  var origin = [-86.945623, 40.470332];

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/wwq010917/clcd19za9008f14qqtna3k281",
      center: origin,
      zoom: 18, // starting zoom
      minZoom: 3,
    });
    map.on("load", () => {
      const layers = map.getStyle().layers;
      console.log(layers);
      for (const layer of layers) {
        if (layer.id === "tippecanoe4") {
          layer7 = layer;
          break;
        }
      }
      console.log(layer7);

      map.addControl(new mapboxgl.NavigationControl());
    });
    map.on("click", function (e) {
      var features = map.queryRenderedFeatures(e.point, {
        layers: ["tippecanoe4"],
      });
      if (!features.length) {
        return;
      }
      console.log(features);
      const clickedPolygon = features[0];
      console.log(clickedPolygon.id);

      map.setPaintProperty("tippecanoe4", "fill-color", [
        "case",
        ["!=", ["feature-state", "fillColor"], null],
        ["feature-state", "fillColor"],
        "#f8f8ff",
      ]);
      map.setPaintProperty("tippecanoe4", "fill-opacity", [
        "case",
        ["!=", ["feature-state", "fillOpacity"], null],
        ["feature-state", "fillOpacity"],
        0,
      ]);
      map.setFeatureState(
        {
          source: "composite",
          sourceLayer: "Tippecanoe4",
          id: clickedPolygon.id,
        },
        { fillColor: color, fillOpacity: 1 }
      );
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
