import mapboxgl from "mapbox-gl";
import ColorPanel from "./color.js";
import React, { useEffect, useRef, useState } from "react";
import * as turf from "@turf/turf";
import "./Map.css";
const SphericalMercator = require("@mapbox/sphericalmercator");
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
  const [zoom, setZoom] = useState(18);
  var origin = [-86.945623, 40.470332];
  const ZoomPanel = () => {
    return <div className="zoom-panel">Zoom level: {zoom}</div>;
  };
  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/wwq010917/clcd19za9008f14qqtna3k281",
      center: origin,
      zoom: 18, // starting zoom
      minZoom: 3,
    });
    map.on("zoom", () => {
      setZoom(map.getZoom().toFixed(2));
    });
    map.on("load", () => {
      console.log(zoom);
      const layers = map.getStyle().layers;

      for (const layer of layers) {
        if (layer.id === "tippecanoe4") {
          layer7 = layer;
          break;
        }
      }

      map.addControl(new mapboxgl.NavigationControl());
    });
    map.on("click", function (e) {
      //this could be used to convert userlocation to pixelpoint
      const pixelpoint = map.project(e.lngLat);

      var features = map.queryRenderedFeatures(pixelpoint, {
        layers: ["tippecanoe4"],
      });
      if (!features.length) {
        return;
      }
      console.log(features);
      const clickedPolygon = features[0];
      console.log(clickedPolygon);

      if (map.getZoom() >= 16.5) {
        map.setFeatureState(
          {
            source: "composite",
            sourceLayer: "Tippecanoe4",
            id: clickedPolygon.id,
          },
          { fillColor: color, fillOpacity: 1 }
        );
      }
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
    });

    // Clean up on unmount
    return () => map.remove();
  }, []);

  return (
    <div>
      <ZoomPanel />
      <div className=".color-panel">
        <ColorPanel onColorChange={handleColorChange} />
      </div>
      <div className="map-container" ref={mapContainerRef} />
    </div>
  );
};

export default Map;
