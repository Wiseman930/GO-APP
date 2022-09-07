
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
 /* ssl: {
    rejectUnauthorized: false,
  },*/
};

const db = pgp(config);
const myRegs = registrationList(db)

//routes folder
const reggies = require('./routes/routes')
const theRegs = reggies(myRegs)

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


app.get("/", theRegs.mainDisp);
app.post("/reg_numbers", theRegs.dispRegs );

app.post("/reg_numbers2", theRegs.cities );


  app.post("/reset", theRegs.resettingAll);

let PORT = process.env.PORT || 3007;

app.listen(PORT, function(){
  console.log('App starting on port', PORT);
});