let express = require('express');
let router = express.Router();

require('dotenv').config();

const app = express() ;
const path = require('path');

let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
// set path to public folders and view folders
app.set('views', path.join(__dirname, 'views'));
//use public folder for CSS etc.
app.use(express.static(__dirname+'/public'));
const { body } = require('express-validator/check');
const nodemailer = require('nodemailer');


const mongoose = require('mongoose');
let mongoDBcloud = process.env.DB_URL;
mongoose.connect(mongoDBcloud, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// set up the model for the user info 
const User = mongoose.model('User', {
  firstName : String,
  lastName : String,
  email : String,
  password : String
})

//Validation
const {check, validationResult} = require('express-validator'); // ES6 standard for destructuring an object
const { selectFields } = require('express-validator/src/select-fields');

var emailRegex = /([a-zA-Z0-9]{1,}@[a-zA-Z0-9]{1,}.[a-z]{2,}\.?[a-z]{2,}?)/;
var passwordRegex = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
//function to check a value using regular expression
function checkRegex(userInput, regex){
  if(regex.test(userInput)){
      return true;
  }
  else{
      return false;
  }
}

// Custom password validation function
function customPasswordValidation(value){
  if(!checkRegex(value, passwordRegex)){
      throw new Error('Password should be at least 6 to 16 maximum');
  }
  return true;
}

router.get('/',function(req, res) {   

  res.render('register')
});

router.post('/', [
  check('firstName', 'Must have a first name').not().isEmpty(),
  check('lastName', 'Must have a last name').not().isEmpty(),
  check('email', 'Must have email').isEmail(),
  check('inputPassword').custom(customPasswordValidation),
  body('inputPassword').custom((value, { req }) => {
    if (value !== req.body.repeatPassword) {
        throw new Error('Password confirmation does not match password');
        }
        return true;
  })], function(req, res){

    // 이메일 인증 using nodemailer
    let email = req.body.email;
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_ID, // gmail 계정 아이디
        pass: process.env.MAIL_PW // gmail 계정 비밀번호
      }
    });
    let mailOptions = {
      from: process.env.MAIL_ID,    // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
      to: email ,                     // 수신 메일 주소
      subject: 'Hello. This is CodingProject. Please verify your email.',
      html: '<p>Please click the below link !</p>' +
        "<a href='http://localhost:3000/verify/?email="+ email +"&token=abcdefg'>Verify</a>"
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      }
      else {
        console.log('Email sent: ' + info.response);
      }
    });
    

    const errors = validationResult(req);
    console.log(errors);

    if(!errors.isEmpty()){
        res.render('register', {
          errors:errors.array()
      });
    } else {
      var firstName = req.body.firstName; 
      var lastName = req.body.lastName;
      //var email = req.body.email;
      var inputPassword = req.body.inputPassword;
      var repeatPassword = req.body.repeatPassword;

      // create an object to store in the DB
      var userObject = {
        firstName : firstName,
        lastName : lastName,
        email : email,
        password : inputPassword 
      }
      // Store DB
      var newUser = new User(userObject);

      //Save the user 
      newUser.save().then(function(){
        console.log('a new user information saved');
      }).then(function(){
        // Fetch Data from MongoDB 
        User.findOne({firstName : firstName, lastName : lastName, email : email}, function(err, user){
          console.log(err);
          res.render('registerResult', {userResult : user })
        });
      });
    }
  }
  
);

module.exports = router;
