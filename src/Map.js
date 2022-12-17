import mapboxgl from "mapbox-gl";

import React, { useEffect, useRef } from "react";

import SphericalMercator from "@mapbox/sphericalmercator";
import "./Map.css";

mapboxgl.accessToken =
  "pk.eyJ1Ijoid3dxMDEwOTE3IiwiYSI6ImNsYXIxYjFocjAwNHozdnFxbDlkN2l3anEifQ.cVluyRrnbcBLDZoJMOGysQ";

const Map = () => {
  const mapContainerRef = useRef(null);
  var merc = new SphericalMercator({
    size: 256,
    antimeridian: true,
  });
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
      zoom: 22, // starting zoom
    });
    map.on("load", () => {
      // Add a data source containing GeoJSON data.
      var iter;
      var destination = [-86.872238, 40.46873];
      for (var i = 0; i < 20; i++) {
        for (var j = 0; j < 20; j++) {
          var pixelOrigin = merc.px(origin, 22);
          const pixelDest1 = [pixelOrigin[0], pixelOrigin[1] - 152];
          const pixelDest2 = [pixelOrigin[0] + 152, pixelOrigin[1] - 152];
          const pixelDest3 = [pixelOrigin[0] + 152, pixelOrigin[1]];
          const cordDest1 = merc.ll(pixelDest1, 22);
          const cordDest2 = merc.ll(pixelDest2, 22);
          const cordDest3 = merc.ll(pixelDest3, 22);
          if (j == 0) {
            iter = cordDest3;
          }
          map.addSource("x: " + i + "y: " + j, {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "Polygon",
                // These coordinates outline Maine.
                coordinates: [
                  [origin, cordDest1, cordDest2, cordDest3, origin],
                ],
              },
            },
          });
          origin = cordDest1;
          map.addLayer({
            id: "color x: " + i + "y: " + j,
            type: "fill",
            source: "x: " + i + "y: " + j, // reference the data source
            layout: {},
            paint: {
              "fill-color":
                "#" + Math.floor(Math.random() * 16777215).toString(16), // blue color fill
              "fill-opacity": 1,
            },
          });
          map.addLayer({
            id: "x: " + i + "y: " + j,
            type: "line",
            source: "x: " + i + "y: " + j,
            layout: {},
            paint: {
              "line-color": "#DAE3EE",
              "line-width": 4,
            },
          });
        }
        origin = iter;
      }

      // Add a black outline around the polygon.
    });

    // Clean up on unmount
    return () => map.remove();
  }, []);

  return <div className="map-container" ref={mapContainerRef} />;
};

export default Map;
