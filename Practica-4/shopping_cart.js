let selected;


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

    mediaContainer.innerHTML = products.map( (p, i) => /*HTML*/`
            <div class="media border">
                <div class="media-body mt-3 ml-4">  
                    <h2>${p.title} 
                        <button type="button" class="btn btn-danger btn-md eraseButton">
                            <span class="fa fa-trash-alt"></span>
                        </button>
                    </h2>
                    <div class="input-group mt-4 ">
                        <div class="inut-group-prepend">
                            <span class="input-group-text borderless">Cantidad:</span>
                        </div>
                        <input type="number" class="media-cantidad pl-2" min="1" max="5" placeholder="${montos[i]}">
                    
                       
                    <button type="button" class="btn btn-info btn-md borderless editButton" >
                        <span class="fa fa-pencil-alt"></span>
                    </button>


                    </div>
                    <div class="input-group mt-3 pb-3">
                        <div class="inut-group-prepend">
                            <span class="input-group-text">Precio:</span>
                        </div>
                        <input type="text" class="media-price" placeholder="${p.pricePerUnit}" readonly>

                        <div class="inut-group-prepend">
                            <span class="input-group-text">$MX</span>
                        </div>
                    
                    </div>

                    </div>
                    <div class="media-right">
                        <img class=" m-4 icard" src="${p.imageUrl}" alt="Generic placeholder image">
                    </div>
            </div>
    `).join("")

    totalC.innerHTML =  products.map( (p, i) => /*HTML*/`
        <p>${p.title}: ${montos[i]} x ${p.pricePerUnit}</p>
    `).join("")

    totalT.innerHTML = /*HTML*/`
        <p>Monto a pagar: \$${carrito.total} MX</p>
    `

    checkEdit(products.length, products);
    checkErase(products.length, products);
}

loadCart();

function checkEdit(cantidad, p){
    let button = document.getElementsByClassName('editButton')
    for(let i = 0; i < button.length; i++){
        button[i].addEventListener("click", function(event){
            let buttonPress = event.target;
            for(let j = 0; j < cantidad; j++){
                if(buttonPress == button[j]){
                    button[j].outerHTML = /*HTML*/`
                        <button type="button" class="btn btn-success btn-md borderless editButton checkButton" >
                            <span class="fa fa-check"></span>
                        </button>
                    `
                    button[j].insertAdjacentHTML("afterend" ,/*HTML*/`
                        <button type="button" class="btn btn-danger btn-md borderless cancelButton" >
                            <span class="fa fa-window-close"></span>
                        </button>
                    `)
                    selected = j;

                    changeAmoutn(p);
                    button[j] = changeNormal(button[j])

                }
            }
        })
    }
}

function changeAmoutn(p){
    let input = document.getElementsByClassName("checkButton")
    let num = document.getElementsByClassName("media-cantidad")
    for(let i = 0; i < input.length; i++){
        input[i].addEventListener("click", function(){
            cambiarProdcutos(p[selected].uuid, parseInt(num[selected].value))
        })
    }
}

function changeNormal(html){
    let button = document.getElementsByClassName('cancelButton')
    for(let i = 0; i < button.length; i++){
        button[i].addEventListener("click", function(event){
            let buttonPress = event.target;
            for(let k = 0; k < button.length; k++){
                if(buttonPress == button[k]){
                    if(button[k]){
                        html.outerHTML = /*HTML*/`
                        <button type="button" class="btn btn-info btn-md borderless editButton" >
                            <span class="fa fa-pencil-alt"></span>
                        </button>
                        `
                        button[k].remove();
                        loadCart();
                        return html;
                }
            }}
        })
    }
    
}

function checkErase(cantidad, p){
    let button = document.getElementsByClassName('eraseButton')
    for(let i = 0; i < button.length; i++){
        button[i].addEventListener("click", function(event){
            let buttonPress = event.target;
            for(let j = 0; j < cantidad; j++){
                if(buttonPress == button[j]){
                    id = p[j].uuid;
                    let data = fetch("https://products-dasw.onrender.com/api/carts/" + id, {
                    method: "DELETE",
                    headers:{
                        "x-expediente": 724195,
                        "x-user": "724195@"
                    }
                    })
                    loadCart();
                }
            }
        })
    }
}

async function cambiarProdcutos(id, cantidad){
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
