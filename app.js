const cards = document.getElementById("cards");
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const templateCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
const fragment = document.createDocumentFragment();
let carrito = {};

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if (localStorage.getItem("carrito")){
        carrito = JSON.parse(localStorage.getItem("carrito"));
        renderCarrito();
    };
 });

cards.addEventListener("click", e => { agregarCarrito(e) });
items.addEventListener("click", e => { btnAccion(e) });

const fetchData = async () => {
    const res = await fetch('articulos.json');
    const data =  await res.json();
    renderCards(data);
}

const renderCards = data => {
    data.forEach(producto => {
        templateCard.querySelector("h5").textContent = producto.nombreProducto;
        templateCard.querySelector("p").textContent = producto.precio;
        templateCard.querySelector("img").setAttribute("src", producto.imagen);
        templateCard.querySelector(".btn-dark").dataset.id = producto.id;
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const agregarCarrito = e =>{
    e.target.classList.contains("btn-dark") && setCarrito(e.target.parentElement); //Operador AND
    e.stopPropagation();
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Producto añadido al carrito',
        showConfirmButton: false,
        timer: 2000
      })
}

const setCarrito = objeto => {
    console.log(objeto)
    const producto ={
        id: objeto.querySelector(".btn-dark").dataset.id,
        title: objeto.querySelector("h5").textContent,
        precio: objeto.querySelector("p").textContent,
        cantidad: 1       
    }
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = {...producto} //Spread
    renderCarrito();
}

 const renderCarrito = () => {
    items.innerHTML = ""

    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector("th").textContent = producto.id;
        templateCarrito.querySelectorAll("td")[0].textContent = producto.title;
        templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad;
        templateCarrito.querySelector(".btn-info").dataset.id = producto.id;
        templateCarrito.querySelector(".btn-danger").dataset.id = producto.id;
        templateCarrito.querySelector("span").textContent = producto.cantidad * producto.precio;
        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    })
    items.appendChild(fragment);

    renderFooter();

   localStorage.setItem("carrito", JSON.stringify(carrito));
 }

 const renderFooter = () => {
    footer.innerHTML = "";
    if(Object.keys(carrito).length === 0) {
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío</th>`;
        return;
    }

    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0);
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0);
    
    templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
    templateFooter.querySelector("span").textContent = nPrecio;

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);

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
              carrito = {};
              renderCarrito();
            }
          })       
    })
}

const btnAccion = e => {
    if (e.target.classList.contains("btn-info")){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad++; //Operador ++ (incremento)
        carrito[e.target.dataset.id] = { ...producto}; //Spread
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Producto añadido al carrito',
            showConfirmButton: false,
            timer: 2000
            })
        renderCarrito();        
    }

    if (e.target.classList.contains("btn-danger")){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad--; //Operador -- (decremento)
        producto.cantidad === 0 ? delete carrito[e.target.dataset.id] : carrito[e.target.dataset.id] = { ...producto} //Operador ternario + Spread
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Producto eliminado del carrito',
            showConfirmButton: false,
            timer: 2000
          })
        }
        renderCarrito();    
    }
    e.stopPropagation();