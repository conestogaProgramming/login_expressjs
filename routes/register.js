let express = require('express');
let router = express.Router();
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
      })
] ,function(req, res){
  const errors = validationResult(req);
  console.log(errors);

  if(!errors.isEmpty()){
    res.render('register', {
      errors:errors.array()
    });
  }
  else{
  var firstName = req.body.firstName; 
  var lastName = req.body.lastName;
  var email = req.body.email;
  var inputPassword = req.body.inputPassword;
  var repeatPassword = req.body.repeatPassword;



  
  console.log(firstName);
  console.log(lastName);
  console.log(email);
  console.log(inputPassword);
  console.log(repeatPassword);
}
  res.render('registerResult')
});

module.exports = router;