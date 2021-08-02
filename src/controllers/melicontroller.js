const axios = require('axios');
const fs = require("fs")
const csv = require("fast-csv")
const path = require('path');
const User = require('../models/user');

const meliController = {

    authorizeAccount: async (req, res) => {        
        try {  
            if (req.cookies.token) {    
                res.redirect("/upload")
                
            }else{   
                res.redirect("https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id="+process.env.APP_ID+"&redirect_uri="+process.env.REDIRECT_URI)           
            }
        } catch (error) {          
            res.redirect("/upload")
        }
    },
    generateTokenAxios: async (req, res) => {
        var code = req.cookies.meli

        let config = {
            headers: {
                "Accept": "application/json",
                "Content-type": "application/x-www-form-urlencoded"
            }
          }

        let data = {
            "grant_type":"authorization_code",
            "client_id":process.env.APP_ID,
            "client_secret":process.env.SECRET_KEY,
            "code":code,
            "redirect_uri":process.env.REDIRECT_URI  
        }

        let URL = "https://api.mercadolibre.com/oauth/token"

        const response = await axios.post(URL, data, config)

        console.log(response.data.access_token)
        res.cookie("token", response.data.access_token, {  httpOnly: true })
        res.cookie('meli', '', { maxAge: 1 }); //Elimino la cookie anterior
        res.redirect("/upload")
    },
    postProducts: async (req, res) => {
        const file = req.file
        if (!file) {
            const error = new Error('Please upload a file')
            error.httpStatusCode = 400
            res.redirect("/upload")
            //res.status(400).json(error);
        }
        console.log(file.originalname.split(".").pop())
        if (file.originalname.split(".").pop() != "csv") {
            const error = new Error('Please upload a CSV file')
            error.httpStatusCode = 400
            //res.status(400).json(error);
            res.redirect("/upload")
        }

        fs.createReadStream(path.resolve(__dirname, "../uploads", 'tobsfile.csv'))
        .pipe(csv.parse( {headers: true} ))
        .on("error", error => console.error(error))
        .on("data", data => publishItem(data, req.cookies.token, req.cookies.email))
       
        fs.unlinkSync(path.resolve(__dirname, "../uploads", 'tobsfile.csv'));
        
        res.redirect("/upload")
    }
    
}

const publishItem = async (data, token, email) => {  

    axios.post("https://api.mercadolibre.com/items", {
        "title":data.name,
        "category_id":"MLA6049",
        "price":data.price,
        "currency_id":data.currency,
        "available_quantity":data.qty,
        "buying_mode":"buy_it_now",
        "condition":data.condition,
        "listing_type_id":"gold_special",
        "pictures":[
            {
                "source":data.image
            }
        ],
        "attributes":[
            {
                "id":"BRAND",
                "value_name":"Marca del producto"
            },
            {
                "id":"MODEL",
                "value_name":"Modelo del producto"
            },
            {
                "id":"EAN",
                "value_name":data.EAN
            }
        ]
    },{
        headers:{
            'Authorization': 'Bearer '+ token
        }
    })
    .then(response => {
         console.log(response.data.permalink)
         User.saveProducts(JSON.stringify(response.data.permalink), email)
        })
    .catch(error => {
        console.log(error.response.data.cause[0].message)
        User.saveProducts(JSON.stringify(error.response.data.cause[0].message), email)
    })

    
};

module.exports = meliController