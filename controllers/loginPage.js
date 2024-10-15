const loginPage = async (req,res) =>{
    if(req.cookies.posterUser){
        res.redirect("/meetings")
    }else{
    res.render("signin")
    }
}

module.exports = loginPage