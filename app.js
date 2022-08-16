// 03 - Acceso a las cards
const cards = document.getElementById("cards");
const templateCard = document.getElementById("template-card").content;
const fragment = document.createDocumentFragment();
// 08 - Acceso al carrito
const templateCarrito = document.getElementById("template-carrito").content;
const templateFooter = document.getElementById("template-footer").content;
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const importe = document.getElementById("importe");

let carrito = {}; // carrito vacio

let productos; // variable para almacenar los datos del fetch

// 02 - Carga DOM
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    if (localStorage.getItem("carrito")){ // trae el contenido del localStorage
        carrito = JSON.parse(localStorage.getItem("carrito"));
        renderCarrito();
    };
})

// 07 - Eventos Click
cards.addEventListener("click", e => { 
    agregarCarrito(e);
})

items.addEventListener("click", e => {
    btnAccion(e);
})

// 01 - Traigo los articulos del JSON
const fetchData = async () => {
    const res = await fetch('articulos.json');
    const data =  await res.json();
    renderCards(data);
    console.log(data);
    productos = data;
}

// 04 - Renderizar las cards
const renderCards = data => {
    cards.innerHTML='';
    data.forEach(producto => {
        templateCard.querySelector("h5").textContent = producto.nombreProducto;
        templateCard.querySelector("p").textContent = producto.precio;
        templateCard.querySelector("img").setAttribute("src", producto.imagen);
        templateCard.querySelector(".btn-primary").dataset.id = producto.id;
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    })
    cards.appendChild(fragment);
}

// 05 - Asigna al boton Comprar la funcion de agregar al carrito
const agregarCarrito = e =>{
    e.target.classList.contains("btn-primary") && setCarrito(e.target.parentElement); // Operador AND
    e.stopPropagation(); // detiene otros eventos
}

// 06 - Acumula los articulos agregados al carrito
const setCarrito = objeto => {
    console.log(objeto);
    const producto ={
        id: objeto.querySelector(".btn-primary").dataset.id,
        title: objeto.querySelector("h5").textContent,
        precio: objeto.querySelector("p").textContent,
        cantidad: 1       
    }
// Si el id del producto se repite no lo vuelve a cargar, solo aumenta la cantidad
    if(carrito.hasOwnProperty(producto.id)){
    producto.cantidad = carrito[producto.id].cantidad + 1
    }
// Agrega el producto cuando el id no se repita y muesta mensaje
    carrito[producto.id] = {...producto} // Spread

    const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: false,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
    })
    Toast.fire({
        icon: 'success',
        title: 'Producto añadido al carrito'
    })
    renderCarrito(); // renderiza el carrito
}

// 09 - Carga/renderiza el contenido al carrito
const renderCarrito = () => {
    items.innerHTML = ""; // limpia html y lo deja vacio

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

    renderFooter(); // renderiza el footer

    localStorage.setItem("carrito", JSON.stringify(carrito)); // guarda el contenido del carrito en localStorage
}

// 10 - Calcula y renderiza el footer
const renderFooter = () => {
    footer.innerHTML = ""; // limpia html y lo deja vacio
    // cuando el carrito este vacio muestra "carrito vacio"
    if(Object.keys(carrito).length === 0) {
        footer.innerHTML = `<th scope="row" colspan="5">El carrito está vacio</th>`;
        ocultarBtnPagar();
        carritoVacio();
        ocultarContenidoCarrito()
        return; // sale de la funcion     
    } else {
        mostrarBtnPagar();
        carritoLleno();
        mostrarContenidoCarrito();
        ocultarBtnFinalizar();
        mostrarBtnsVolverCancelar();
    }

    // Calculos de cantidades e importes
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0);
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0);

    // Muestra los calculos obtenidos de cantidad e importes
    templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
    templateFooter.querySelector("span").textContent = nPrecio;
    importe.innerHTML = `  $ ${nPrecio}`;

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
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Si, quiero vaciar el carrito'
        }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
            'Carrito vacío',
            'Se han eliminado todos los productos del carrito',
            'warning'
            )
            carrito = {}; // vacia el carrito
            renderCarrito(); // muestra carrito vacio 
            }
            renderCarrito();
        })     
    })
}

// 12 - Botones para aumentar y disminuir cantidades del carrito
const btnAccion = e => {
    if (e.target.classList.contains("btn-outline-success")){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad++; // Operador ++ (incremento)
        carrito[e.target.dataset.id] = { ...producto}; // Spread
        renderCarrito();        
    }

    if (e.target.classList.contains("btn-outline-danger")){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad--; // Operador -- (decremento)
        producto.cantidad === 0 ? delete carrito[e.target.dataset.id] : carrito[e.target.dataset.id] = { ...producto} // Operador ternario + Spread
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
const buscarProducto = (e) =>{
    e.preventDefault();
    let form = e.target;
    let valorBuscado = form.children[0].value;
    console.log(valorBuscado);

    let resultado = productos.filter((elemento) => elemento.nombreProducto.includes(valorBuscado.toUpperCase()));
        
    renderCards(resultado);
}

let buscarPorNombre = document.getElementById("busquedaNombre");
buscarPorNombre.addEventListener("submit", buscarProducto);

// 14 - Filtros del navbar
const filtrarRemeras = () => {
    let resultado = productos.filter((elemento) => elemento.categoria === "REMERAS");
    renderCards(resultado)
}
let buscarRemeras = document.getElementById("navRemeras");
buscarRemeras.addEventListener("click", filtrarRemeras);

const filtrarMusculosas = () => {
    let resultado = productos.filter((elemento) => elemento.categoria === "MUSCULOSAS");
    renderCards(resultado)
}
let buscarMusculosas = document.getElementById("navMusculosas");
buscarMusculosas.addEventListener("click", filtrarMusculosas);

const filtrarCamisas = () => {
    let resultado = productos.filter((elemento) => elemento.categoria === "CAMISAS");
    renderCards(resultado)
}
let buscarCamisas = document.getElementById("navCamisas");
buscarCamisas.addEventListener("click", filtrarCamisas);

const filtrarBuzos = () => {
    let resultado = productos.filter((elemento) => elemento.categoria === "BUZOS");
    renderCards(resultado)
}
let buscarBuzos = document.getElementById("navBuzos");
buscarBuzos.addEventListener("click", filtrarBuzos);

const filtrarCamperas = () => {
    let resultado = productos.filter((elemento) => elemento.categoria === "CAMPERAS");
    renderCards(resultado)
}
let buscarCamperas = document.getElementById("navCamperas");
buscarCamperas.addEventListener("click", filtrarCamperas);

const filtrarSweaters = () => {
    let resultado = productos.filter((elemento) => elemento.categoria === "SWEATERS");
    renderCards(resultado)
}
let buscarSweaters = document.getElementById("navSweaters");
buscarSweaters.addEventListener("click", filtrarSweaters);

const filtrarPantalones = () => {
    let resultado = productos.filter((elemento) => elemento.categoria === "PANTALONES");
    renderCards(resultado)
}
let buscarPantalones = document.getElementById("navPantalones");
buscarPantalones.addEventListener("click", filtrarPantalones);

const filtrarVestidos = () => {
    let resultado = productos.filter((elemento) => elemento.categoria === "VESTIDOS");
    renderCards(resultado)
}
let buscarVestidos = document.getElementById("navVestidos");
buscarVestidos.addEventListener("click", filtrarVestidos);

// 15 - Funciones para ocultar/mostrar el botón de pagar según el estado del carrito
function ocultarBtnPagar(){
    document.getElementById('btnPagar').style.display = 'none';
}

function mostrarBtnPagar(){
    document.getElementById('btnPagar').style.display = 'block';
}

// 16 - Funciones para cambiar el color del boton del carrito según su estado
function carritoLleno(){
    document.getElementById('btnCarrito').className = "btn btn-success";
}

function carritoVacio(){
    document.getElementById('btnCarrito').className = "btn btn-danger";
}

// 17 - Funcion para ocultar/mostrar modal del carrito segun su estado
function ocultarContenidoCarrito(){
    document.getElementById("modalHeader").style.display = "none";
    document.getElementById("modalFooter").style.display = "none";
    document.getElementById("tituloTabla").style.display = "none";
}

function mostrarContenidoCarrito(){
    document.getElementById("modalHeader").style.display = "";
    document.getElementById("modalFooter").style.display = "";
    document.getElementById("tituloTabla").style.display = "";       
}

// 18 - Funciones para ocultar/mostrar el botón de finalizar
function ocultarBtnFinalizar(){
    document.getElementById('btnFinalizar').style.display = 'none';
}

function mostrarBtnFinalizar(){
    document.getElementById('btnFinalizar').style.display = '';
}

// 19 - Funciones para ocultar/mostrar los botones "Volver atras" y "Cancelar"
function ocultarBtnsVolverCancelar(){
    document.getElementById('btnVolver').style.display = 'none';
    document.getElementById('btnCancelar').style.display = 'none';
}

function mostrarBtnsVolverCancelar(){
    document.getElementById('btnVolver').style.display = '';
    document.getElementById('btnCancelar').style.display = '';
}

// 20 - Validacion del formulario de pago
const nombre = document.getElementById("nombre");
const tarjeta = document.getElementById("tarjeta");
const vencimiento = document.getElementById("vencimiento");
const pin = document.getElementById("pin");
const formPago = document.getElementById("formPago");

formPago.addEventListener("submit", e => {
    e.preventDefault();
    let warnings = "";
    let entrar = false;
    if(nombre.value.length < 6){
        warnings += `Nombre y Apellido: debe ingresar al menos 6 caracteres.`
        entrar = true;
    }
    if(tarjeta.value.length != 16){
        warnings += `Número de tarjeta: debe ingresar 16 dígitos.`
        entrar = true;
    }
    if(vencimiento.value.length != 7){
        warnings += `Vencimiento: debe ingresar 5 caracteres.`
        entrar = true;
    }
    if(pin.value.length != 4){
        warnings += `PIN: debe ingresar 4 digitos.`
        entrar = true;
    }
    if (entrar){
        Swal.fire({
            icon: 'warning',
            title: 'Datos Incorrectos',
            text: warnings,
            })
    } else {
            Swal.fire(
        'Tu pago ha sido exitoso',
        'Oprimí el botón FINALIZAR',
        'info'
        )
        mostrarBtnFinalizar();
        ocultarBtnsVolverCancelar()
        }        
})

// 20 - Función para limpiar datos de los inputs del form
function resetForm(){
    document.getElementById("nombre").value = "";
    document.getElementById("tarjeta").value = "";
    document.getElementById("vencimiento").value = "";
    document.getElementById("pin").value = "";
}

// 21 - Finaliza el proceso de compra
const finalizar = () => {
    carrito = {};
    renderCarrito();
    resetForm();
    Swal.fire({
        icon: 'success',
        title: 'Muchas gracias por tu compra!',
        showConfirmButton: false,
        timer: 1500
      })
}

let cerrarFinalizar = document.getElementById("btnFinalizar");
cerrarFinalizar.addEventListener("click", finalizar);

// FIN








    


   



    
   






  

   




    


    

    



    


    