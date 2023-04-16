let filtered;
let pod;

async function loadProducts(){
    let data = await fetch("https://products-dasw.onrender.com/api/products", {
        method: "GET",
        headers:{
            "x-expediente": 724195,
            "x-user": "724195@",
            "x-auth": "admin"
        }
    })
    let products = await data.json()
    filtered = [...products]
    pod = [...products]
    //console.log(products.length);

    table.innerHTML = products.map( p => /*HTML*/`
        <tr>
            <td>${p.uuid}</td>
            <td>${p.title}</td>
            <td>${p.description}</td>
            <td>${p.pricePerUnit}</td>
            <td>${p.category}</td>
            <td>${p.stock}</td>
            <td>${p.unit}</td>
            <td><img src="${p.imageUrl}" class="img-fluid icard" alt="${p.imageUrl}"></td>
            <td><button type="button" class="btn btn-info btn-md borderless editButton" data-toggle="modal" data-target="#editarProdcuto">
                <span class="fa fa-pencil-alt">Editar</span>
                </button>
            </td>
            </tr>
        `
    ).join("")

    const boton = document.getElementById("buscar");
    boton.addEventListener("click", (event) => {
        event.preventDefault();
        getSearch();
    });


    checkEdit(products.length, products)

    agregarProdcutos(products.length)

}

loadProducts();

//FORMULARIOS PARA EDITAR
async function checkEdit(cantidad, p){
    let button = document.getElementsByClassName('editButton')
    for(let i = 0; i < button.length; i++){
        button[i].addEventListener("click", function(event){
            let buttonPress = event.target;
            for(let j = 0; j < cantidad; j++){
                if(buttonPress == button[j]){


                    editarProdcuto.innerHTML = /*HTML*/`
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                                <div class="modal-header">
                                        <h5 class="modal-title">Editar Prodcuto</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                </div>
                            <div class="modal-body">
                                <form action="">
                                    <div class="form-group pl-3 pr-5">
                                        <label for="form-groupTitle">Title</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control" id="form-Title"
                                                placeholder="${p[j].title}" >
                                        </div>
                                    </div>

                                    <div class="form-group pl-3 pr-5">
                                        <label for="form-groupDesc">Description</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control" id="form-description"
                                                placeholder="${p[j].description}" >
                                        </div>
                                    </div>

                                    <div class="form-group pl-3 pr-5">
                                        <label for="form-groupPrice">pricePerUnit</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control" id="form-precio"
                                                placeholder="${p[j].pricePerUnit}" >
                                        </div>
                                    </div>

                                    <div class="form-group pl-3 pr-5">
                                        <label for="form-groupCat">Category</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control" id="form-category"
                                                placeholder="${p[j].category}" >
                                        </div>
                                    </div>

                                    <div class="form-group pl-3 pr-5">
                                        <label for="form-groupUnit">Unit</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control" id="form-unit"
                                                placeholder="${p[j].unit}" >
                                        </div>
                                    </div>

                                    <div class="form-group pl-3 pr-5">
                                        <label for="form-groupImage">Imagen</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control" id="form-image"
                                                placeholder="${p[j].imageUrl}">
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-success" onclick="changeProduct(${j})" data-dismiss="modal">Save</button>
                                <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                            </div>
                        </div>
                    </div>
                    `
                }
            }
        })
    }
}

//LLAMADA PARA EL EDIT
async function changeProduct(p){
    let title = document.getElementById("form-Title").value
    let desc = document.getElementById("form-description").value
    let precio = document.getElementById("form-precio").value
    let categoria = document.getElementById("form-category").value
    let unit = document.getElementById("form-unit").value
    let imagen = document.getElementById("form-image").value

    if(!title){
       title = pod[p].title
    }

    if(!desc){
        desc = pod[p].description
    }

    if(!precio){
        precio = pod[p].pricePerUnit
    }

    if(!categoria){
        categoria = pod[p].category
    }

    if(!unit){
        unit = pod[p].unit
    }

    if(!imagen){
        imagen = pod[p].imageUrl
    }

    let llamada = {
        "title": title,
        "description": desc,
        "pricePerUnit": parseFloat(precio),
        "category": categoria,
        "imageUrl": imagen,
        "unit": unit
    }

    let id = pod[p].uuid

    let data = await fetch("https://products-dasw.onrender.com/api/products/" + id, {
            method: "PUT",
            headers:{
                "x-expediente": 724195,
                "x-auth": 'admin',
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(llamada)
    }).then(function(response) {
        // if (response.status !== 200)
        if (!response.ok) {
           console.log(response.type);
        }})
    
    loadProducts();
}

//FORMULARIO DE PRODUCTOS
async function agregarProdcutos(cantidad){
    let button = document.getElementsByClassName('createButton')
    for(let i = 0; i < button.length; i++){
        button[i].addEventListener("click", function(event){
            let buttonPress = event.target;
            for(let j = 0; j < cantidad; j++){
                if(buttonPress == button[j]){

                    crearProducto.innerHTML = /*HTML*/`
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                                <div class="modal-header">
                                        <h5 class="modal-title">Editar Prodcuto</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                </div>
                            <div class="modal-body">
                                <form action="">
                                    <div class="form-group pl-3 pr-5">
                                        <label for="form-groupTitle">Title</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control" id="fTitle"
                                                placeholder="Titulo" >
                                        </div>
                                    </div>

                                    <div class="form-group pl-3 pr-5">
                                        <label for="form-groupDesc">Description</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control" id="fdescription"
                                                placeholder="Descripcion" >
                                        </div>
                                    </div>

                                    <div class="form-group pl-3 pr-5">
                                        <label for="form-groupPrice">pricePerUnit</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control" id="fprecio"
                                                placeholder="PrecioXunidad" >
                                        </div>
                                    </div>

                                    <div class="form-group pl-3 pr-5">
                                        <label for="form-groupStock">Stock</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control" id="fStock"
                                                placeholder="Stock" >
                                        </div>
                                    </div>

                                    <div class="form-group pl-3 pr-5">
                                        <label for="form-groupCat">Category</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control" id="fcategory"
                                                placeholder="Categoria" >
                                        </div>
                                    </div>

                                    <div class="form-group pl-3 pr-5">
                                        <label for="form-groupUnit">Unit</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control" id="funit"
                                                placeholder="unidad" >
                                        </div>
                                    </div>

                                    <div class="form-group pl-3 pr-5">
                                        <label for="form-groupImage">Imagen</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control" id="fimage"
                                                placeholder="Imagen" required>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-success" onclick="addProduct()" data-dismiss="modal">Save</button>
                                <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                            </div>
                        </div>
                    </div>
                    `
                }
            }
        })
    }
}

//LLAMADA PARA AGREGAR
async function addProduct(){
    
    let title = document.getElementById("fTitle").value
    let desc = document.getElementById("fdescription").value
    let precio = document.getElementById("fprecio").value
    let stock = document.getElementById("fStock").value
    let categoria = document.getElementById("fcategory").value
    let unit = document.getElementById("funit").value
    let imagen = document.getElementById("fimage").value

    if(!title){
       title = "To Edit"
    }

    if(!desc){
        desc = "To Edit"
    }

    if(!precio){
        precio = 0
    }

    if(!stock){
        stock = 0
    }

    if(!categoria){
        categoria = "To Edit"
    }

    if(!unit){
        unit = "To Edit"
    }

    if(!imagen){
        imagen = "https://www.cotopaxi.com.ec/sites/default/files/2020-08/BLANCO%20760X440PX_0.png"
    }

    let llamada = {
        "title": title,
        "description": desc,
        "pricePerUnit": parseFloat(precio),
        "stock": parseInt(stock),
        "category": categoria,
        "imageUrl": imagen,
        "unit": unit
    }

    let data = await fetch("https://products-dasw.onrender.com/api/products", {
        method: "POST",
        headers:{
            "x-expediente": 724195,
            "x-auth": 'admin',
            "Content-Type": 'Application/json'
        },
        body: JSON.stringify(llamada)
    })


    loadProducts();
}

function getSearch(){ //Categoria y precio
    let search = document.getElementById("search").value

    let str = search
    let numbers = search.replace(/[^0-9]+/g, "");
    let tmp;

    console.log(tmp);

    if(str){
        tmp = filtered.filter(p => 
            p.category.toUpperCase().includes(str.toUpperCase()));
    }
        
    if(numbers){
        tmp = filtered.filter(p => p.pricePerUnit >= numbers)
    }

    table.innerHTML = tmp.map( p => /*HTML*/`
        <tr>
            <td>${p.uuid}</td>
            <td>${p.title}</td>
            <td>${p.description}</td>
            <td>${p.pricePerUnit}</td>
            <td>${p.stock}</td>
            <td>${p.category}</td>
            <td>${p.unit}</td>
            <td><img src="${p.imageUrl}" class="img-fluid icard" alt="${p.imageUrl}"></td>
        </tr>
        `
    ).join("")

}
