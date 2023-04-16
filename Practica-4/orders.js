
async function loadCart(){
    let data = await fetch("https://products-dasw.onrender.com/api/carts", {
        method: "GET",
        headers:{
            "x-expediente": 724195,
            "x-user": "is724195@iteso.mx"
        }
    })

    let carrito = await data.json()
    let cart = [...carrito.cart]
    let products = [];

    for(let i = 0; i < cart.length; i++){
        products.push(cart[i].product)
    }
    shop.innerHTML = /*HTML*/` ${products.length}`
}

loadCart();