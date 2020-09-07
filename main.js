const express = require('express');
const app = express() ;
const path = require('path');
// Deploy할때 서버 환경에 포트넘버가 있는지 확인하고 없을경우 3000을 사용
const PORT = process.env.PORT || 3000;

let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));


// 일신 라우터
let loginRouter = require('./routes/login');
// 은석 라우터
let registerRouter = require('./routes/register'); 


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



// 일신 라우터
app.use('/', loginRouter); 
app.use('/login', loginRouter); 
// 은석 라우터
app.use('/register', registerRouter); 




// 미들웨어는 순차적으로 실행됨(next 파라미터 때문?), 여기까지 쭉 못찾으면 밑의 에러문구 실행
app.use(function(req, res, next){
  res.status(404).send("Sorry can't find that");
});

//* 4개의 파라미터를 가지고 있는 함수는 Express에서 에러를 핸들링하는 미들웨어로 정하자고 약속됨
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send("Something broke!");
})

app.listen(PORT, function() {
  console.log(`App listening on port ${PORT}!`)
});