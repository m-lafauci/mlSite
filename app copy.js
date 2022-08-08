const cards = document.getElementById("cards");
const templateCard = document.getElementById("template-card").content;
const fragment = document.createDocumentFragment();
document.addEventListener('DOMContentLoaded', () =>{
    fetchData();
} )

// 01 - Traigo los articulos del JSON
const fetchData = async () => {
    const resp = await fetch('articulos.json');
    const data =  await resp.json();
    console.log(data);

    let buscarPorNombre = document.getElementById("busquedaNombre");
    buscarPorNombre.addEventListener("submit", validarNombre);

    function validarNombre(e){
    e.preventDefault();

    let form = e.target;
    let valorBuscado = form.children[0].value;
    console.log(valorBuscado);

    let resultado = data.filter((elemento) => elemento.nombreProducto.includes(valorBuscado.toUpperCase()));
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
        };
}





/* let buscarPorNombre = document.getElementById("busquedaNombre");
buscarPorNombre.addEventListener("submit", validarNombre);

function validarNombre(e){
    e.preventDefault();

    let form = e.target;
    let valorBuscado = form.children[0].value;
    console.log(valorBuscado);

    let resultado = array.filter((elemento) => elemento.nombreProducto.includes(valorBuscado.toUpperCase()));
        container.innerHTML='';
        for(const articulo of resultado){
            let item = document.createElement("div");
            item.innerHTML = `<img src=${articulo.imagen}>
                              <h5>${articulo.nombreProducto}</h5>
                              <h5>Categoría: ${articulo.categoria}<h5>
                              <h5>Temporada: ${articulo.temporada}<h5>
                              <h5>Precio: ${articulo.precio}</h3>`;
            container.append(item);
        };
} */