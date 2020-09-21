let express = require('express');
let app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
// set up variables to use packages
let router = express.Router();
router.use(bodyParser.urlencoded({extended:false}));
//use public folder for CSS etc.
app.use(express.static(__dirname+'/public'));



// 로그아웃
router.get('/', function(req, res) { 


  req.session.destroy(function(err) {
    res.render('login');

  });

  
});

module.exports = router;