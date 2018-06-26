import L from 'leaflet';
import axios from 'axios';

const map = L.map('map-container').setView([63, 16], 5);

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 18
}).addTo(map);


const priorityMap = {
  1: 'Mycket allvarlig händelse',
  2: 'Stor händelse',
  3: 'Störning',
  4: 'Information',
  5: 'Mindre störning'
};

const categoryMap = {
  0: 'Vägtrafik',
  1: 'Kollektivtrafik',
  2: 'Planerad störning',
  3: 'Övrigt'
};

axios.get('https://api.sr.se/api/v2/traffic/messages?pagination=false&format=json')
  .then((res) => {
    const { messages } = res.data;

    messages.forEach((message) => {
      const {
        longitude, latitude, title, priority, description, exactlocation, category, subcategory, createddate
      } = message;

      const options = {
        color: `hsl(${(priority - 1) * 15}, 100%, 50%)`,
        radius: (5 - priority) * 3 + 8
      };

      // TODO: include date somehow
      const popupMarkup = `
      <h3>${title}</h3>
      <dl>
        <dt>Beskrivning</dt>    
        <dd>${description}</dd>
        <dt>Plats</dt>
        <dd>${exactlocation}</dd>
        <dt>Prioritet</dt>
        <dd>${priorityMap[priority]}</dd>
        <dt>Kategori</dt>
        <dd>${categoryMap[category]} - ${subcategory}</dd>
      </dl>`;

      L.circleMarker([latitude, longitude], options)
        .bindPopup(popupMarkup)
        .addTo(map);
    });
  })
  .catch(console.error);
