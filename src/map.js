import L from 'leaflet';
import axios from 'axios';
import mustache from 'mustache';

import Sidepanel from './sidepanel';
import Controls from './controls';
import Message from './message';

// html template from raw loader.
import popupTemplate from './templates/popup.mustache';

// should cache the parsed template for future renders.
mustache.parse(popupTemplate);

export default class Map {
  constructor(options = {}) {
    // set default options for unassigned values
    this.options = Object.assign({
      tileLayer: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
      apiEndpoint: 'https://api.sr.se/api/v2/traffic/messages?pagination=false&format=json'
    }, options);

    // init map
    this.map = L.map('map-container', { zoomControl: false }).setView([63, 16], 5);

    // init map tiles
    L.tileLayer(
      this.options.tileLayer,
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }
    ).addTo(this.map);

    // create a controller for the map
    this.controller = {
      refresh: this.updateData.bind(this),
      filter: this.filter.bind(this)
    };

    // init custom sidepanel
    new Sidepanel({ position: 'topright' }, this.controller).addTo(this.map);

    // init custom controls
    new Controls({ position: 'topleft' }, this.controller).addTo(this.map);

    // init traffic messages object
    this.messages = {};

    // update data
    this.updateData();
  }

  updateData() {
    axios.get(this.options.apiEndpoint)
      .then((res) => {
        const { messages } = res.data;

        this.removeMarkers();

        messages.forEach((m) => {
          const message = new Message({
            lat: m.latitude,
            lng: m.longitude,
            title: m.title,
            priority: m.priority,
            description: m.description,
            location: m.exactlocation,
            category: m.category,
            subcategory: m.subcategory,
            reportedTime: new Date(parseInt(m.createddate.substr(6), 10))
          });

          this.messages = { ...this.messages, [m.id]: message };
        });

        this.addMarkers();
      })
      .catch(console.error);
  }

  filter(pred) {
    this.removeMarkers();
    Object.entries(this.messages).forEach(([, message]) => {
      if (pred(message)) message.createMarker().addTo(this.map);
    });
  }

  addMarkers() {
    Object.entries(this.messages).forEach(([, message]) => {
      message.createMarker().addTo(this.map);
    });
  }

  removeMarkers() {
    Object.entries(this.messages).forEach(([, message]) => {
      message.removeMarker();
    });
  }
}
