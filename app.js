const express = require("express");
// console.log(pdfJsPath);

const dotenv = require("dotenv").config();
const cors = require('cors');


const app =  express();
app.use(cors());
const cookie = require("cookie-parser");
const PORT = process.env.PORT || 2020;


const server = require("http").Server(app)
const session = require("express-session"); 

const bodyParser = require("body-parser");

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));


  app.use(express.urlencoded({ extended: true }));
app.use(cookie());
app.use(express.json());


app.set("view engine", "ejs");
app.set("views", ["./views"]);

app.use("/assets", express.static(__dirname + '/public/assets', {type: 'files'}))
app.use("/css", express.static(__dirname + "/public/css", { type: 'text/css' }))
app.use("/js", express.static(__dirname + "/public/js", { type: 'text/javascript' }))
app.use("/js", express.static(__dirname + "/public/js", { type: 'text/javascript' }))

app.use("/recordings", express.static("recordings"));
// app.use("/recordings", express.static(__dirname + '/recordings', {type: 'files'}))




// CreateTableForPosterDecks();


app.use("/", require("./routes/pages"));
// server.listen(PORT);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 
// client.end();  // Close the client when you're done with your queries  