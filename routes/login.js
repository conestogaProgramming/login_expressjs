let express = require('express');
let router = express.Router();
let register = require('./register.js');

const bodyParser = require('body-parser');
let app = express();
// set up variables to use packages
let router = express.Router();
router.use(bodyParser.urlencoded({extended:false}));
//use public folder for CSS etc.
app.use(express.static(__dirname+'/public'));

// set up the DB connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/loginProject', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});



// get expression session
const session = require('express-session');

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

// 로그아웃
// app.get('/logout', function(req, res) {
  
//   req.session.destroy(function(err) {
//     res.redirect('/');
//   })
// });

router.post('/', function(req, res) {
  let email = req.body.email;
  let password = req.body.password;

  var loggedUser = mongoose.model('users', {
    firstName : String,
    lastName : String,
    email : String,
    password : String
  });

  loggedUser.findOne({email: email, password: password}).exec(function(err, user){
    console.log('Error: ' + err);
    console.log('User: ' + loggedUser);
    if(loggedUser){
      console.log(`UserName: ${loggedUser.firstName} ${loggedUser.lastName}`);
      
      var rememberMe = req.body.rememberMe;

      if(rememberMe == 'yes'){
        //store username in session and set logged in true
        req.session.userName = loggedUser.firstName;
        req.session.userLoggedIn = true;
        console.log(req.session);
      }

      // redirect to the dashboard
      res.render('loginResult', {session: req.session});
    } else {
      res.render('login', {error: 'Sorry, cannot login!'});
    }
  });

});

module.exports = router;