const express = require("express")
const productRoute = require('./producto-route')

const path = require('path')
const app = express();
const port = 3100;

app.use(express.json());

app.get('/', (req, res) => {
    res.send("E - Comerce app Practica 3")
})

app.use('/api/products', productRoute);


app.listen(port, () => console.log(`running http://localhost:${port}`));