const router = require("express").Router()
const products = require('./products.json')
const users = require('./cart.json')
const fs = require('fs')
const nanoid = require('nanoid')
const path = require('path')
const {validateIsAdmin, validateUser} = require("./myValidate")
const { toASCII } = require("punycode")


router.get("/cart", validateUser, (req, res) => {
    let user = users.find(usr => usr.user == req.userName)
    let lista = [];
    let total = 0;
    for(let i = 0; i < user.cart.length; i++){
        let prod = products.find( p => p.id ==  user.cart[i].id);
        if(prod != undefined){
            total += (prod.pricePerUnit * user.cart[i].cantidad)
            lista.push(prod);
        }
    }
    lista = lista.map(p => ({
            title: p.title
        }
    ));
    lista.unshift("Productos:")
    lista.unshift("User: " + user.user);
    lista.push("Total: $" + total);

    res.send(lista)
});


router.get("/", validateIsAdmin, (req, res) => {
    let isAdmin = req.isAdmin;
    let filtered = [...products]
    
    if(isAdmin){
        filtered = filtered.map(p => (
            {
                id: p.id,
                title: p.title,
                description: p.descripcion,
                imageURL: p.imageURL,
                unit: p.unit,
                stock: p.stock,
                priceXUnit: p.pricePerUnit,
                category: p.category
            }
        ));
    }
    else{
        filtered = filtered.map(p => (
            {
                id: p.id,
                title: p.title,
                description: p.descripcion,
                imageURL: p.imageURL,
                unit: p.unit,
                priceXUnit: p.pricePerUnit,
                category: p.category
            }
        ));
    }

    let {title, description, imageURL, unit, max, min, category} = req.query;
    if(title){
        filtered = filtered.filter(p => 
            p.title.toUpperCase().includes(title.toUpperCase()));
    }

    if(description){
        filtered = filtered.filter(p => 
            p.description.toUpperCase().includes(description.toUpperCase()));
    }

    if(imageURL){
        filtered = filtered.filter(p => 
            p.imageURL.includes(imageURL));
    }

    if(unit){
        filtered = filtered.filter(p => 
            p.unit.toUpperCase().includes(unit.toUpperCase()));
    }

    if(max || min){
        min = parseInt(min)
        max = parseInt(max)

        if(min && max){
            filtered = filtered.filter(p => 
                p.priceXUnit >= min && p.priceXUnit <= max);
        }
        else if(max){
            filtered = filtered.filter(p => p.priceXUnit <= max);
        }
        else if(min){
            filtered = filtered.filter(p => p.priceXUnit >= min)
        }
    }

    if(category){
        filtered = filtered.filter(p => 
            p.category.toUpperCase().includes(category.toUpperCase()));
    }

    res.send(filtered);
});


router.get("/:id", (req, res) => {
    let product = products.find(p => p.id == req.params.id)
    if(product){
        res.status(200).send(product)
    }
    else{
        res.status(404).send({error: "No existe"})
    }
});


router.post("/cart", validateUser, (req, res) => {
    if(Array.isArray(req.body)){
        for(let i = 0; i < req.body.length; i++){
            let index = products.findIndex(p => p.id == req.body[i].id)
            if(index < 0){
                res.status(404).send("Este prodcuto con el ID: " + req.body[i].id + " no existe")
            }
        }
        let user = users.find(usr => usr.user == req.userName)
        user.cart = [...req.body];
        fs.writeFileSync(path.join('cart.json'), JSON.stringify(users));
        res.status(200).send(user.cart)
        //res.status(200).send("Carrito de: " + user.user +"Actualizado")
    }
    else{
        res.status(400).send("La Entrada no es un arreglo");
    }
});


router.post("/", (req, res) => {
    let {title, descripcion, imageURL, unit, stock, pricePerUnit, category} = req.body;
    let fallas = [];

    if(!title) fallas.push("Titulo");
    if(!descripcion) fallas.push("Descripcion");
    if(!imageURL) fallas.push("URL");
    if(!unit) fallas.push("Unidades");
    if(!stock) fallas.push("Stock");
    if(!pricePerUnit) fallas.push("Precio");
    if(!category) fallas.push("Categoria");
    
    if(fallas.length > 0){
        res.status(400).send({fallas})
    }

    let newProd = {
        id: nanoid.nanoid(),
        title,
        descripcion,
        imageURL,
        unit,
        stock,
        pricePerUnit, 
        category
    }
    //console.log(newProd);
    products.push(newProd);
    fs.writeFileSync(path.join('products.json'), JSON.stringify(products))
    res.status(201).send(newProd.title);
});


router.put("/:id", validateIsAdmin, (req, res) => {
    let isAdmin = req.isAdmin;
    if(isAdmin){
        let prod = products.find(p => p.id == req.params.id);
        if(prod){
            let {title, descripcion, imageURL, unit, stock, pricePerUnit, category} = req.body;
            if(title) prod.title = title;
            if(descripcion) prod.descripcion = descripcion;
            if(imageURL) prod.imageURL = imageURL;
            if(unit) prod.unit = unit;
            if(stock) prod.stock = stock;
            if(pricePerUnit) prod.pricePerUnit = pricePerUnit;
            if(category) prod.category = category;
            fs.writeFileSync(path.join('products.json'), JSON.stringify(products));
            res.status(200).send("se Actualizo: " + prod.title);
        }
        else{
            res.status(404).send("No se encontro el prodcuto")
        }
    }
    else{
        res.status(401).send("No eres Admin");
    }
});


router.delete("/:id", validateIsAdmin, (req, res) => {
    let isAdmin = req.isAdmin;
    if(isAdmin){
        let index = products.findIndex(p => p.id == req.params.id);
        if(index >= 0){
            let deleted = products.splice(index, 1);
            fs.writeFileSync(path.join('products.json'), JSON.stringify(products));
            res.status(200).send("se eleimino: " + deleted[0].title);
        }
        else{
            res.status(404).send("Prodcuto no Encontrado")
        }
    }
    else{
        res.status(401).send("No eres Admin")
    }
});

module.exports = router;