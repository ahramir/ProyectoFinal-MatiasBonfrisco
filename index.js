
let carritoAPI = [];
document.addEventListener('DOMContentLoaded', () => {


    let baseDeDatos = [

        {
            id: 1,
            nombre: 'Buzos tom y jerry',
            precio: 1200,
            imagen: "./image/buzo1.jpg"
        },
        {
            id: 2,
            nombre: 'Buzos bugs bunny',
            precio: 1500,
            imagen: "./image/buzo2.jpg"
        },
        {
            id: 3,
            nombre: 'Buzos pato donald',
            precio: 1200,
            imagen: "./image/buzo3.jpg"
        },
        {
            id: 4,
            nombre: 'Zapatos peral',
            precio: 2000,
            imagen: "./image/zapato1.jpg"
        },
        {
            id: 5,
            nombre: 'Zapatos zara',
            precio: 2200,
            imagen: "./image/zapato2.jpg"
        },
        {
            id: 6,
            nombre: 'Zapatos roko charol',
            precio: 2500,
            imagen: "./image/zapato3.jpg"
        }
    ];


    const pesos = '$';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');

    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');




    function renderizarProductos() {
        baseDeDatos.forEach((info) => {

            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-sm-4');

            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');

            const miNodoTitle = document.createElement('h5');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = info.nombre;

            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src', info.imagen);

            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent = `${info.precio}${pesos}`;

            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.textContent = '+';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);

            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }


    function anyadirProductoAlCarrito(evento) {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carrito.push(evento.target.getAttribute('marcador'))

        let carritoStorage = JSON.parse(localStorage.getItem("carrito")) || [];

        let id = evento.target.getAttribute('marcador');
        let producto = baseDeDatos.find((elem) => elem.id == id);

        carritoStorage.push(producto);
        let carritoStorageJSON = JSON.stringify(carritoStorage);
        localStorage.setItem("carrito", carritoStorageJSON);
        renderizarCarrito();
    }


    function renderizarCarrito() {
        DOMcarrito.textContent = "";
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        let listaIDs = carrito.map((elem) => elem.id);
        const listaIDSinDuplicados = [...new Set(listaIDs)];

        listaIDSinDuplicados.forEach((item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => {;
                return itemBaseDatos.id === parseInt(item);
            });
           
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {

                return itemId.id === item ? total += 1 : total;
            }, 0);

            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${pesos}`;
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
        DOMtotal.textContent = calcularTotal();
    }


    function borrarItemCarrito(evento) {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const id = evento.target.dataset.item;
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });

        let carritoStorage = JSON.parse(localStorage.getItem("carrito"));
        let producto = carritoStorage.filter((elem) => elem.id != id);
        carritoStorage = producto;
        let carritoStorageJSON = JSON.stringify(carritoStorage);
        localStorage.setItem("carrito", carritoStorageJSON);

        renderizarCarrito();
    }

    function calcularTotal() {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        return carrito.reduce((total, item) => {

            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item.id);
            });
            return total + miItem[0].precio;
        }, 0).toFixed(2);
    }

    function vaciarCarrito() {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
            title: 'Estas seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, borrar!',
            cancelButtonText: 'No, Cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                carrito = [];
                localStorage.removeItem("carrito");

                swalWithBootstrapButtons.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            } else if (

                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    'Cancelled',
                    'Your imaginary file is safe :)',
                    'error'
                )
            }
            renderizarCarrito();
        })

    }
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);

    renderizarProductos();
    renderizarCarrito();

});


const DOMMostrarFormulario = document.querySelector(".mostrarFormulario");

let miFormuario = document.getElementById("formulario");
miFormuario.addEventListener("submit", validarFormulario);

function validarFormulario(e) {

    e.preventDefault();
    let formArray = JSON.parse(localStorage.getItem("formulario")) || [];
    formArray.push(

        crearFormulario(
            e.target.children[0].value,
            e.target.children[1].value,
            e.target.children[2].value,
            e.target.children[3].value,
            e.target.children[4].value,
            e.target.children[5].value,
        ));

    let formArrayJSON = JSON.stringify(formArray);
    localStorage.setItem("formulario", formArrayJSON);
    renderizar();
}

class Formulario {
    constructor(nombre, apellido, direccion, altura, codigoPostal, mailCliente) {
        this.nombre = nombre
        this.apellido = apellido
        this.direccion = direccion
        this.altura = altura
        this.codigoPostal = codigoPostal
        this.mailCliente = mailCliente
    }
}

function crearFormulario(nombre, apellido, direccion, altura, codigoPostal, mailCliente) {
    return new Formulario(nombre, apellido, direccion, altura, codigoPostal, mailCliente);
}
function renderizar() {
    DOMMostrarFormulario.textContent = "";
    let listaFormulario = JSON.parse(localStorage.getItem("formulario"));
    listaFormulario.forEach(formulario => {
        let contenedor = document.createElement("div");
        contenedor.className = "formulario-lista"
        contenedor.innerHTML = `<a>${formulario.nombre}</a>
                            <a>${formulario.apellido}</a>
                            <a>${formulario.direccion}</a>
                            <a>${formulario.altura}</a>
                            <a>${formulario.codigoPostal}</a>
                            <a>${formulario.mailCliente}</a>`;
        DOMMostrarFormulario.append(contenedor);
    });
}





const pagar = async () => {
    carritoAPI = JSON.parse(localStorage.getItem("carrito")) || [];
    const productosToMap = carritoAPI.map(element => {
        let nuevoElemento =
        {
            title: element.nombre,
            category_id: element.id,
            quantity: 1,
            currency_id: "ARS",
            unit_price: element.precio
        }
        return nuevoElemento
    })
    let response = await fetch("https://api.mercadopago.com/checkout/preferences", {

        method: "POST",
        headers: {
            Authorization: "Bearer TEST-5364991343288881-060216-5a4b31411fd4e362bb1a0dae7a01056d-187913717"
        },
        body: JSON.stringify({
            items: productosToMap
        })
    })
    let data = await response.json()
    window.open(data.init_point, "_blank")
}


