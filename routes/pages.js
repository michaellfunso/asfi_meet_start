const express = require("express")
const loginPage = require("../controllers/loginPage")
const signupPage = require("../controllers/signUpPage")
const CreatePage = require("../controllers/createPage")
const joinPage = require("../controllers/joinPage")
const managepostersPage = require("../controllers/managepostersPage")
const joinMeeting = require("../controllers/data/joinMeeting")
const createMeeting = require("../controllers/data/createMeeting")
const login = require("../controllers/data/login")
const router = express.Router()
const bodyParser = require("body-parser");
const loggedIn = require("../controllers/data/loggedIn")
const channels = require("../controllers/data/channels")
const dashboard = require("../controllers/managemeetingsPage")
const meetingLinks = require("../controllers/data/meetingLinks")
const getMostLiked = require("../controllers/data/getMostLiked")
const getMostdisliked = require("../controllers/data/getMostDisliked")
const getMostRated = require("../controllers/data/getMostRated")
const getMostviewed = require("../controllers/data/getMostViewed")
const getPosterTitle = require("../controllers/data/getPosterTItle")
const posterOverVIew = require("../controllers/posterOverView")
const recordingsPage = require("../controllers/recordingsPage")
const createRoomButton = require("../controllers/external/createRoom")
const deleteMeeting = require("../controllers/asfi_meet_v9/deleteMeeting")
const startASFIScholarCall = require("../controllers/asfi_meet_v9/startCallFromASFISCHOLAR")
const createAdmin = require("../controllers/asfi_meet_v9/createAdmin")
const manageAdminsPage = require("../controllers/manageAdminsPage")
const deleteAdmin = require("../controllers/asfi_meet_v9/deleteAdmin")
const asfiMeetFileUpload = require("../controllers/asfi_meet_v9/uploadToCloudinary")
const uploadRecordings = require("../controllers/asfi_meet_v9/uploadRecording")
const getRecordings = require("../controllers/asfi_meet_v9/getRecorfings")
const downloadAsMp4 = require("../controllers/asfi_meet_v9/downloadAsMp4")
const ScholarAdmin = require("../controllers/scholarAdmin/scholarAdminLoggedIn")
const SCholarManagePosters = require("../controllers/scholarAdmin/scholarManagePosters")
const scholarManageMeetings = require("../controllers/scholarAdmin/scholarmanageMeetings")
const getTotalPosters = require("../controllers/data/getTotalPosters")
const startMeeting = require("../controllers/asfi_meet_v9/startMeeting")
const resetMeeting = require("../controllers/asfi_meet_v9/resetMeeting")
const preRegistration = require("../controllers/data/preRegistration")
const getParticipants = require("../controllers/data/getParticipants")
const deleteParticipant = require("../controllers/data/deleteParticipant")

router.use(express.json())
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.urlencoded({ extended: true }));


router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
}); 
router.get("/dashboard", loggedIn, dashboard)
router.get("/", async(req,res) =>{
    res.render("home")
})
router.get("/terms", async(req,res) =>{
    res.render("terms")
})
router.get("/documentation", async(req,res) =>{
    res.render("documentation")
})
router.get("/register", signupPage)
router.get("/login", loginPage)
router.post("/api/login", login)
router.get("/meetings", loggedIn, dashboard);

router.get("/recordings", loggedIn, recordingsPage);
router.get("/posteroverview", loggedIn, posterOverVIew); 
router.get("/manageposters", loggedIn, managepostersPage)
router.get("/allChannels", channels)
 
router.post("/createMeeting", loggedIn, createMeeting)
router.get("/v9/m/:channel", meetingLinks)

router.get("/mostLiked", getMostLiked)
router.get("/mostDisliked", getMostdisliked)
router.get("/mostViewed", getMostviewed) 
router.get("/mostRated", getMostRated)
router.get("/posterDetails/:posterId", getPosterTitle)
// router.get("/:passphrase", async(req,res) =>{ 
//   const passPhrase = req.params.passPhrase 
//   res.redirect(`/v3/${passPhrase}`)
// })
// router.get("/v3/:channel", joinMeeting)
router.post("/deleteMeeting", loggedIn, deleteMeeting)
router.get("/create", loggedIn, CreatePage)
router.get("/createMeetingFromRequest", createRoomButton)
router.get("/join/:meeting", loggedIn, joinPage)
router.get("/call/:meeting", startASFIScholarCall)
router.post("/createAdmin", loggedIn, createAdmin)
router.get("/createAdmin", loggedIn, manageAdminsPage)
router.post("/deleteAdmin", loggedIn, deleteAdmin)
router.post("/asfiMeetFileUpload", asfiMeetFileUpload)
router.post("/uploadRecording", uploadRecordings)
router.get("/r/download/:meetingId", downloadAsMp4)
router.get("/logout",(req,res) => {
  
  res.clearCookie('posterUser');

  res.redirect('/');
  
})

// FOr Scholar Admin 
router.get("/posters/:user", ScholarAdmin, SCholarManagePosters)
router.get("/meetings/:user", ScholarAdmin, scholarManageMeetings)
router.post("/getTotalPosters", getTotalPosters)
router.post("/meetings/start", loggedIn, startMeeting)
router.post("/meetings/reset", loggedIn, resetMeeting)
router.post("/pre-reg", loggedIn, preRegistration)
router.get("/api/participants/:meetingId", loggedIn, getParticipants)
router.delete("/api/participants/delete/:participantId", loggedIn, deleteParticipant)
router.get("/participants/:meetingId", loggedIn, (req,res) => {
const meetingId = req.params.meetingId || "test-seminar-12345";
    res.render("participants-list", {meetingId, userId:req.user.id, page:1, limit:10, total:0, totalPages:0, participants:[], isActive:true})
})


router.get("/live", (req,res) => {
    res.redirect(`https://support.google.com/youtube/answer/2474026`)
})
router.get("*", async(req,res) =>{
    res.render("404", {message:"Page Not Found"})

    // res.json({error:"INVALID URL"})
})

module.exports  = router