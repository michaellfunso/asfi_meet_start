const { config } = require("dotenv")

const CreatePage = async (req,res) =>{
    
    const createMeetLink = process.env.MEET
    // res.redirect(createMeetLink)
    if(req.cookies.posterUser){ 
    res.render("create", {meet_endpoint:createMeetLink})
    }else{
        res.render("signin")
    }
}


module.exports = CreatePage