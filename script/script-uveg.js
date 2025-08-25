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

let selectedMegye="";
let selectedTipus="";

const markerClusterGroup=L.markerClusterGroup();
map.addLayer(markerClusterGroup);

function renderMarkers(typeFilter){
    markers.forEach(marker=>map.removeLayer(marker));
    markers.length=0;
    markerClusterGroup.clearLayers();

    let totalContainers=0;

    locationsData.forEach(loc=>{

        const szelesseg = Number(loc.koordinata_szelesseg);
        const hosszusag = Number(loc.koordinata_hosszusag);

         if (isNaN(hosszusag) || isNaN(szelesseg)) {
            console.warn("Hibás koordináta:", loc);
            return;
        }

        if (selectedTipus && loc.tipus !== selectedTipus) return;
        if (selectedMegye && loc.varmegye !== selectedMegye) return;

        const marker =L.marker([szelesseg,hosszusag], {icon:mohuIcon});
        marker.on('click',()=>{
            infoPlaceholder.innerHTML= generateInfoHTML(loc);
            });
            markerClusterGroup.addLayer(marker);
            markers.push(marker);
            totalContainers++;    
    });
    document.getElementById('marker-counter').innerHTML=`Gyűjtőhelyek száma: ${markers.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} db`;
}

document.getElementById('tipus-filter').addEventListener('change',function(){
    selectedTipus=this.value;
    renderMarkers();
});

document.getElementById('megye-filter').addEventListener('change',function(){
    selectedMegye=this.value;
    renderMarkers();
});

fetch('./json/uveg.json')
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
    <h2><strong>${loc.varos}</strong> |
    <strong>${loc.utca}</strong></h2>
    <p>Azonosító: <strong>${loc.rpopoc}</strong></p>
    <p>Település: <strong>${loc.varos}</strong></p>
    <p>Vármegye: <strong>${loc.varmegye}</strong></p>
    <p>Típus: <strong>${loc.tipus}</strong></p>
    <p>Cég neve: <strong>${loc.ceg_neve}</strong></p>

`;
}
