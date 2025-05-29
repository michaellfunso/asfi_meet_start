const validateGuest = async (req,res) =>{
try{

}catch(error){
    console.log(error)
    return res.json({error:error.message})
}
}


module.exports = validateGuest