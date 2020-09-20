let express = require('express');
let app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
// set up variables to use packages
let router = express.Router();
router.use(bodyParser.urlencoded({extended:false}));
//use public folder for CSS etc.
app.use(express.static(__dirname+'/public'));

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
router.use(session({
  secret: 'superrandomsecret',
  resave: false,
  saveUninitialized: true,

  // 디폴트 옵션으로 ./sessions 폴더 자동으로 생성됨
  store: new FileStore()
}));


// 로그아웃
router.get('/', function(req, res) { 

  req.session.destroy(function(err) {
    res.render('login');
  });

  
});

module.exports = router;