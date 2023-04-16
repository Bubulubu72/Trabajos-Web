let actual = 1;
let objetosPagina;
let filtered;
let selected;

async function loadProducts(){
    let data = await fetch("https://products-dasw.onrender.com/api/products", {
        method: "GET",
        headers:{
            "x-expediente": 724195
        }
    })
    let products = await data.json()
    filtered = [...products];

    const max_products = 4

    let inicio = (actual - 1) * max_products;
    let fin = inicio + max_products;
    objetosPagina = products.slice(inicio, fin);

    cards.innerHTML = objetosPagina.map( p => /*HTML*/`
        <div class="col-sm-6 col-md-4 col-xl-3 col-lg-3 / card / ">
            <img class="card-img-top icard mt-3" src="${p.imageUrl}">
            <div class="card-body">
                <h4 class="card-title">${p.title}</h4>
                <p class="card-text" style="font-style: italic;">${p.description}</p>
            </div>
            <div class="card-footer">
            <p>${p.unit} X \$${p.pricePerUnit} .MX</p>
            <button type="button" class="btn btn-primary buttonC" data-toggle="modal" data-target="#Aumento">
                Agregar al carrito</button>
            </div>
            
        </div>
    `).join("")

    /////
    let button = document.getElementsByClassName('buttonC')
    for(let i = 0; i < button.length; i++){
        button[i].addEventListener("click", function(event){
            let buttonPress = event.target;
            for(let j = 0; j < objetosPagina.length; j++){
                if(buttonPress == button[j]){
                    selected = j;
                }
            }
        })
    }

    /////
    const boton = document.getElementById("Buscar");
    boton.addEventListener("click", (event) => {
        event.preventDefault();
        getSearch();
    });


    loadCart();
}

function getNumbers(){
    let num = document.getElementById('num').value
    agregarProdcutos(objetosPagina[selected].uuid, num)
}

loadProducts();

function changeActive(n){
    let paginado = document.getElementsByClassName("page-item");

    if( n == 1){
        paginado[2].classList.remove("active")
        paginado[3].classList.remove("active")
        paginado[4].classList.remove("disabled")
        paginado[1].classList.add("active")
        paginado[0].classList.add("disabled")
        actual = 1
        loadProducts();
    }

    if(n == 2){
        paginado[0].classList.remove("disabled")
        paginado[1].classList.remove("active")
        paginado[3].classList.remove("active")
        paginado[4].classList.remove("disabled")
        paginado[2].classList.add("active")
        actual = 2
        loadProducts();
    }

    if(n == 3){
        paginado[0].classList.remove("disabled")
        paginado[1].classList.remove("active")
        paginado[2].classList.remove("active")
        paginado[3].classList.add("active")
        paginado[4].classList.add("disabled")
        actual = 3
        loadProducts();
    }

    if( n == 0 && !paginado[0].classList.contains("disabled")){
        changeActive(actual - 1)
    }

    if( n == 4 && !paginado[4].classList.contains("disabled")){
        changeActive(actual + 1)
    }

}

function getSearch(){
    let search = document.getElementById("search").value
    let tmp;
    if(search){
        tmp = filtered.filter(p => 
            p.title.toUpperCase().includes(search.toUpperCase()));
    }
    
    cards.innerHTML = tmp.map( p => /*HTML*/`
        <div class="col-sm-6 col-md-4 col-xl-3 col-lg-3 / card / ">
            <img class="card-img-top icard mt-3" src="${p.imageUrl}">
            <div class="card-body">
                <h4 class="card-title">${p.title}</h4>
                <p class="card-text" style="font-style: italic;">${p.description}</p>
            </div>
            <div class="card-footer">
            <p>${p.unit} X \$${p.pricePerUnit} .MX</p>
            <button type="button" class="btn btn-primary buttonC" data-toggle="modal" data-target="#Aumento">
                Agregar al carrito</button>
            </div>
            
        </div>
    `).join("")
}

function restaurarValores(str) {
    var modal = document.getElementById(str);
    var campos = modal.querySelectorAll("input[type='number']");
    campos.forEach(function(campo) {
      campo.value = campo.defaultValue;
    });

}

async function agregarProdcutos(id, cantidad){
    let llamada = {
            "amount": parseInt(cantidad)
    };

    let data = await fetch("https://products-dasw.onrender.com/api/carts/" + id, {
        method: "POST",
        headers:{
            "x-expediente": 724195,
            "x-user": "724195@",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(llamada)
    })

    loadCart();
}

async function loadCart(){
    let data = await fetch("https://products-dasw.onrender.com/api/carts", {
        method: "GET",
        headers:{
            "x-expediente": 724195,
            "x-user": "724195@"
        }
    })

    let carrito = await data.json()
    //console.log(carrito);

    let cart = [...carrito.cart]
    let montos = [];
    let products = [];

    for(let i = 0; i < cart.length; i++){
        montos.push(cart[i].amount);
        products.push(cart[i].product)
    }

    shop.innerHTML = /*HTML*/` ${products.length}`
}
