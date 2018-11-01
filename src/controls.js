import L from 'leaflet';
import mustache from 'mustache';

import controlsTemplate from './templates/controls.mustache';

export default class Controls extends L.Control {
  constructor(options, controller) {
    super(options);
    this.controller = controller;
  }

  onAdd(map) {
    this.map = map;

    this.div = L.DomUtil.create('aside');

    this.div.innerHTML = mustache.render(controlsTemplate);
    this.div.classList.add('control-controls', 'leaflet-bar');

    this.refreshButton = this.div.querySelector('#controls-refresh');
    L.DomEvent.on(this.refreshButton, 'onclick', this.refresh);

    this.zoomInButton = this.div.querySelector('#controls-zoom-in');
    L.DomEvent.on(this.zoomInButton, 'onclick', this.zoomIn);

    this.zoomOutButton = this.div.querySelector('#controls-zoom-out');
    L.DomEvent.on(this.zoomOutButton, 'onclick', this.zoomOut);

    return this.div;
  }

  onRemove(map) {
    this.map = null;

    L.DomEvent.off(this.refreshButton, 'onclick', this.refresh);
    L.DomEvent.off(this.zoomInButton, 'onclick', this.zoomIn);
    L.DomEvent.off(this.zoomOutButton, 'onclick', this.zoomOut);
  }

  refresh() {
    this.controller.refresh();
  }

  zoomIn() {
    if (this.map) this.map.zoomIn();
  }

  zoomOut() {
    if (this.map) this.map.zoomOut();
  }
}
