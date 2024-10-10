const loginPage = async (req,res) =>{
    if(req.cookies.posterUser){
        res.redirect("/create")
    }else{
    res.render("signin")
    }
}

module.exports = loginPage