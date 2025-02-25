const { config } = require("dotenv")

const CreatePage = async (req,res) =>{
    
    const createMeetLink = process.env.MEET
    if(req.cookies.posterUser){ 
    res.render("create", {createMeetLink})
    }else{
        res.render("signin")
    }
}


module.exports = CreatePage