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



router.get('/', function(req, res) {   
  res.render('register')
});

router.post('/', function(req, res){
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

  res.render('registerResult')
});

module.exports = router;