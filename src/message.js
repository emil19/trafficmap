import L from 'leaflet';
import mustache from 'mustache';

// html template from raw loader.
import popupTemplate from './templates/popup.mustache';

export const priorityMap = {
  1: 'Mycket allvarlig händelse',
  2: 'Stor händelse',
  3: 'Störning',
  4: 'Information',
  5: 'Mindre störning'
};

export const categoryMap = {
  0: 'Vägtrafik',
  1: 'Kollektivtrafik',
  2: 'Planerad störning',
  3: 'Övrigt'
};

export default class Message {
  constructor(data) {
    this.lat = data.lat;
    this.lng = data.lng;
    this.title = data.title;
    this.priority = data.priority;
    this.description = data.description;
    this.location = data.location;
    this.category = data.category;
    this.subcategory = data.subcategory;
    this.reportedTime = data.reportedTime;
  }

  createMarker() {
    const markerOptions = {
      color: `hsl(${(this.priority - 1) * 15}, 100%, 50%)`,
      radius: Math.sqrt(6 - this.priority) * 8,
      weight: 2
    };

    const templateData = {
      title: this.title,
      description: this.description,
      location: this.location,
      reportedTime: this.reportedTime.toLocaleString('sv'),
      priorityString: priorityMap[this.priority],
      categoryString: categoryMap[this.category],
      subcategory: this.subcategory
    };

    const popupHtml = mustache.render(popupTemplate, templateData);

    this.marker = L.circleMarker([this.lat, this.lng], markerOptions).bindPopup(popupHtml);

    return this.marker;
  }

  removeMarker() {
    if (this.marker) this.marker.remove();
    this.marker = null;
  }

  includesString(str) {
    return [
      this.title,
      this.description,
      this.location,
      priorityMap[this.priority],
      categoryMap[this.category],
      this.subcategory,
      this.reportedTime.toLocaleString('sv')
    ]
      .some(propertyVal => propertyVal.toString().toLowerCase().includes(str.toLowerCase()));

  }
}
