const axios = require('axios');

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
    }
    
}



module.exports = meliController