const loginPage = async (req,res) =>{
    if(req.cookies.posterUser){
        res.redirect("/dashboard")
    }else{
    res.render("signin", {meetingId:""})
    }
}

module.exports = loginPage