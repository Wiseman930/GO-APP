
const express = require("express");  //npm install express
const exphbs = require("express-handlebars"); //npm install --save express-handlebars
const bodyParser = require("body-parser");//npm install --save body-parser
const flash = require("express-flash");// npm i express-flash
const session = require("express-session"); // npm install express-session
const registrationList = require("./registrations.js");
let app = express();

const pgp = require("pg-promise")();// npm i pg-promise

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  useSSL = true;
}
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:pg1999@localhost:5432/registrationdb";

const config = {
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const db = pgp(config);
const myRegs = registrationList(db)

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.use(
    session({
      secret: "string for session in http",
      resave: false,
      saveUninitialized: true,
    })
  );
  app.use(flash());
  app.set("view engine", "handlebars");
  app.use(express.static("public"));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());


app.get("/",async function(req, res){
  res.render("index", {
    displayRegs: await myRegs.dispRegistration(),
    displayError: myRegs.returnForEmptyBox()

  });

});
app.post("/reg_numbers", async function(req, res){
    let fromtextBox = req.body.regNumber;
     await myRegs.errors(fromtextBox)
     await myRegs.takentext(fromtextBox)
     await myRegs.selectAllregs()
    req.flash("errors", myRegs.returnForEmptyBox());

    res.redirect("/");
  });
app.post("/reg_numbers2", async function(req, res){
    let typeOfTown = req.body.cityType;
    await myRegs.dispRegistration(typeOfTown)
    res.redirect("/");
  });


  app.post("/reset", async function(req, res){
    await myRegs.resetAll()
    await myRegs.dispRegistration()
    req.flash("errors", myRegs.returnForEmptyBox());
    res.redirect("/");
  });

let PORT = process.env.PORT || 3007;

app.listen(PORT, function(){
  console.log('App starting on port', PORT);
});