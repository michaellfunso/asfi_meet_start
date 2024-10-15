const login = async (req,res) =>{
    try{
    const {user, pass} = req.body
    console.log(process.env.ASFISCHOLAR_ENDPOINT)

async function response() {
        return  await fetch(`${process.env.ASFISCHOLAR_ENDPOINT}/api/login`, {
        method:"POST",
        body:JSON.stringify({user:user, pass:pass}),
        headers:{
            "Content-type": "application/json"
        }
    }).then(res=>res.json())
    .then(data =>{
        console.log(data)
        return data
    })
}
    const responseData = await response()
    const cookieOptions = {
        expiresIn: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        httpOnly: true
    } 
    if(responseData.success){
        res.cookie("posterUser", responseData.userToken, cookieOptions)
        res.json({status: "success", success: "User Logged in",})
    }else{
        return res.json({status:"error", error:responseData.error})
    }
}catch(error){
    console.log(error)
    return res.json({status:"error", error:error.message})
}
}

module.exports = login