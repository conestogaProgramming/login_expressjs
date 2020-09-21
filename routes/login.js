let express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
// set up variables to use packages
let app = express.Router();
app.use(bodyParser.urlencoded({extended:false}));

// set up the DB connection
const mongoose = require('mongoose');
let mongoDBcloud = process.env.DB_URL;
mongoose.connect(mongoDBcloud, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// get expression session
let session = require('express-session');
let FileStore = require('session-file-store')(session);

// set up session
app.use(session({
  secret: 'superrandomsecret',
  resave: false,
  saveUninitialized: true,

  // 디폴트 옵션으로 ./sessions 폴더 자동으로 생성됨
  store: new FileStore()
}));

app.get('/', function(req, res) {   
  res.render('login');
});

// 로그아웃
app.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    res.redirect('/');
  })
});

app.post('/', function(req, res) {
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

module.exports = app;