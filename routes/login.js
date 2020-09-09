let express = require('express');
let router = express.Router();
let register = require('./register.js');

const bodyParser = require('body-parser');
// set up variables to use packages
var app = express();
app.use(bodyParser.urlencoded({extended:false}));

// set up the DB connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/loginProject', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// get expression session
const session = require('express-session');

// set up session
app.use(session({
  secret: 'superrandomsecret',
  resave: false,
  saveUninitialized: true
}));


router.get('/', function(req, res) {   
  res.render('login');
});

router.post('/', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  var loggedUser = mongoose.model('users', {
    firstName : String,
    lastName : String,
    email : String,
    password : String
  });

  loggedUser.findOne({email: email, password: password}).exec(function(err, user){
    console.log('Error: ' + err);
    console.log('User: ' + user);
    if(user){
       console.log('UserName: ' + user.firstName + user.lastName);
        //store username in session and set logged in true
        req.session.userName = user.firstName;
        req.session.userLoggedIn = true;
        // redirect to the dashboard
        res.redirect('/loginResult');
    }
    else{
        res.render('login', {error: 'Sorry, cannot login!'});
    }
  });

});


module.exports = router;