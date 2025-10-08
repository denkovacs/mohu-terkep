const map = L.map('map').setView([47.1625, 19.5033], 7);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy;'
}).addTo(map);

const infoPlaceholder = document.getElementById('info-placeholder');
let currentLocation = null;

// Egyedi ikonok
var mohuIcon = new L.Icon({
    iconUrl: './img/bottle.png',
    iconSize: [31, 31],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    className: 'circular-marker'
});

const markers = [];         //Összes marker
let locationsData = [];    //Helyszín adatok

function renderMarkers(typeFilter) {
    markers.forEach(marker => map.removeLayer(marker));
    markers.length = 0;

    let totalContainers = 0;

    locationsData.forEach(loc => {
        const [lat, lng] = loc.gps.split(',').map(coord => parseFloat(coord.trim()));
        const marker = L.marker([lat, lng], { icon: mohuIcon });

        marker.on('click', () => {
            infoPlaceholder.innerHTML = generateInfoHTML(loc);
        });

        marker.addTo(map);
        markers.push(marker);
        totalContainers++;
    });
    if (markers.length > 0) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds(), { padding: [30, 30] });
    }
    document.getElementById('marker-counter').innerHTML = `Gyűjtőhelyek száma: ${markers.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} db`;
}

fetch('./json/uveg-szelektiv.json')
    .then(response => response.json())
    .then(locations => {
        locationsData = locations;
        renderMarkers();
    });

map.on('click', () => {
    infoPlaceholder.innerHTML = '<p class="info-placeholder-katt">Kattints egy pontra a részletekért.</p>'
})
function generateInfoHTML(loc) {
    return `
    <h2><strong>${loc.varos}</strong> |
    <strong>${loc.kerulet}</strong></h2>
    <p>${loc.megnevezes}</p>
`;
}
