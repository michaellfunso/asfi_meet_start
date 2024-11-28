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
router.get("/", dashboard)
router.get("/register", signupPage)
router.get("/create", loggedIn, CreatePage)
router.get("/join", loggedIn, joinPage)
router.get("/login", loginPage)
router.post("/api/login", login)
router.get("/meetings", loggedIn, dashboard);

router.get("/manageposters", loggedIn, posterOverVIew); 
router.get("/c/manage", loggedIn, managepostersPage)
router.get("/allChannels", channels)

router.post("/createMeeting", createMeeting)
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
router.get("/v3/:channel", joinMeeting)


router.get("*", async(req,res) =>{
    res.json({error:"INVALID URL"})
})

module.exports  = router