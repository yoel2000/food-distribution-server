// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var cors = require('cors');
app.use(
  cors({
    origin: "http://localhost:3000", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
   })
);var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
const socket = require("socket.io");


var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "OPTIONS, GET, POST, PUT, PATCH, DELETE"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.setHeader("Access-Control-Allow-Credentials", true);

//   next(); // dont forget this
// });

require('./config/passport')(passport); // pass passport for configuration

//const corsOptions = { origin: "http://localhost:3000"}


/*app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))*/

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({extended : true}))
.use(bodyParser.json());
// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

// launch ======================================================================
let server= app.listen(port);
const io = socket(server,{cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }});
console.log('The magic happens on port ' + port);
// routes ======================================================================
require('./controllers/routes.js')(app, passport, io); // load our routes and pass in our app and fully configured passport


