let express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
var path = require('path');

let router = express.Router();
let app = express();
// set up variables to use packages
router.use(bodyParser.urlencoded({extended:false}));
//use public folder for CSS etc.
//app.use(express.static(__dirname+'/public'));
app.use(express.static(path.join(__dirname, 'public'))); //  "public" off of current is root
// set up the DB connection
const mongoose = require('mongoose');
let mongoDBcloud = process.env.DB_URL;
mongoose.connect(mongoDBcloud, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// get expression session
const session = require('express-session');
let FileStore = require('session-file-store')(session);

// set up session
router.use(session({
  secret: 'superrandomsecret',
  resave: false,
  saveUninitialized: true,

  // 디폴트 옵션으로 ./sessions 폴더 자동으로 생성됨
  store: new FileStore(),
  cookie:{
    maxAge: 1000 * 60 * 5 // 5분후 폭파
  }
}));

router.get('/', function(req, res) {   
  res.render('login');
});


router.post('/', function(req, res) {
  let email = req.body.email;
  let password = req.body.password;

  let LoggedUser = mongoose.model('users', {
    firstName : String,
    lastName : String,
    email : String,
    password : String
  });

  LoggedUser.findOne({email: email, password: password}).exec(function(err, loggedUser){
    console.log('Error: ' + err);
    console.log('User: ' + loggedUser);
    if(loggedUser){
      console.log(`UserName: ${loggedUser.firstName} ${loggedUser.lastName}`);
      
      var rememberMe = req.body.rememberMe;

      if(rememberMe == 'yes'){
        req.session.cookie.expires = new Date(Date.now() + (1000 * 60 * 60 * 24))
      }
      //store username in session and set logged in true
      req.session.userName = loggedUser.firstName;
      req.session.userLoggedIn = true;
      console.log(req.session);
    

      // redirect to the dashboard
      res.render('loginResult', {session: req.session});
    } else {
      res.render('login', {error: 'Sorry, cannot login!'});
    }
  });

});

module.exports = router;