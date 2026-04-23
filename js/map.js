/**
 * @param {string} containerId  — id dell'elemento HTML dove montare la mappa
 * @param {number} lat
 * @param {number} lng
 * @param {number} [zoom=14]
 */
export function initMap(containerId, lat, lng, zoom = 14) {
  if (typeof L === 'undefined') {
    console.error('[map] Leaflet non caricato. Aggiungi il CDN prima di questo modulo.');
    return;
  }

  const map = L.map(containerId, {
    center: [lat, lng],
    zoom,
    scrollWheelZoom: false,
    zoomControl: true,
  });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const icon = L.divIcon({
    className: '',
    html: `<div style="
      width:36px; height:36px; border-radius:50% 50% 50% 0;
      background:#18E299; border:3px solid #ffffff;
      box-shadow:0 2px 8px rgba(0,0,0,0.25);
      transform:rotate(-45deg);
    "></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -38],
  });

  L.marker([lat, lng], { icon })
    .addTo(map)
    .bindPopup('<strong>Cascina Fontana</strong><br>Società Agricola S.S.')
    .openPopup();

  return map;
}
