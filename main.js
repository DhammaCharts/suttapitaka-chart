import './style.css';
import {Map, View, Overlay, Feature} from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Point from 'ol/geom/Point';
import Proj from 'ol/proj/Projection';
import {TileImage, Vector} from 'ol/source';
import {getCenter} from 'ol/extent';
import {platformModifierKeyOnly} from 'ol/events/condition';
import {Stroke, Fill, Style, Circle} from 'ol/style';
import {DragRotate, defaults as defaultInteractions} from 'ol/interaction';
import {FullScreen, defaults as defaultControls} from 'ol/control';

import dataJSON from './data.json'

// detect device for marker size //

const deviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    }
    else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "mobile";
    }
    return "desktop";
};

// create a SVG that is the same dimension as in D3.js (?)

const width = 4095;
const height = 4095;

const extent = [0, 0, width, height];
const projection = new Proj({
  code: 'pixels',
  units: 'pixels',
  extent: extent,
});

// popup behaviour

const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

const overlay = new Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

 // Add a click handler to hide the popup.
 // @return {boolean} Don't follow the href.

closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

// create map //


const map = new Map({
  // pixelRatio: 1,
  // pixelRatio: Math.max(2, ol.has.DEVICE_PIXEL_RATIO),
  layers: [
    new TileLayer({
      preload: Infinity,
      extent: extent,
      source: new TileImage({
        url: './maptiles/{z}/{y}/{x}.png',
      })
    })
  ],
  overlays: [overlay],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
  target: 'map',
  view: new View({
    projection: projection,
    center: getCenter(extent),
    zoom: 2,
    maxZoom: 6
  }),

  // controls: defaultControls().extend([new FullScreen()]),

  // use ctrl/cmd + drag for rotation //
  interactions: defaultInteractions({altShiftDragRotate: false}).extend([new DragRotate({condition: platformModifierKeyOnly})]),

});

// add marker layer //

var vectorLayer = new VectorLayer({
    source: new Vector(),
    style: new Style({
        image: new Circle({
          fill: new Fill({color: "rgba(0, 0, 0, 0)"}),
          // stroke: new Stroke({color: 'black', width: 0.3}), // for debug
          // radius : 8
          radius : deviceType() == "desktop" ? 8 : 10 // help cliquing on mobile.
        })
    })
});
map.addLayer(vectorLayer);

// add marker to map //

let data;
  try {
  data  = JSON.parse(dataJSON);
  } catch(e) {
  data = dataJSON;
  }


for (let i = 0; i < data.length; i++) {
    vectorLayer.getSource().addFeature(new Feature({
        geometry: new Point([data[i].x,data[i].y]),
        id : data[i].id,
        color : data[i].color,
        name : data[i].name,
        nameEn : data[i].nameEn
    }))
}

map.on("pointermove", function (e) {

    // pointer

    var hit = this.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
        return true;
    });
    if (hit) {
        this.getTargetElement().style.cursor = 'pointer';
        this.getTargetElement().style.fill = 'black';
    } else {
        this.getTargetElement().style.cursor = '';
        this.getTargetElement().style.fill = '';
    }
});

map.on('singleclick', function (event) {

    if (map.hasFeatureAtPixel(event.pixel) === true) {
        var coordinate = event.coordinate;
        const dataMap = map.getFeaturesAtPixel(event.pixel)[0].values_;

        // Using data.JSON

        const linkData = '<a style="font-family:sans-serif; text-decoration: none; color: '+dataMap.color+'" target="_blank" href="https://suttacentral.net/' + dataMap.id + '">' + dataMap.nameEn + '&emsp;</a>';
        content.innerHTML = linkData
        overlay.setPosition(coordinate);

        // Start SuttaPlex API for english titles

        // GET Request.
        // fetch('https://suttacentral.net/api/suttaplex/'+dataMap.id,{
        //         method: "GET",
        //         headers: {"Content-type": "application/json;charset=UTF-8"}
        //       }
        //     )
        //     // Handle success
        //     .then(response => response.json())  // convert to json
        //     .then(json => {
        //       const linkData = '<a style="font-family:sans-serif; text-decoration: none; color: '+dataMap.color+'" target="_blank" href="https://suttacentral.net/' + dataMap.id + '"> Data : ' + dataMap.nameEn + '&emsp;</a>';
        //       const linkAPI = '<a style="font-family:sans-serif; text-decoration: none; color: '+dataMap.color+'" target="_blank" href="https://suttacentral.net/api/suttaplex/'+dataMap.id+'"> API : ' + json[0].translated_title + '&emsp;</a>';
        //       content.innerHTML = linkData + '<br>' + linkAPI;
        //       overlay.setPosition(coordinate);
        //     })
        //     .catch(err => {
        //       console.log('Request Failed', err); //error details will be in the "err" object
        //       content.innerHTML = '<a style="font-family:sans-serif; text-decoration: none; color: '+dataMap.color+'" target="_blank" href="https://suttacentral.net/' + dataMap.id + '"> Data : ' + dataMap.nameEn + '&emsp;</a><br>' + "API :" + err + ' at: https://suttacentral.net/api/suttaplex/'+dataMap.id;
        //       overlay.setPosition(coordinate);
        //     }); // Catch errors

      // End Suttaplex API
    } else {
        overlay.setPosition(undefined);
        closer.blur();
    }
});
