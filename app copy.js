const cards = document.getElementById("cards");
const templateCard = document.getElementById("template-card").content;
const fragment = document.createDocumentFragment();
document.addEventListener('DOMContentLoaded', () =>{
    fetchBusquedaNombre2();
} )

// 01 - Traigo los articulos del JSON
    const fetchBusquedaNombre2 = async () => {
    const resp = await fetch('articulos.json');
    const data =  await resp.json();

    let buscarRemeras = document.getElementById("navRemeras");
    buscarRemeras.addEventListener("click", obtener);

    function obtener() {
        let resultado = data.filter((elemento) => elemento.categoria === "REMERAS");
        cards.innerHTML='';
        for(const producto of resultado){
            templateCard.querySelector("h5").textContent = producto.nombreProducto;
            templateCard.querySelector("p").textContent = producto.precio;
            templateCard.querySelector("img").setAttribute("src", producto.imagen);
            templateCard.querySelector(".btn-secondary").dataset.id = producto.id;
            const clone = templateCard.cloneNode(true)
            fragment.appendChild(clone)
        }
            cards.appendChild(fragment)
            renderCards();
            e.stopPropagation(); 
    }
}