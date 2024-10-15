const CreatePage = async (req,res) =>{
    
    if(req.cookies.posterUser){
    res.render("create")
    }else{
        res.render("signin")
    }
}


module.exports = CreatePage