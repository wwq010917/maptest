const county = 'Tippecanoe County, IN';
const limit = 1;
const accessToken = 'pk.eyJ1Ijoid3dxMDEwOTE3IiwiYSI6ImNsYXIxYjFocjAwNHozdnFxbDlkN2l3anEifQ.cVluyRrnbcBLDZoJMOGysQ';

fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${county}.json?limit=${limit}&access_token=${accessToken}`)
  .then((response) => response.json())
  .then((data) => {
    if (data && data.features && data.features.length > 0) {
      const feature = data.features[0];
      const bbox = feature.bbox;
      console.log(feature); // [westLng, southLat, eastLng, northLat]
    }
  });
 
const query = `
[out:json][timeout:25];
area[name="${county}"]->.a;
(node(area.a);<;);
out body;
`;

const overpassUrl = `https://overpass-api.de/api/interpreter?data=${query}`;

fetch(overpassUrl)
  .then(response => response.json())
  .then(data => {
    const bbox = data.elements[0].bounds;
    console.log(bbox);
  })
  .catch(error => {
    console.log(error);
  });
  //-87.112191, 40.367275, -86.801967, 40.57759
/*
const lng = -86.90807;
const lat = 40.42587;
const limit = 1;
const accessToken = 'pk.eyJ1Ijoid3dxMDEwOTE3IiwiYSI6ImNsYXIxYjFocjAwNHozdnFxbDlkN2l3anEifQ.cVluyRrnbcBLDZoJMOGysQ';

fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?limit=${limit}&access_token=${accessToken}`)
  .then((response) => response.json())
  .then((data) => {
    if (data && data.features && data.features.length > 0) {
      const feature = data.features[0];
      const bbox = feature.bbox;
      console.log(feature)
     // console.log(bbox); // [westLng, southLat, eastLng, northLat]
      console.log(feature.place_type); // ['place']
      console.log(feature.text); // 'San Francisco, California, United States'
    }
  });
  */