import L from 'leaflet';

// Predefined SVG paths for common icons
const ICON_PATHS = {
  Landmark: 'M12 2L4 7v12h16V7L12 2zm0 2.5L18 7v10H6V7l6-4.5z',
  Museum: 'M22 12v10H2V12l10-7 10 7zM4 12h16v6H4v-6z',
  Temple: 'M12 2L4 7v12h16V7L12 2zm0 2.5L18 7v10H6V7l6-4.5z',
  Church: 'M12 2L4 7v12h16V7L12 2zm0 2.5L18 7v10H6V7l6-4.5z',
  Pray: 'M12 2L4 7v12h16V7L12 2zm0 2.5L18 7v10H6V7l6-4.5z',
  MapPin: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'
};

export function createCustomIcon(iconName = 'MapPin', color = '#3388FF') {
  // Create SVG element
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("viewBox", "0 0 24 24");
  
  // Create path element
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", ICON_PATHS[iconName] || ICON_PATHS.MapPin);
  path.setAttribute("fill", color);
  svg.appendChild(path);

  // Create container div
  const container = document.createElement("div");
  container.style.width = "32px";
  container.style.height = "32px";
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";
  container.style.transform = "translate(-50%, -100%)";
  container.appendChild(svg);

  return L.divIcon({
    html: container,
    className: '', // Important: no default Leaflet classes
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
}