var express = require('express');
const path = require("path");
var app = express();
var mysql = require('mysql');
var schedule = require('node-schedule');
var monitor = require('./monitor');
var moment = require('moment');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'neotracker_db'
});

connection.connect();
global.db = connection;

schedule.scheduleJob('0 0 0 0 0', () => {
  if (moment(Date.now()).day() == 1) {
    sql = "INSERT INTO week (week) VALUES ('"+ moment(Date.now()).format("YYYY-MM-DD") + "')"
    db.query(sql);
  }
  monitor.start();
});

var members = require('./routes/members');
var site = require('./routes/index');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/assets'));

// app.use('/membersPosts', membersPage);
// all the routes/paths
app.use('/', site);
app.use('/members', members);

app.use(function(req, res, err, next) {
  if (err) {
      console.log(err);
  }

  next(err);
});

module.exports = app;

var listener = app.listen(8000, function(){
  console.log('Listening on port ' + listener.address().port);
});
