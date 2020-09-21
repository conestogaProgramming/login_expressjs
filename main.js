const express = require('express');
const app = express() ;
const path = require('path');
require('dotenv').config();
const port = process.env.PORT;

let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));

let loginRouter = require('./routes/login');
let registerRouter = require('./routes/register');
let verifyRouter = require('./routes/loginAfter');
let logoutRouter = require('./routes/logout');

// view 경로 설정
// app.set('views', __dirname + '/public');
// set view경로 설정과 static folder 설정의 차이는 뭘까?
// app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
// set path to public folders and view folders
app.set('views', path.join(__dirname, 'views'));
//use public folder for CSS etc.
app.use(express.static(__dirname+'/public'));

app.use('/', loginRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/verify', verifyRouter);

// 미들웨어는 순차적으로 실행됨(next 파라미터 때문?), 여기까지 쭉 못찾으면 밑의 에러문구 실행
app.use(function(req, res, next){
  res.status(404).send("Sorry can't find that");
});

//* 4개의 파라미터를 가지고 있는 함수는 Express에서 에러를 핸들링하는 미들웨어로 정하자고 약속됨
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send("Something broke!");
})

app.listen(port, function() {
  console.log(`App listening on port ${port}!`)
});
