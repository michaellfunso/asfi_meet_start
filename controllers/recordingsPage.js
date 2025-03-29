const isAdmin = require("./utils/isAdmin")

const recordingsPage= async (req,res) =>{
    try{
        
        if(req.cookies.posterUser){
            const useremail = req.user.email 
            const username  = req.user.username
            const roleAdmin = await isAdmin(useremail, username)
            if(roleAdmin){
                res.render("recordings")

            }else{
              res.render("userDashboard")
            }
        }else{
            res.render("signin")
        }
    }catch(error){
        return res.json({error:error.message})
    }
}



module.exports = recordingsPage