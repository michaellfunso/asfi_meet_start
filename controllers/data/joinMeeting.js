const { config } = require("dotenv");
const findChannelByPassphrase = require("./findChannel");
const findChannelByHost = require("./findChannelByHost");
const MeetingExists = require("./channelExists");

const joinMeeting = async (req, res) => {
  try {
    const { channel } = req.params;

    const meetingExsits = await MeetingExists(channel)
    // Check if the meeting exists 
    if(meetingExsits.channel){
    const MeetingData = await findChannelByPassphrase(channel);

    if (MeetingData.channel) {

      // Use a POST redirect by rendering an HTML form
    if(MeetingData.waitingRoom === "yes") {
       return res.render("waitingRoom")
    }else{
        return res.redirect(`${process.env.ASFI_MEET_ENDPOINT}/v3/${MeetingData.view}`)
    }
    } else {
        const MeetingByHost = await findChannelByHost(channel)
        if(MeetingByHost.channel){
           return res.redirect(`${process.env.ASFI_MEET_ENDPOINT}/v3/${MeetingByHost.host}`)
        }else{
    return res.json({ error: "invalid Meeting ID" });
        }
    }

}else{
    return res.json({ error: "invalid Meeting ID" });
}

  } catch (error) {
    return res.json({ error: error.message });
  }
};

module.exports = joinMeeting;
