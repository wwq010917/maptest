import mapboxgl from "mapbox-gl";
import ColorPanel from "./color.js";
import React, { useEffect, useRef, useState } from "react";
import * as turf from "@turf/turf";
import "./Map.css";
const SphericalMercator = require("@mapbox/sphericalmercator");
mapboxgl.accessToken =
  "pk.eyJ1Ijoid3dxMDEwOTE3IiwiYSI6ImNsYXIxYjFocjAwNHozdnFxbDlkN2l3anEifQ.cVluyRrnbcBLDZoJMOGysQ";
const endpoint = [-86.69425383210182, 40.563148756166015];
const startpoint = [-87.09630623459816, 40.214223726606235];
var iter;
let layer7;
var color = "red";
var count = 0;
const merc = new SphericalMercator({
  size: 512,
  antimeridian: true,
});

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
      console.log(layers);
      for (const layer of layers) {
        if (layer.id === "tippecanoe4") {
          layer7 = layer;
          break;
        }
      }

      map.addControl(new mapboxgl.NavigationControl());
    });
    map.on("click", function (e) {
      console.log(e);
      //this could be used to convert userlocation to pixelpoint

      const pixelpoint = map.project(e.lngLat);

      var features = map.queryRenderedFeatures(pixelpoint, {
        layers: ["tippecanoe4"],
      });
      if (!features.length) {
        return;
      }

      const clickedPolygon = features[0];

      const y = 1945;
      const x = 1707;
      const pendpoint = merc.px(endpoint, 22);
      const pstartpoint = merc.px(startpoint, 22);
      const samplepoint = [e.lngLat.lng, e.lngLat.lat];
      const psamplepoint = merc.px(samplepoint, 22);
      let xdiff = pendpoint[0] - pstartpoint[0];
      let ydiff = pendpoint[1] - pstartpoint[1];
      let samplexdiff = psamplepoint[0] - pstartpoint[0];
      let sampleydiff = psamplepoint[1] - pstartpoint[1];

      console.log(
        //data is xdiff/x and y diff / y
        Math.abs(Math.ceil(sampleydiff / 1405.0005858230813)) +
          Math.abs(Math.ceil(samplexdiff / 1405.0015424164524) - 1) * 1945
      );

      console.log(clickedPolygon.id);
      //console.log((Math.ceil(samplexdiff / 1405.0015424164524) - 1) * 1945);
      if (
        clickedPolygon.id !=
        Math.abs(Math.ceil(sampleydiff / 1405.0005858230813)) +
          Math.abs(Math.ceil(samplexdiff / 1405.0015424164524) - 1) * 1945
      ) {
        count++;
        console.log(count);
      }
      const polygon = map.querySourceFeatures("composite", {
        sourceLayer: "Tippecanoe4",
      });

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
