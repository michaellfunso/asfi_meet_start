const { config } = require("dotenv")
const meetingExists = require("./asfi_meet_v9/meetingExists")

const joinPage = async (req,res)=>{
    try{
        const meetingId = req.params.meeting
        const meetingRoom= process.env.MEET 
        // const postersRoom = process.env.POSTERS
        const postersRoom = 'https://posters.asfischolar.com'
        
        // Check if the meeting Exists  
        const isMeeting = await meetingExists(meetingId)
        let isGroupOwner = false
        if(isMeeting !== false){
            const meetingData = isMeeting
            if(meetingData.isGroupOwner == req.user.id){
                isGroupOwner = true
            }
        }
        if(isMeeting === false){
            res.render("404", {message:"Meeting does not exist"})
        }else{
            res.render("joinBrute", {meetingId, postersRoom, meetingRoom, isOwner:isGroupOwner}) 
        }
        // Check if the meeting is public
    }catch(error){
        console.log(error)
        return res.json({error:error.message})
    }
}



module.exports = joinPage