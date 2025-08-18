const map=L.map('map').setView([47.1625,19.5033],7);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
attribution: '&copy;'
}).addTo(map);

const infoPlaceholder=document.getElementById('info-placeholder');
let currentLocation=null;

// Egyedi ikonok
var mohuIcon = new L.Icon({
iconUrl: 'img/mohu-logo.jpg',
iconSize: [31, 31],
iconAnchor: [12, 41],
popupAnchor: [1, -34],
className:'circular-marker'
});

var textIcon = new L.Icon({
iconUrl: 'img/text-logo.jpg',
iconSize: [31, 31],
iconAnchor: [12, 41],
popupAnchor: [1, -34],
className:'circular-marker'
});

var mohutextIcon = new L.Icon({
iconUrl: 'img/mohutext-logo.jpg',
iconSize: [31, 31],
iconAnchor: [12, 41],
popupAnchor: [1, -34],
className:'circular-marker'
});

const markers=[];         //Összes marker
let locationsData=[];    //Helyszín adatok

let showMOHU=true;
let showEX=true;
let selectedMegye=""; //kiválasztott megye változó
let selectedTipus=""; //Kiválasztott típus változó

const markerClusterGroup=L.markerClusterGroup();
map.addLayer(markerClusterGroup);

function renderMarkers(typeFilter){
    markers.forEach(marker=>map.removeLayer(marker));
    markers.length=0;
    markerClusterGroup.clearLayers();
    
    const startDateStr=document.getElementById('start-date').value;
    const endDateStr=document.getElementById('end-date').value;
    const startDate=startDateStr ? new Date(startDateStr):null;
    const endDate=endDateStr ? new Date(endDateStr):null;

    locationsData.forEach(loc=>{
        const hasMOHU=loc.mohu>0;
        const hasEX=loc.ex>0;
    
        if(!showMOHU && !showEX)return;

        const lerakDate=new Date(loc.lerak.replace(/\./g,'-'));
        if(startDate && lerakDate < startDate) return;
        if(endDate && lerakDate > endDate) return;

        const showThis=(showMOHU&&hasMOHU)||(showEX&&hasEX);

        if(!showThis) return;
        if(selectedMegye&&loc.varmegye!==selectedMegye)return;
        
        if(!showThis) return;
        if(selectedTipus&&loc.prev4Combo!==selectedTipus)return;

        let icon=null;
        if(hasMOHU && hasEX){
            icon=mohutextIcon;
        }
        else if(hasMOHU){
            icon=mohuIcon;
        }
        else if(hasEX){
            icon=textIcon;
        }
        const marker =L.marker(loc.coord, {icon});
        marker.on('click',()=>{
            infoPlaceholder.innerHTML= generateInfoHTML(loc);
            });
            markerClusterGroup.addLayer(marker);
            markers.push(marker);                
    });
    document.getElementById('marker-counter').innerText=`Térképen megjelenő konténerek száma: ${markers.length}`;
}

document.getElementById('filter-mohu').addEventListener('click',function(){
    showMOHU=!showMOHU;
    this.classList.toggle('active');
    renderMarkers();
});

document.getElementById('filter-ex').addEventListener('click',function(){
    showEX=!showEX;
    this.classList.toggle('active');
    renderMarkers();
});

document.getElementById('megye-filter').addEventListener('change',function(){   //eseménykezelő megyékhez
    selectedMegye=this.value;
    renderMarkers();
});

document.getElementById('tipus-filter').addEventListener('change',function(){
    selectedTipus=this.value;
    renderMarkers();
});

document.getElementById('start-date').addEventListener('change',renderMarkers);
document.getElementById('end-date').addEventListener('change',renderMarkers);

fetch('helyszinek.json')
.then(response=>response.json())
.then(locations=>{
    locationsData=locations;
    renderMarkers();
});

map.on('click',()=>{
infoPlaceholder.innerHTML='<p>Kattints egy pontra a részletekért.</p>'
})

function generateInfoHTML(loc)
{
return `
    <h2>Cím azonosító: <strong>${loc.addresId}</strong></h2>
    <p>Település: <strong>${loc.telepules}</strong></p>
    <p>Vármegye: <strong>${loc.varmegye}</strong></p>
    <p>Irányítószám: <strong>${loc.iranyitoszam}</strong></p>
    <p>Hely:<strong>${loc.hely}</strong></p>
    <p>Előző 4 kombinálása: <strong>${loc.prev4Combo}</strong></p>
    <p>MOHU konténer Hely/DB: <strong>${loc.mohu}</strong></p>
    <p>TEXTRADE konténer Hely/DB: <strong>${loc.ex}</strong></p>

    <p>Hely:<strong>${loc.hely}</strong></p>
    <p>Előző 4 kombinálása: <strong>${loc.prev4Combo}</strong></p>
    <p>MOHU konténer Hely/DB: <strong>${loc.mohu}</strong></p>
    <p>TEXTRADE konténer Hely/DB: <strong>${loc.ex}</strong></p>

    <p>Hely:<strong>${loc.hely}</strong></p>
    <p>Előző 4 kombinálása: <strong>${loc.prev4Combo}</strong></p>
    <p>MOHU konténer Hely/DB: <strong>${loc.mohu}</strong></p>
    <p>TEXTRADE konténer Hely/DB: <strong>${loc.ex}</strong></p>
`;
}