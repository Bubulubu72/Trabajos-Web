const users = require('./cart.json')

function validateIsAdmin(req, res, next){
    let header = req.get("x-token")
    if(header && header  == "admin"){
        req.isAdmin = true;
    }
    else{
        req.isAdmin = false;
    }
    next()
}

function validateUser(req, res, next){
    let header = req.get("x-user")
    if(header){
        let usr = users.find( player => (player.user == header))
        if(usr != undefined){
            req.userName = header;
        }
        else{
            res.status(403).send("Usuario no Encontrado")
        }
    }
    else{
        res.status(403).send("Sin Usuario")
    }
    next();
}

module.exports = {validateIsAdmin, validateUser}