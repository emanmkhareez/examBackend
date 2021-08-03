const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const axios = require('axios')
require('dotenv').config()
const server = express()
server.use(cors())
server.use(express.json())
PORT = process.env.PORT
mongoose.connect(`${process.env.DB_ATLAS}`, { useNewUrlParser: true, useUnifiedTopology: true });

//listen FUnction
server.listen(PORT, () => {

    console.log('myport ', PORT)
})

const RecipeSchema = new mongoose.Schema({
    label: String,
    image: String,
    source: String


});

const userSchema = new mongoose.Schema({
    email: String,
    RecipeArr: [RecipeSchema]
})
const userModel = mongoose.model('person', userSchema);



function seedfun() {
    const Razan = new userModel({
        email: "razan@email.com",
        RecipeArr: [{

            label: "meat",
            image: "https://www.edamam.com/web-img/65a/65a7ad1b644869cd901aafd23aa3bf11.jpeg",
            source: "wwwwww"
        }]

    })
    const eman = new userModel({
        email: "emkhareez19@gmail.com",
        RecipeArr: [{

            label: "fisih",
            image: "https://www.edamam.com/web-img/65a/65a7ad1b644869cd901aafd23aa3bf11.jpeg",
            source: "emmmmmmm"
        }]

    })
    Razan.save()
    eman.save()
}


// seedfun()
//ROUTE
//http:localhost:3002/
server.get('/', testFun)
//GEt data from API
// https://api.edamam.com/api/recipes/v2?type=public&q=chicken&app_id=eac936f6&app_key=7f9337deefbf0b8dbe0f0594c9990a6d
//http:localhost:3002/getData
server.get('/getData', getAPIData)
//http:localhost:3002/adddb
server.post('/adddb', addFun)
server.get('/getfromdb', getdatafromfun)
server.delete('/delFun/:idx', delfun)
server.put('/update/:idx', upadtefun)





function testFun(req, res) {
    res.send('good all😎😎😋')
}
let arrayRes = []
function getAPIData(req, res) {
    axios.get("https://api.edamam.com/api/recipes/v2?type=public&q=chicken&app_id=eac936f6&app_key=7f9337deefbf0b8dbe0f0594c9990a6d")
        .then(DataAPI => {
            arrayRes = DataAPI.data.hits.map(item => {
                return new Recipe(item)
            })
            console.log(arrayRes)
            res.send(arrayRes)
        })

}

function addFun(req, res) {
    console.log('emailllll', req.body)
    console.log('dddddd', req.query)
    let email = req.query.email
    let { label, image, source } = req.body
    userModel.find({ email: email }, (error, adddata) => {
        if (error) {
            res.send(error)
        }
        else {
            adddata[0].RecipeArr.push({
                label: label,
                image: image,
                source: source

            })
            adddata[0].save()
            res.send(adddata[0].RecipeArr)
        }

    })

}


function getdatafromfun(req, res) {
    console.log(req.query);
    let email = req.query.email
    userModel.find({ email: email }, (error, data2) => {
        if (error) {
            res.send(error)
        }
        else {

            res.send(data2[0].RecipeArr)
        }

    })

}

function delfun(req, res) {
    console.log('rrrr', req.params);
    console.log('ffff', req.query)
    let idx = Number(req.params.idx)
    let email = req.query.email

    console.log('jhgfdz', idx);
    userModel.find({ email: email }, (error, data) => {
        if (error) {
            res.send(error)
        }
        else {
            let dataAfterDel = data[0].RecipeArr.filter((item, index) => {
                return index !== idx
            })
            data[0].RecipeArr = dataAfterDel
            data[0].save()
            res.send(data[0].RecipeArr)

        }
    })
}

function upadtefun(req, res) {
    let email = req.query.email
    let idx = Number(req.params.idx)

    let { label, image, source } = req.body
    userModel.find({ email, email }, (error, data) => {
        if (error) {
            res.send(error)
        }
        else {
            data[0].RecipeArr.splice(idx, 1, {
                label:label ,
                image: image,
                source: source


            })
            data[0].save()
            res.send(data[0].RecipeArr)
        }

    })
}


class Recipe {
    constructor(item) {
        this.label = item.recipe.label;
        this.image = item.recipe.image;
        this.source = item.recipe.source;
    }
}
