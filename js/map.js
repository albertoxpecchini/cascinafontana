/**
 * @param {string} containerId  — id dell'elemento HTML dove montare la mappa
 * @param {number} lat
 * @param {number} lng
 * @param {number} [zoom=14]
 */
export function initMap(containerId, lat, lng, zoom = 14) {
  function _init() {
    if (typeof L === 'undefined') {
      console.error('[map] Leaflet non caricato. Aggiungi il CDN prima di questo modulo.');
      return;
    }

    const container = document.getElementById(containerId);
    if (!container) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    const map = L.map(containerId, {
      center: [lat, lng],
      zoom,
      scrollWheelZoom:   false,
      zoomControl:       !isMobile,
      dragging:          !isMobile,
      touchZoom:         !isMobile,
      doubleClickZoom:   !isMobile,
      boxZoom:           !isMobile,
      keyboard:          !isMobile,
      tap:               !isMobile,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap &copy; CARTO',
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
      .bindPopup('<strong>Società Agricola Cascina Fontana</strong><br>Strada Vedusino 4, 46040 Rodigo MN')
      .openPopup();

    map.invalidateSize();
  }

  // Aspetta che Leaflet (caricato con defer) sia disponibile
  if (document.readyState === 'complete') {
    _init();
  } else {
    window.addEventListener('load', _init, { once: true });
  }
}
