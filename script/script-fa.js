const map=L.map('map').setView([47.1625,19.5033],7);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
attribution: '&copy;'
}).addTo(map);

const infoPlaceholder=document.getElementById('info-placeholder');
let currentLocation=null;

// Egyedi ikonok
var mohuIcon = new L.Icon({
iconUrl: './img/mohu-logo.jpg',
iconSize: [31, 31],
iconAnchor: [12, 41],
popupAnchor: [1, -34],
className:'circular-marker'
});

const markers=[];         //Összes marker
let locationsData=[];    //Helyszín adatok

let showButor=true;
let showCsomagolas=true;

const markerClusterGroup=L.markerClusterGroup();
map.addLayer(markerClusterGroup);

function renderMarkers(typeFilter){
    markers.forEach(marker=>map.removeLayer(marker));
    markers.length=0;
    markerClusterGroup.clearLayers();

    let totalContainers=0;

    locationsData.forEach(loc=>{

        let visible = false;

        if (loc.fa_butor_atvet === "igen" && showButor) visible = true;
        if (loc.fa_csomagolas_atvet === "igen" && showCsomagolas) visible = true;

        if (!visible) return;

        const lat = Number(loc.koordinata_x);
        const lng = Number(loc.koordinata_y);

         if (isNaN(lat) || isNaN(lng)) {
            console.warn("Hibás koordináta:", loc);
            return;
        }

        const marker = L.marker([lat,lng], {icon: mohuIcon});
        marker.on('click',()=>{
            infoPlaceholder.innerHTML= generateInfoHTML(loc);
            });
            markerClusterGroup.addLayer(marker);
            markers.push(marker);
            totalContainers++;    
    });
    document.getElementById('marker-count').textContent=totalContainers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

document.getElementById('filter-butor').addEventListener('click',function(){
    showButor=!showButor;
    this.classList.toggle('active');
    renderMarkers();
});

document.getElementById('filter-csomagolas').addEventListener('click',function(){
    showCsomagolas=!showCsomagolas;
    this.classList.toggle('active');
    renderMarkers();
});

fetch('./json/fa.json')
.then(response=>response.json())
.then(locations=>{
    locationsData=locations;
    renderMarkers();
});

map.on('click',()=>{
infoPlaceholder.innerHTML='<p class="info-placeholder-katt">Kattints egy pontra a részletekért.</p>'
})
function generateInfoHTML(loc)
{
return `
    <h2><strong>${loc.cim}</strong> |
    <strong>${loc.raktarhely_kod}</strong></h2>
    <p>Azonosító: <strong>${loc.sorszam}</strong></p>
    <p>Település: <strong>${loc.partner}</strong></p>
    <p>Típus: <strong>${loc.teruleti_vezeto}</strong></p>
`;
}
