const express = require("express")
const loginPage = require("../controllers/loginPage")
const signupPage = require("../controllers/signUpPage")
const CreatePage = require("../controllers/createPage")
const joinPage = require("../controllers/joinPage")
const joinMeeting = require("../controllers/data/joinMeeting")
const createMeeting = require("../controllers/data/createMeeting")
const login = require("../controllers/data/login")
const router = express.Router()
const bodyParser = require("body-parser");

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
router.get("/",loginPage)
router.get("/register", signupPage)
router.get("/create", CreatePage)
router.get("/join", joinPage)
router.get("/login", loginPage)
router.post("/api/login", login)

router.post("/createMeeting", createMeeting)

// router.get("/:passphrase", async(req,res) =>{
//   const passPhrase = req.params.passPhrase 
//   res.redirect(`/v3/${passPhrase}`)
// })
router.get("/v3/:channel", joinMeeting)


router.get("*", async(req,res) =>{
    res.json({error:"INVALID URL"})
})

module.exports  = router