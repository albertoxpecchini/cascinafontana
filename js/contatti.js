const LAT = 45.178186;
const LNG = 10.661154;
const ZOOM = 15;

export function initContattiMap(containerId) {
  function _init() {
    if (typeof L === 'undefined') return;
    const container = document.getElementById(containerId);
    if (!container) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    const map = L.map(containerId, {
      center: [LAT, LNG],
      zoom: ZOOM,
      scrollWheelZoom: false,
      zoomControl: !isMobile,
      dragging: !isMobile,
      touchZoom: !isMobile,
      doubleClickZoom: !isMobile,
      boxZoom: !isMobile,
      keyboard: !isMobile,
      tap: !isMobile,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap &copy; CARTO',
    }).addTo(map);

    const icon = L.divIcon({
      className: '',
      html: `<div style="
        width:36px;height:36px;border-radius:50% 50% 50% 0;
        background:#3ECF8E;border:3px solid #ffffff;
        box-shadow:0 2px 8px rgba(0,0,0,0.4);
        transform:rotate(-45deg);
      "></div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -38],
    });

    L.marker([LAT, LNG], { icon })
      .addTo(map)
      .bindPopup('<strong>Cascina Fontana</strong><br>Strada Vedusino 4, 46040 Rodigo MN')
      .openPopup();

    setTimeout(() => map.invalidateSize(), 100);

    if (isMobile) {
      container.style.pointerEvents = 'none';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init, { once: true });
  } else {
    _init();
  }
}
