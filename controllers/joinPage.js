const { config } = require("dotenv");
const meetingExists = require("./asfi_meet_v9/meetingExists");
const dbPromise = require("../routes/dbPromise.config");
const formatDateTime = require("./utils/formatTime");

const joinPage = async (req, res) => {
    try {
        const meetingId = req.params.meeting;
        const meetingRoom = process.env.MEET;
        const postersRoom = 'https://posters.asfischolar.com'; // Consider moving to config
        
        // Check if meeting exists
        const meetingData = await meetingExists(meetingId);
        if (!meetingData?.channel) {
            return res.render("404", { message: "Meeting does not exist" });
        }

        // Determine user permissions
        const isGroupOwner = meetingData.isGroupOwner == req.user.id || req.user.acct_type === "administrator";
        
        const [registrationCheck] = await dbPromise.query(
            "SELECT * FROM pre_registration WHERE meetingId = ? AND userId = ?", 
            [meetingData.id, req.user.id]
        );
      
        const hasRegistered = registrationCheck.length > 0;
   
        const formattedTime = formatDateTime(meetingData.time);
        // Handle private meeting access
        
        if (meetingData.privateMeeting == "yes" && !isGroupOwner && meetingData.preRegistration === "no") {
            return res.render("404", {
                message: "This meeting is private. You need to be the owner or be added to the participant list."
            });
        }

        // Handle pre-registration cases
        if (meetingData.preRegistration === "yes") {
            if (!isGroupOwner && !hasRegistered) {
                return res.render("pre-registration", {
                    meetingId,
                    postersRoom,
                    meetingRoom,
                    isOwner: isGroupOwner,
                    isActive:true,
                    meetingData
                });
            }

            if (isGroupOwner && meetingData.hasStarted === "false" ) {
                return res.render("admin-waitingPage", {
                    meetingId,
                    postersRoom,
                    meetingRoom,
                    isOwner: isGroupOwner,
                    meetingData,
                    isActive:true,
                    meetingTime: formattedTime
                });
            }

            if (!isGroupOwner && hasRegistered && meetingData.hasStarted === "false") {
                return res.render("waiting-page", {
                    meetingId,
                    postersRoom,
                    meetingRoom,
                    isOwner: isGroupOwner,
                    meetingData,
                    isActive:true,
                });
            }
        }
        // Handle meeting start conditions
        if ((meetingData.hasStarted === "true" || meetingData.hasStarted === true) && 
            (isGroupOwner || (hasRegistered && !isGroupOwner && meetingData.preRegistration === "yes"))) {
            return res.render("joinBrute", {
                meetingId,
                postersRoom,
                meetingRoom,
                isActive:true,
                isOwner: isGroupOwner
            });
        }
    
         if (meetingData.preRegistration === "no" && meetingData.privateMeeting === "no" ) {
            return res.render("joinBrute", {
                meetingId,
                postersRoom,
                meetingRoom,
                isActive:true,
                isOwner: isGroupOwner
            });
        }

        // Default case (shouldn't normally reach here)
        return res.render("404", { message: "Unable to determine meeting access" });

    } catch (error) {
        console.error("Error in joinPage:", error);
        return res.status(500).render("500", { 
            message: "An unexpected error occurred",
            error: process.env.NODE_ENV === "development" ? error.message : null
        });
    }
};

module.exports = joinPage;