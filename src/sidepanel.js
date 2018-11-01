import L from 'leaflet';
import mustache from 'mustache';

import { priorityMap, categoryMap } from './message';

import sidepanelTemplate from './templates/sidepanel.mustache';

export default class Sidepanel extends L.Control {
  constructor(options, controller) {
    super(options);
    this.controller = controller;

    this.filters = {
      priority: {
        default: '',
        comparator: (value, message) => value === message.priority.toString()
      },
      category: {
        default: '',
        comparator: (value, message) => value === message.category.toString()
      },
      search: {
        default: '',
        comparator: (value, message) => message.includesString(value)
      }
    };

    this.filterValues = Object.assign(...Object.entries(this.filters).map(([key, value]) => ({ [key]: value.default })));
  }

  onAdd(map) {
    this.div = L.DomUtil.create('aside');

    const templateData = {
      priority: Object.entries(priorityMap).map(([key, value]) => ({
        value: key,
        text: value
      })),
      category: Object.entries(categoryMap).map(([key, value]) => ({
        value: key,
        text: value
      }))
    };

    this.div.innerHTML = mustache.render(sidepanelTemplate, templateData);
    this.div.classList.add('control-sidepanel', 'leaflet-bar');

    ['priority', 'category', 'search'].forEach((e) => {
      this.div.querySelector(`[name="${e}"]`).onchange = (event) => {
        this.filterValues = { ...this.filterValues, [e]: event.target.value };
        this.applyFilters();
      };
    });

    return this.div;
  }

  onRemove(map) {

  }

  applyFilters() {
    console.log(this.filterValues);
    this.controller.filter(message => (
      Object.entries(this.filters).every(([key, value]) => (
        this.filterValues[key] === '' || value.comparator(this.filterValues[key], message)
      ))
    ));
  }
}
