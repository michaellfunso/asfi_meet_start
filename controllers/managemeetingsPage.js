const managepostersPage = async (req, res) => {
  if(req.cookies.posterUser){
  res.render("managemeetings");
  }else{
    res.render("signin")
  }
};

module.exports = managepostersPage;
