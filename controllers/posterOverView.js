const posterOverVIew = async (req,res) =>{
    try{
    res.render("posteroverview")
    }catch(error){
        return res.json({error:error.message})
    }
}



module.exports = posterOverVIew