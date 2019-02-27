var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var DBdata;

var con = mysql.createConnection({
  host:"localhost",
  user:"NodeUser",
  password:"jimmy1596921",
  database:"messageBoard"
});
console.log("MySql Connected!");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.post('/', function(req, res ){
  res.sendfile('./public/index.html');
  inserDatabase(req.body.name, req.body.message);
});
app.get('/DBdata',function(req, res){
  selectDatabase();
  var index = 1;
  res.send(DBdata);
  console.log('Send data');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//get date
function getDate(){
  var currentTime = new Date();
  return currentTime.getFullYear() + "-"
          + (currentTime.getMonth()+1) + "-"
          + currentTime.getDate() + "- "
          + currentTime.getHours() + ":"
          + currentTime.getMinutes() + ":"
          + currentTime.getSeconds();
}

//insert a data to database
function inserDatabase(userName, messages){
    var sql = "INSERT INTO MBtable (user, message, date_time) VALUES ('" 
              + userName + "', '" 
              + messages + "', '" 
              + getDate() + "')";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
}

//get data from database
function selectDatabase(){
  con.query('SELECT *FROM MBtable', function (err, rows){
    if(err) throw err;
    DBdata = rows;
    console.log('Data received from MySql');
  });
}

module.exports = app;
