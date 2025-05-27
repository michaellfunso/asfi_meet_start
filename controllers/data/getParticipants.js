const dbPromise = require("../../routes/dbPromise.config");

const getParticipants = async (req, res) => {
    try {
       
        const meetingId = req.params.meetingId;
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;


        if (!meetingId) {
            return res.status(400).json({ error: "Meeting ID is required" });
        }
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Check meeting exists and user is owner/admin
        const [meetingCheck] = await dbPromise.query(
            "SELECT * FROM channels WHERE channel = ?", 
            [meetingId, userId]
        );
        if (meetingCheck.length === 0) {
            return res.status(404).json({ 
                error: "Meeting does not exist or you are not the owner" 
            });
        }

        const meetingData = meetingCheck[0];
        const isOwner = meetingData.isGroupOwner == userId || 
                       req.user.acct_type === "administrator";

        if (!isOwner) {
            return res.status(403).json({ 
                error: "You are not the owner of this meeting" 
            });
        }

        // Get total count for pagination
        const [countResult] = await dbPromise.query(
            "SELECT COUNT(*) as total FROM pre_registration WHERE meetingId = ?",
            [meetingData.id]
        );
        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        // Fetch paginated participants
        const [participants] = await dbPromise.query(
            `SELECT * FROM pre_registration 
             WHERE meetingId = ? 
             LIMIT ? OFFSET ?`,
            [meetingData.id, limit, offset]
        );

        
        if (participants.length === 0) {
            return res.json({ 
                error: "No participants found for this meeting",
                participants:[],
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages
                }
            });
        }

        return res.json({
            success: "Participants fetched successfully",
            participants,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = getParticipants;