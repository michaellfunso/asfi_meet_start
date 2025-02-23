const { config } = require("dotenv")

const joinPage = async (req,res)=>{
    try{
        const meetingId = req.params.meeting
        const meetingRoom= process.env.MEET 
        const postersRoom = process.env.POSTERS
        
    res.render("joinBrute", {meetingId, postersRoom, meetingRoom}) 
    }catch(error){
        console.log(error)
        return res.json({error:error.message})
    }
}



module.exports = joinPage