const { db } = require("../../routes/db.config");
const { createSecretSalt, generateUserToken, GenerateRandomID } = require("../utils/saltAndToken");
const { v4: uuidv4 } = require('uuid'); 

const createMeeting = async (req,res) =>{
    try{
    const channelId = uuidv4();
    const hostId = uuidv4();
    const attendeeId = uuidv4();
 
    
    const secretSalt = createSecretSalt()
    const rtcToken = generateUserToken(channelId)
    const rtmToken = generateUserToken(channelId)
    const {roomName, roomId} = req.body
    console.log(roomId)
    const pstn = "123-456-7890"

    db.query("INSERT INTO channels SET ?", [{title:roomName,channel_secret:channelId, pstn:pstn, host:hostId, view:attendeeId, channel:channelId,
        secret: secretSalt,
        mainUserRTCToken: rtcToken,
        mainUserRtmToken: rtmToken,
        whiteboardRoomUUid:channelId,
        whiteboardRoomToken:channelId,
        screenShareRtcToken:rtcToken,
        screenShareRtmToken:rtmToken,
        screenShareUid: GenerateRandomID(),
        }], async (err, inserted) =>{
            if(err){
                console.log(err)
                return res.json({error:err})
            }else{

                return res.json({success:`Meeting Created Succesfully host: ${hostId}, attendee:${channelId}`, host:hostId, attendee:attendeeId})
            }
        })
    }catch(error){
        return res.json({error:error.message})
    }

}

module.exports = createMeeting