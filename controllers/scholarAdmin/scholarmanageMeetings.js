const getAllMeetingsForAdmin = require("../asfi_meet_v9/getAllMeetingsForAdmin");
const getPublicMeetings = require("../asfi_meet_v9/getPublicMeetings");
const isAdmin = require("../utils/isAdmin");

const scholarManageMeetings = async (req, res) => {
  if(req.cookies.posterUser){
    const useremail = req.user.email 
    const username  = req.user.username
    const roleAdmin = await isAdmin(useremail, username)
   
    if(roleAdmin){
      const publicMeetings = await getAllMeetingsForAdmin()
      res.render("adminScholarDashboard", {publicMeetings})
    }else{
      const publicMeetings = await getPublicMeetings()

      res.render("userDashboard", {publicMeetings})
    }
  }else{
    res.render("signin")
  }
};

module.exports = scholarManageMeetings;
