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
  //var origin = [-86.945623, 40.470332];
  var origin = [-87.096306, 40.214224];
  const ZoomPanel = () => {
    return <div className="zoom-panel">Zoom level: {zoom}</div>;
  };
  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/wwq010917/cldhd91es001401omfcb4quyp",
      center: origin,
      zoom: 10, // starting zoom
      minZoom: 3,
    });
    map.on("zoom", () => {
      setZoom(map.getZoom().toFixed(2));
    });
    map.on("load", () => {
      map.addSource("polygonsource", {
        type: "vector",
        tiles: ["http://localhost:7777/v2/tiles/{z}/{x}/{y}.pbf"],
        minzoom: 0,
        maxzoom: 24,
      });

      map.addLayer({
        id: "polygons",
        type: "fill",
        source: "polygonsource",
        "source-layer": "polygons",
        paint: {
          "fill-color": ["match", ["get", "color"], "red", "green", "blue"],
          "fill-opacity": 1,
        },
      });
      const polygon = map.querySourceFeatures("polygons", {
        sourceLayer: "polygons",
      });
      console.log(polygon[0]);
      console.log(zoom);
      const sources = map.getSource("some id");
      const layers = map.getStyle().layers;
      console.log(sources);
      for (const layer of layers) {
        if (layer.id === "test2") {
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

      //console.log(requiredStatement);
      var features = map.queryRenderedFeatures(pixelpoint, {
        layers: ["polygons"],
      });
      console.log(features);
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
        Math.abs(Math.ceil(sampleydiff / 1405.0005858230813)) +
          Math.abs(Math.ceil(samplexdiff / 1405.0015424164524) - 1) * 1945
      );
      // console.log("id");
      console.log(clickedPolygon);
      //console.log((Math.ceil(samplexdiff / 1405.0015424164524) - 1) * 1945);
      if (
        clickedPolygon.id !=
        Math.abs(Math.ceil(sampleydiff / 1405.0005858230813)) +
          Math.abs(Math.ceil(samplexdiff / 1405.0015424164524) - 1) * 1945
      ) {
        count++;
        console.log(count);
      }

      if (map.getZoom() >= 16.5) {
        map.setFeatureState(
          {
            source: "polygons",
            sourceLayer: "polygons",
            id: clickedPolygon.id,
          },
          { fillColor: color, fillOpacity: 1 }
        );
      }
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
