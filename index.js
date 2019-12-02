const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5050

///////////////////////// Add Session//////////////////////////////
const session = require('express-session')
const bodyparser = require('body-parser')

const { Pool } = require('pg');
var pool;
pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    //ssl: true
});
var app = express();
pool.connect();

//middle wares
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret', // 对session id 相关的cookie 进行签名
    resave: true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie: {
        maxAge: 1000 * 60 * 3, // 设置 session 的有效时间，单位毫秒
    },
}));

app.get('/', async (req, res) => {
    res.render('pages/magicMatrix');
});


//////////////// Go Back to Home//////////////////////
app.post('/home', (req, res) => res.render('pages/magicMatrix'));

//////////////// Go to Tutorial /////////////////////
app.post('/tutorial', (req, res) => res.render('pages/tutorial'));

//////////////// Go to Login Pages /////////////////////
app.post('/login', (req, res) => {
    req.session.userName = null;
    var deter = { 'determine': 0 };
    res.render('pages/login', deter);
});

//////////////// Judge user name, if is admin to admin pages; if is user to user pages /////////////////////
app.post('/login/interface', async (req, res) => {
    var user = req.body.userName;
    var client = await pool.connect();
    var check = await client.query(`SELECT * FROM userdata where username = '${user}'`);
    var checking = (check) ? check.rows : null;
    if (check.rowCount != 0) {
        checking.forEach(async function (t) {
            if (t.usertype == 'admin') {
                if (req.body.passWord == t.password) {
                    req.session.userName = user;    // Session
                    var admindisplay = await client.query(`select * from userdata where usertype = 'player'`);
                    var adminroom = await client.query(`SELECT * FROM room ORDER BY id ASC;`);
                    var results = { 'rows': admindisplay.rows, 'rooms': adminroom.rows };
                    // pool.query(admindisplay, (error, result) => {
                    //     if (error)
                    //         res.end(error);
                    //     var results = { 'rows': result.rows };
                    console.log(results);
                    res.render('pages/admin', results);
                    // });
                } else {
                    var determines = { 'determine': -1 };
                    res.render('pages/login', determines);
                }
            } else if (t.usertype == 'superuser') {
                if (t.password == req.body.passWord) {
                    req.session.userName = user;    //Session
                    var superdisplay = await client.query(`select * from userdata order by id`);
                    var superroom = await client.query(`SELECT * FROM room ORDER BY id ASC;`);
                    var results = { 'rows': superdisplay.rows, 'rooms': superroom.rows };
                    // pool.query(superdisplay, (error, result) => {
                    //     if (error)
                    //         res.end(error);
                    //     var results = { 'rows': result.rows };
                    // console.log(results);
                    res.render('pages/superuser', results);
                    // });
                } else {
                    var determines = { 'determine': -1 };
                    res.render('pages/login', determines);
                }
            } else {
                if (req.body.passWord == t.password) {
                    req.session.userName = user;
                    console.log(req.session.userName);
                    var display_score = `select rank() over (order by score desc) rank, username, score from userdata where usertype = 'player' limit 10;`;
                    //`select RANK() OVER(order by score desc) rank, username, score from userdata`
                    pool.query(display_score, (error, result) => {
                        if (error) {
                            res.end(error);
                        }
                        var results = { 'rows': result.rows, 'userName': user };
                        res.render('pages/homepages', results);
                    });
                } else {
                    var determines = { 'determine': -1 };
                    res.render('pages/login', determines);
                }
            }
        })
    } else {
        var determines = { 'determine': -2 };
        res.render('pages/login', determines);
    }
});
app.post('/login/GoogleInterface', (req, res) => {
    var user = req.body.user;
    var email = req.body.email;
    var check = `SELECT * FROM userdata WHERE email = '${email}'`;
    pool.query(check, async (error, result) => {
        if (error)
            res.end(error);
        if (result.rowCount == 0) {
            var insertQuery = `INSERT INTO userdata(email, username, password, score, usertype) VALUES ('${email}', '${user}', '000000', 0, 'player');`;
            pool.query(insertQuery, (error, result) => {
                if (error)
                    res.end(error);
                var display_score = `select RANK() OVER(order by score desc) rank, username, score from userdata where usertype = 'player'`;
                pool.query(display_score, (error, result) => {
                    if (error)
                        res.end(error);
                    var results = { 'rows': result.rows, 'userName': user };
                    res.render('pages/homepages', results);
                });
            });
        } else {
            var client = await pool.connect();
            var find = await client.query(`SELECT * FROM userdata WHERE email = '${email}';`);
            var finding = (find) ? find.rows : null;
            finding.forEach(function (t) {
                if (t.usertype == 'superuser') {
                    var superdisplay = `select * from userdata order by id`;
                    pool.query(superdisplay, (error, result) => {
                        if (error)
                            res.end(error);
                        var results = { 'rows': result.rows };
                        res.render('pages/superuser', results);
                    });
                } else if (t.usertype == 'admin') {
                    var admindisplay = `select * from userdata where usertype = 'player'`;
                    pool.query(admindisplay, (error, result) => {
                        if (error)
                            res.end(error);
                        var results = { 'rows': result.rows };
                        res.render('pages/admin', results);
                    });
                } else {
                    var display_score = `select RANK() OVER(order by score desc) rank, username, score from userdata where usertype = 'player'`;
                    pool.query(display_score, (error, result) => {
                        if (error)
                            res.end(error);
                        var results = { 'rows': result.rows, 'userName': t.username };
                        res.render('pages/homepages', results);
                    });
                }
            })
        }
    });
});

//////////////////////// Go to single player games pages///////////////////////////////////
app.post('/login/interface/singleplayer', async (req, res) => {
    var user = req.body.userName;
    console.log(user);
    var client = await pool.connect();
    var display_score = await client.query(`select rank() over (order by score desc) rank, username, score from userdata where usertype = 'player' limit 10;`);
    var results = { 'rows': display_score.rows, 'userName': user };
    res.render('pages/singleplayer', results);
});

// function onSignIn(googleUser) {
//   var profile = googleUser.getBasicProfile();
//   console.log('ID: ' + profile.getId());
//   console.log('Name: ' + profile.getName());
//   console.log('Email: ' + profile.getEmail());
// }

/////////////////////////// Go to signup pages//////////////////////////
app.post('/signup', (req, res) => {
    res.render('pages/signup');
});

app.post('/update', async (req, res) => {
    var name = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var repeatpassword = req.body.repeatpassword;
    var judg = {};
    var judg_name = "new";
    var judg_email = "new";
    var client = await pool.connect();
    var check_user = await client.query(`SELECT * FROM userdata where username = '${name}';`);
    console.log(check_user.rowCount);
    if (check_user.rowCount >= 1) {
        err = 'Username already existed!';
        res.locals.error = err;
        res.render('pages/signup')
        return;
    }
    var check_email = await client.query(`SELECT * FROM userdata WHERE email = '${email}';`);
    if (check_email.rowCount >= 1) {
        err = 'email already existed!';
        res.locals.error = err;
        res.render('pages/signup')
        return;
    }
    if (judg_name == "new" && judg_email == "new") {
        var insertQuery = await client.query(`INSERT INTO userdata(email, username, password, score, usertype)VALUES('${email}', '${name}', '${password}', 0, 'player');`);
        res.render('pages/login', { 'determine': 0 });
    }
});
/////////////////////////// Go to signup pages//////////////////////////
app.get('/magicMatrix', (req, res) => {
    res.render('pages/magicMatrix')
});


//////////////////////////////  Write By Kevin/////////////////////////////////////////
app.post('/login/reset', (req, res) => {
    console.log("OK");
    res.render('pages/reset');
});
app.get('/login1', (req, res) => {
    res.render('pages/login');
});

var nodemailer = require("nodemailer");
var code = ""; //验证码
var data = {}; // 记录邮箱和验证情况

var transporter = nodemailer.createTransport({ //邮件传输
    host: "smtp.gmail.com", //qq smtp服务器地址
    port: 465, //qq邮件服务所占用的端口
    secure: true,
    auth: {
        user: "wengehuastudy2016@gmail.com", //开启SMTP的邮箱，有用发送邮件
        pass: "yrgg uyoh dihr fqqh" //授权码
    }
});

app.post('/login/reset/check', async (req, res) => {
    var email = req.body.email;
    console.log(email);

    // Create 验证码
    while (code.length < 7) {
        code += Math.floor(Math.random() * 10);
    }
    console.log(code);
    // Sent to Email
    var mailOption = {
        from: '<wengehuastudy2016@gmail.com.com>', //邮件来源
        to: email, //邮件发送到哪里，多个邮箱使用逗号隔开
        subject: 'Reset Password', // 邮件主题
        text: 'Pleaase click link to reset password', // 存文本类型的邮件正文
        html: '<h1>Your verification code is:' + code + '</h1>' // html类型的邮件正文
    };
    transporter.sendMail(mailOption, function (error, info) {
        if (error) {
            return console.info(error);
        } else {
            res.send("2");
            console.info("Message send" + code);
        }
    });
    //var emails = {'rows': email};
    data.email = email;
    data.num = 0;
    console.log(data);
    var datas = { 'data': (data) };
    console.log(datas);
    res.render('pages/check_email', datas);
});

app.post('/login/reset/:rows/new_password', (req, res) => {
    var eml = req.body.recemail;
    if (req.body.vercode == code) {
        var emls = { 'rows': eml };
        res.render('pages/newPassword', emls);
    } else {
        data.email = eml;
        data.num = 1;
        var datas = { 'data': (data) };
        console.log(datas);
        res.render('pages/check_email', datas)
    }
});
app.post('/login/reset/:rows/set_new_password', async (req, res) => {
    var pass = req.body.newPassword;
    console.log(pass);
    var eml = req.body.recemail;
    console.log(eml);
    var client = await pool.connect();
    var insertQuery = await client.query(`UPDATE userdata SET password = '${pass}' WHERE email = '${eml}'`);
    var check = await client.query(`SELECT * FROM userdata WHERE email='${eml}'`);
    var checking = (check) ? check.rows : null;
    var deter = 0;
    checking.forEach(function (t) {
        if (t.password == pass)
            deter = 1;
        else
            deter = 0;
    });
    res.render('pages/newPasswordDone', { 'rows': deter });
});
//////////////////////////////  Write By Kevin/////////////////////////////////////////

////////////////////////////// Admin //////////////////////////////////////////////////
//admin
app.post('/admin/user/:id', (req, res) => {
    var deletequery = `delete from userdata where userdata.id=${req.params.id}`;
    pool.query(deletequery, (error, result) => {
        if (error)
            res.end(error);
        var admindisplay = `select * from userdata where usertype = 'player'`;
        pool.query(admindisplay, (error, result) => {
            if (error)
                res.end(error);
            var results = { 'rows': result.rows };
            res.render('pages/admin', results);
        });
    });
});
// for room
app.post('/admin/rooms/:name', async (req, res) => {
    var client = await pool.connect();
    var deletequery = await client.query(`delete from room where name = '${req.params.name}';`);
    var superdisplay = await client.query(`select * from userdata order by id`);
    var superroom = await client.query(`SELECT * FROM room ORDER BY id ASC;`);
    var results = { 'rows': superdisplay.rows, 'rooms': superroom.rows };
    setTimeout(function () {
        res.render('pages/superuser', results);
    }, 100)
});
app.post('/admin/rooms1', async (req, res) => {
    var client = await pool.connect();
    var insertQuery = await client.query(`INSERT INTO room(name, person, player1, player2, gaming) VALUES ('${req.body.roomName}', 0, '', '', 'not')`);
    var superdisplay = await client.query(`select * from userdata order by id`);
    var superroom = await client.query(`SELECT * FROM room ORDER BY id ASC;`);
    var results = { 'rows': superdisplay.rows, 'rooms': superroom.rows };
    res.render('pages/superuser', results);
});
///////////////////////////// Superuser //////////////////////////////////////////////////
//superuser
app.post('/superuser/updateuser', async function (req, res) {
    var client = await pool.connect();
    var updatequery = await client.query(`update userdata set email ='${req.body.email}', username = '${req.body.username}', password = '${req.body.password}', score = '${req.body.score}', usertype = '${req.body.usertype}' where id = ${req.body.id}`);
    var superdisplay = await client.query(`select * from userdata order by id`);
    var superroom = await client.query(`SELECT * FROM room ORDER BY id ASC;`);
    var results = { 'rows': superdisplay.rows, 'rooms': superroom.rows };
    setTimeout(function () {
        res.render('pages/superuser', results);
    }, 100)
});

app.post('/superuser/user/:id', async (req, res) => {
    var client = await pool.connect();
    var mode = req.body.mod;
    var dele = req.body.del;
    if (mode == 'Modify') {
        var modifyuqery = await client.query(`select * from userdata where id = ${req.params.id}`);
        var results = { 'rows': result.rows };
        res.render('pages/modify', results);
    } else if (dele == "Delete") {
        var deletequery = await client.query(`delete from userdata where userdata.id=${req.params.id}`);
        var superdisplay = await client.query(`select * from userdata order by id`);
        var superroom = await client.query(`SELECT * FROM room ORDER BY id ASC;`);
        var results = { 'rows': superdisplay.rows, 'rooms': superroom.rows };
        setTimeout(function () {
            res.render('pages/superuser', results);
        }, 100)
    }
});

// for room
app.post('/superuser/rooms/:name', async (req, res) => {
    var client = await pool.connect();
    var deletequery = await client.query(`delete from room where name = '${req.params.name}';`);
    var superdisplay = await client.query(`select * from userdata order by id`);
    var superroom = await client.query(`SELECT * FROM room ORDER BY id ASC;`);
    var results = { 'rows': superdisplay.rows, 'rooms': superroom.rows };
    setTimeout(function () {
        res.render('pages/superuser', results);
    }, 100)
});
app.post('/superuser/rooms1', async (req, res) => {
    var client = await pool.connect();
    var insertQuery = await client.query(`INSERT INTO room(name, person, player1, player2, gaming) VALUES ('${req.body.roomName}', 0, '', '', 'not')`);
    var superdisplay = await client.query(`select * from userdata order by id`);
    var superroom = await client.query(`SELECT * FROM room ORDER BY id ASC;`);
    var results = { 'rows': superdisplay.rows, 'rooms': superroom.rows };
    res.render('pages/superuser', results);
});

////////////// Insert Score ///////////////////////
app.post('/login/interface/insert', (req, res) => {
    console.log(req.body.score);
    console.log(req.body.username);
    var insertQuery = `UPDATE userdata SET score = ${req.body.score} WHERE username = '${req.body.username}';`;
    pool.query(insertQuery, (error, result) => {
        if (error)
            res.end(error);
        if (result.rowCount != 0) {
            var display_score = `select RANK() OVER(order by score desc) rank, username, score from userdata where usertype = 'player'`;
            pool.query(display_score, (error, result) => {
                if (error)
                    res.end(error);
                var results = { 'rows': result.rows, 'userName': req.body.username };
                res.render('pages/singleplayer', results);
            });
        }
    });
});
app.post('/login/interface/end', (req,res)=>{
    console.log(req.body.score);
    console.log(req.body.username);
    var insertQuery = `UPDATE userdata SET score = ${req.body.score} WHERE username = '${req.body.username}';`;
    pool.query(insertQuery, (error, result) => {
        if (error)
            res.end(error);
        if (result.rowCount != 0) {
            var results = { 'userName': req.body.username };
            res.render('pages/homepages', results);
        }
    });
});

///////////// Real time part; multiple player -- Allen ////////////////////////////////
const io = require('socket.io')(server)
io.on('connection',function(socket){
  socket.on('user',function(na,ra){
    var x = na;
    io.emit('user',x,ra);
  })
  socket.on('ops',function(ras,nms){
    socket.on('room',function(ras,nm){
      var show = `SELECT * FROM room WHERE name ='${ras}'`;
      pool.query(show, (error, result) => {
        if (error)
        res.end(error);
        var p = result.rows[0].person;
        var p1 = result.rows[0].player1;
        var p2 = result.rows[0].player2;

        if(p != 2){
          var update = `UPDATE room SET person = person+1 WHERE name = '${ras}'`;
          pool.query(update, (error, result) => {
            if (error)
            res.end(error);
            if(p1 == ''){
              var player = `UPDATE room SET player1 = '${nm}' WHERE name = '${ras}'`;
              pool.query(player,(error,result) => {
                if(error)
                res.end(error)
              })
            }
            else if(p2 == ''){
              var player = `UPDATE room SET player2 = '${nm}' WHERE name = '${ras}'`;
              pool.query(player,(error,result) => {
                if(error)
                res.end(error)
              })
            }
            var show = `SELECT * FROM room WHERE name ='${ras}'`;
            pool.query(show, (error, result) => {
              if (error)
              res.end(error);
              var results = result.rows[0].person;
              if(results == 2){
                var show = `SELECT * FROM room WHERE name ='${ras}'`;
                pool.query(show, (error, result) => {
                  if (error)
                  res.end(error);
                  var a = result.rows[0].player1;
                  var b = result.rows[0].player2;
                  io.emit('lookme',ras,a,b);
                });
              }
              io.emit('warn',ras,results);
            });
          });
        }
      });
    });
    socket.on('disconnect',function(){
      var check = `SELECT * FROM room WHERE name = '${ras}'`;
      pool.query(check,(error,result)=>{
        if(error)
        res.end(error);
        var p1 = result.rows[0].player1;
        var p2 = result.rows[0].player2;
        var p3 = result.rows[0].gaming;
        if(p3 == 'not'){
        if(p1 == nms){
          var deletes = `UPDATE room SET player1 = '' WHERE name = '${ras}'`;
          pool.query(deletes, (error,result) =>{
            if(error)
            res.end(error);
          })
        }
        if(p2 == nms){
          var deletes = `UPDATE room SET player2 = '' WHERE name = '${ras}'`;
          pool.query(deletes, (error,result) =>{
            if(error)
            res.end(error);
          })
        }
        var updateQuery = `UPDATE room SET person = person-1 WHERE name = '${ras}';`;
        pool.query(updateQuery, (error, result)=>{
          if(error)
          res.end(error);
          var show = `SELECT * FROM room WHERE name ='${ras}'`;
          pool.query(show, (error, result) => {
            if (error)
            res.end(error);
            var o = result.rows[0].person;
            io.emit('warn',ras,o);
            io.emit('reset',ras);
          });
        });
      }
      })

    })
    socket.on('player is ready',function(ras,nm){
      io.emit('tell',ras,nm);
      socket.on('start',function(ras,nm){
        var updateQuery = `UPDATE room SET gaming = 'in' WHERE name = '${ras}';`;
        pool.query(updateQuery,(error,result)=>{
          if(error)
            res.end(error);
        })
        io.emit('go',ras);
      })
    })
  })
  socket.on('math',function(room,name){
    socket.on('disconnect',function(){
      var cc = `SELECT * FROM room WHERE name = '${room}';`;
      pool.query(cc,(error,result)=>{
        if(error)
        res.end(error)
        if(result.rows[0].person == 2){
          var q1 = `UPDATE room SET person = person-2 WHERE name = '${room}';`;
          pool.query(q1, (error, result)=>{
            if(error)
            res.end(error);
          });
        }
      })
      var updateQuery = `UPDATE room SET gaming = 'not' WHERE name = '${room}';`;
      pool.query(updateQuery,(error,result)=>{
        if(error)
          res.end(error);
      })
      var q2 = `UPDATE room SET player1 = '',player2 = '' WHERE name = '${room}';`;
      pool.query(q2, (error, result)=>{
        if(error)
        res.end(error);
        var cc = `SELECT * FROM room WHERE name = '${room}';`;
        pool.query(cc,(error,result)=>{
          if(error)
          res.end(error)
            io.emit('warn',room,result.rows[0].person);
        });
        io.emit('jump',name);
        io.emit('send',room);
      });
    })
  })
  socket.on('score',function(rmif,own,score){
    io.emit('this',rmif,own,score);
  })
  socket.on('winner',function(rmif,own,score){
    io.emit('that',rmif,own,score);
  })

});
///////////// Real time part; multiple player -- Kevin ////////////////////////////////
app.post('/login/interface/multiplayer', (req, res) => {
    var getQuery = `SELECT * FROM room ORDER BY id ASC;`;
    pool.query(getQuery, (error, result) => {
      if (error)
      res.end(error);
      var results = { 'rows': result.rows, 'userName': req.body.userName};
      // console.log(results);
      res.render('pages/multiplayer', results);
    });
});
// app.get('/login/interface/multiplayer', (req, res) => {
//     var getQuery = `SELECT * FROM room ORDER BY id ASC;`;
//     pool.query(getQuery, (error, result) => {
//       if (error)
//       res.end(error);
//       var results = { 'rows': result.rows, 'userName': req.body.userName};
//       // console.log(results);
//       res.render('pages/multiplayer', results);
//     });
// });
app.post('/login/interface/multiplayer/room', (req, res) => {
    console.log(req.body.user);
    res.render('pages/room', { 'room': req.body.room, 'username': req.body.user });
});
app.post('/login/interface/multiplayer/room/start',(req,res)=>{
    var getOP = `SELECT * FROM room WHERE name = '${req.body.rooom}'`;
    pool.query(getOP, (error,result)=>{
      if(error)
        res.end(error)
      var p1 = result.rows[0].player1;
      var p2 = result.rows[0].player2;
      var opp;
      if(p1 == req.body.userr)
        opp = p2;
      else {
        opp = p1;
      }
      var results = {'rooom':req.body.rooom,'opp':opp,'p':req.body.userr};
      res.render('pages/battle',results);
    })
});
app.post('/login/interface/homepages', (req,res)=>{
    var results = { 'userName': req.body.userName };
    res.render('pages/homepages', results);
});




//'postgres://postgres:123456@localhost/apple'
//CREATE TABLE userdata(id serial, email varchar(40), username varchar(10), password varchar(20), score int, usertype varchar(10));
//INSERT INTO userdata(email, username, password, score, usertype) VALUES('wengehuastudy2016@gmail.com', 'kevin', 'admin001', 0, 'superuser');
//INSERT INTO userdata(email, username, password, score, usertype) VALUES('caoyuhao8@gmail.com', 'allen', '123321', 0, 'admin');
//INSERT INTO userdata(email, username, password, score, usertype) VALUES('jiangmuzi1996@gmail.com', 'muzi', '123456', 0, 'admin');
//INSERT INTO userdata(email, username, password, score, usertype) VALUES('andylin5330@gmail.com', 'andy', '123456', 0, 'admin');
//INSERT INTO userdata(email, username, password, score, usertype) VALUES('jiangjack3@gmail.com', 'jack', '123456', 0, 'admin');

// CREATE TABLE room(id serial, name varchar(50), person int, player1 varchar(50), player2 varchar(50), CHECK (person >= 0), CHECK (person <3));
// INSERT INTO room(name, person, player1, player2) VALUES ('test1', 0, '', '');
// INSERT INTO room(name, person, player1, player2) VALUES ('test2', 0, '', '');
// INSERT INTO room(name, person, player1, player2) VALUES ('test3', 0, '', '');
// INSERT INTO room(name, person, player1, player2) VALUES ('test4', 0, '', '');
// INSERT INTO room(name, person, player1, player2) VALUES ('test5', 0, '', '');