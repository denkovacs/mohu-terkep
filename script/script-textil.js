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

var textIcon = new L.Icon({
iconUrl: './img/text-logo.jpg',
iconSize: [31, 31],
iconAnchor: [12, 41],
popupAnchor: [1, -34],
className:'circular-marker'
});

var mohutextIcon = new L.Icon({
iconUrl: './img/mohutext-logo.jpg',
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
let selectedTipus=""; //Kiválasztott típus változ
let selectedRegio="";

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

    let totalContainers=0;

    locationsData.forEach(loc=>{
        const hasMOHU=loc.mohu>0;
        const hasEX=loc.ex>0;

        const mohu=Number(loc.mohu)||0;
        const ex=Number(loc.ex)||0;
    
        if(!showMOHU && !showEX)return;

        const lerakDate=new Date(loc.lerak.replace(/\./g,'-'));
        if(startDate && lerakDate < startDate) return;
        if(endDate && lerakDate > endDate) return;

        const showThis=(showMOHU&&hasMOHU)||(showEX&&hasEX);

        if(!showThis) return;
        if(selectedMegye&&loc.varmegye!==selectedMegye)return;
        
        if(!showThis) return;
        if(selectedTipus&&loc.szervezet!==selectedTipus)return;

        if(!showThis) return;
        if(selectedRegio&&loc.regio!==selectedRegio)return;

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
            totalContainers+=(mohu+ex);    
    });
    document.getElementById('con-counter').innerHTML=`Konténerek száma: ${totalContainers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} db`; 
    document.getElementById('marker-counter').innerHTML=`Gyűjtőhelyek száma: ${markers.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} db`;
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
document.getElementById('tipus-filter').addEventListener('change',function(){
    selectedTipus=this.value;
    renderMarkers();
});

document.getElementById('regio-filter').addEventListener('change',function(){
    selectedRegio=this.value;
    renderMarkers();
});

document.getElementById('start-date').addEventListener('change',renderMarkers);
document.getElementById('end-date').addEventListener('change',renderMarkers);

fetch('./json/textil.json')
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
    <h2><strong>${loc.telepules}</strong> |
    <strong>${loc.helye}</strong></h2>
    <p>Település: <strong>${loc.telepules}</strong></p>
    <p>Vármegye: <strong>${loc.varmegye}</strong></p>
    <p>Régió: <strong>${loc.regio}</strong></p>
    <p>Szervezet: <strong>${loc.szervezet}</strong></p>
    <p>Kihelyezés dátuma: <strong>${loc.lerak}</strong></p>
    <p>MOHU konténer: <strong>${loc.mohu} db</strong></p>
    <p>TEXTRADE konténer: <strong>${loc.ex} db</strong></p>
    <p>MOHU konténer Össz. kg: <strong>${loc.mohukg.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} kg</strong></p>
    <p>TEXTRADE konténer Össz. kg: <strong>${loc.textkg.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} kg</strong></p>
`;
}
