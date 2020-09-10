let express = require('express');

const bodyParser = require('body-parser');
// set up variables to use packages
let app = express.Router();
app.use(bodyParser.urlencoded({extended:false}));

// set up the DB connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/loginProject', {
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

app.post('/', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  var LoggedUser = mongoose.model('users', {
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
      res.render('loginResult', {session: session});
    } else {
      res.render('login', {error: 'Sorry, cannot login!'});
    }
  });
});

module.exports = app;