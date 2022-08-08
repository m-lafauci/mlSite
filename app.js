// 03 - Acceso a las cards
const cards = document.getElementById("cards");
const templateCard = document.getElementById("template-card").content;
const fragment = document.createDocumentFragment();
// 08 - Acceso al carrito
const templateCarrito = document.getElementById("template-carrito").content;
const templateFooter = document.getElementById("template-footer").content;
const items = document.getElementById("items");
const footer = document.getElementById("footer");

let carrito = {}; //carrito vacio

// 02 - Carga DOM
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    fetchBusquedaNombre();
    fetchBusquedaNombre2();

    if (localStorage.getItem("carrito")){ // trae el contenido del localStorage
        carrito = JSON.parse(localStorage.getItem("carrito"));
        renderCarrito();
    };
 });

// 07 - Eventos Click
cards.addEventListener("click", e => { 
    agregarCarrito(e)
});

items.addEventListener("click", e => {
    btnAccion(e)
});

// 01 - Traigo los articulos del JSON
const fetchData = async () => {
    const res = await fetch('articulos.json');
    const data =  await res.json();
    renderCards(data);
    console.log(data);
}

// 04 - Renderizar las cards
const renderCards = data => {
    data.forEach(producto => {
        templateCard.querySelector("h5").textContent = producto.nombreProducto;
        templateCard.querySelector("p").textContent = producto.precio;
        templateCard.querySelector("img").setAttribute("src", producto.imagen);
        templateCard.querySelector(".btn-secondary").dataset.id = producto.id;
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

// 05 - Asigna al boton Comprar la funcion de agregar al carrito
const agregarCarrito = e =>{
    e.target.classList.contains("btn-secondary") && setCarrito(e.target.parentElement); //Operador AND
    e.stopPropagation(); //detiene otros eventos
}

// 06 - Acumula los articulos agregados al carrito
const setCarrito = objeto => {
    console.log(objeto)
    const producto ={
        id: objeto.querySelector(".btn-secondary").dataset.id,
        title: objeto.querySelector("h5").textContent,
        precio: objeto.querySelector("p").textContent,
        cantidad: 1       
    }
    // Si el id del producto se repite no lo vuelve a cargar, solo aumenta la cantidad
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    // Agrega el producto cuando el id no se repita y muesta mensaje
    carrito[producto.id] = {...producto} //Spread
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Producto añadido al carrito',
        showConfirmButton: false,
        timer: 2000
      })
    renderCarrito(); // renderiza el carrito
}

// 09 - Carga/renderiza el contenido al carrito
 const renderCarrito = () => {
    items.innerHTML = ""; //limpia html y lo deja vacio

    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector("th").textContent = producto.id;
        templateCarrito.querySelectorAll("td")[0].textContent = producto.title;
        templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad;
        templateCarrito.querySelector(".btn-outline-success").dataset.id = producto.id;
        templateCarrito.querySelector(".btn-outline-danger").dataset.id = producto.id;
        templateCarrito.querySelector("span").textContent = producto.cantidad * producto.precio;
        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    })
    items.appendChild(fragment);

    renderFooter(); //renderiza el footer

   localStorage.setItem("carrito", JSON.stringify(carrito)); // guarda el contenido del carrito en localStorage
 }

// 10 - Calcula y renderiza el footer
  const renderFooter = () => {
    footer.innerHTML = ""; //limpia html y lo deja vacio
    //cuando el carrito este vacio muestra "carrito vacio"
    if(Object.keys(carrito).length === 0) {
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío</th>`;
        return; //sale de la funcion
    }
    //Calculos de cantidades e importes
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0);
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0);
    
    //Muestra los calculos obtenidos de cantidad e importes
    templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
    templateFooter.querySelector("span").textContent = nPrecio;

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);

// 11 - Vacia el contenido del carrito y muestra mensaje
  const btnVaciar = document.getElementById("vaciar-carrito");
    btnVaciar.addEventListener("click", () => {
        Swal.fire({
            title: 'Desea vaciar el carrito?',
            text: "Esta acción no se puede revertir",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, quiero vaciar el carrito'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'Carrito vacío',
                'Se han eliminado todos los productos del carrito',
                'warning'
              )
              carrito = {}; //vacia el carrito
              renderCarrito(); //muestra carrito vacio
            }
          })       
    })
}

// 12 - Botones para aumentar y disminuir cantidades del carrito
 const btnAccion = e => {
    if (e.target.classList.contains("btn-outline-success")){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad++; //Operador ++ (incremento)
        carrito[e.target.dataset.id] = { ...producto}; //Spread
        renderCarrito();        
    }

    if (e.target.classList.contains("btn-outline-danger")){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad--; //Operador -- (decremento)
        producto.cantidad === 0 ? delete carrito[e.target.dataset.id] : carrito[e.target.dataset.id] = { ...producto} //Operador ternario + Spread
        if(producto.cantidad==0){
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Producto eliminado del carrito',
                showConfirmButton: false,
                timer: 2000
            })
        }
    }
    renderCarrito();  
    e.stopPropagation(); 
    }

// 13 - Input de busqueda
    const fetchBusquedaNombre = async () => {
        const resp = await fetch('articulos.json');
        const data =  await resp.json();

    let buscarPorNombre = document.getElementById("busquedaNombre");
    buscarPorNombre.addEventListener("submit", validarNombre2);

    function validarNombre2(e){
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
            renderCards();
            e.stopPropagation(); 
    }
    };

// 14 - Filtros del navbar

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
    



    


    