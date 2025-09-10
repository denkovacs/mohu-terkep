fetch('./components/navbar.html')
.then(response=>response.text())
.then(data=>{
    document.getElementById('nav').innerHTML=data;

    const toggleBtn = document.querySelector(".menu-toggle");
    const dropdown = document.querySelector(".dropdown-menu");

    if(toggleBtn&&dropdown){
        toggleBtn.addEventListener("click", () => {
        dropdown.classList.toggle("show");
        toggleBtn.textContent = dropdown.classList.contains("show") ? "✖" : "☰";
    });
    }
});

fetch('./components/filter-varmegye.html')
.then(response=>response.text())
.then(data=>{
    document.getElementById('filter-varmegye').innerHTML=data;
    
    const megyeFilter= document.getElementById('megye-filter');
    if(megyeFilter){
        selectedMegye=this.value;
        renderMarkers();
    };
});