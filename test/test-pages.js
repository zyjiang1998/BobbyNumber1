var assert = require('chai');
var request = require('supertest');
var app = require('../index')
var expect = require('chai').expect;
let chai = require('chai');
let chaiHttp = require('chai-http');

var pg = require('pg');

chai.use(chaiHttp);
var conString = process.env.DATABASE_URL;
var client = new pg.Client(conString);
client.connect();
// describe('get /login', function(){
//   it('should login if right username and password',
//   function(done){
//     request(app)
//     .post('pages/login/interface');
//     .send('username = testing');
//     .send('password = testing001');
//     .expect(function(res){
//       res.body.id = '999';
//     });
//     .expect(200, {
//       id : '999',
//       username: 'testing'
//     }, done);
//   });
// })
// describe('Events', () => {
//   beforeEach((done) => { // Create some data to the database
//     try {
//       console.log('DEBUG: "beforeEach" hook started');
//       pg.connect(process.env.DATABASE_URL, function(err, client) {
//         console.log('DEBUG: "beforeEach" hook connected');
//         if (err) {
//           console.log(err);
//           done(err);
//         } else {
//           client.query('DELETE FROM events', function(err, result) {
//             console.log('DEBUG: "beforeEach" hook queried 1');
//             if (err) {
//               console.log(err);
//               done(err);
//             } else {
//               client.query(' \
//               INSERT INTO events (title) VALUES \
//               (\'Fantastic title!\'), \
//               (\'Another fantastic title!\')', function(err, result) {
//                 console.log('DEBUG: "beforeEach" hook queried 2');
//                 if (err) {
//                   console.log(err);
//                   done(err);
//                 } else {
//                   done();
//                 }
//               });
//             }
//           });
//         }
//       });
it('Main page status', function(done){
  request(app).get('/')
  .expect(200, done)
})
describe('homepage', function(){
  it("welcomes the user", function(done){
    request(app).get('/')
      .expect(200)
      .expect(/Magic Matrix/)
      .expect(/Play/, done)
  })
})
describe('homepage', function(){
  it("Go back to home success", function(done){
    request(app).post('/home')
      .expect(302)
      .expect('Location', /\/magicMatrix/, function(){
        request(app).get('/magicMatrix')
          .expect(200)
          .expect(/Magic Matrix/)
          .expect(/Play/, done)
      })
  })
})

describe('tutorial page', function(){
  it("Go to tutorial page", function(done){
    request(app).post('/tutorial')
      .expect(302)
      .expect('Location', /\/tutorial/, function(){
        request(app).post('/tutorial')
          .expect(200)
          .expect(/Getting Start!!/)
          .expect(/Click Button to Play game/, done)
      })
  })
})
describe('google login page', function(){
  it('Go to goole login page success', function(done){
    request(app).post('/login/GoogleInterface')
      .send({user:'jack'})
      .send({email:'jiangjack3@gmail.com'})
      .expect(200)
      .expect('Location', /\/play/, done);
  })
})

describe('update', function(){
  it("updata a player", function(done){
    request(app).post('/update')
    .send({userName:'test1'})
    .send({passWord:'test001'})
    .send({email:'test@test.ca'})
    .send({repeatpassword:'test001'})
      .expect(200)
      .expect('Location',/\/login/, done())
  })
})

describe('reset password', function(){
  it("go to reset page", function(done){
    request(app).post('/login/reset')
      .expect(200)
      .expect('Location',/\/reset/, done())
  })
})
describe('check authentication code', function(){
  it("check the anuthentication code for resetting password", function(done){
    request(app).post('/login/reset/check')
    .send({email:'jiangjack3@gmail.com'})
    .send({data:'1234'})
    .send({code:'1234'})
    .expect(/Reset Your Password/)
    .expect(/Check your email for a code to reset your password. If it doesn’t appear within a minutes, check your spam folder./)
      .expect(200)
      .expect('Location',/\/check_email/, done())

  })
})
describe('update/user', function(){
  it("updata a player's email", function(done){
    request(app).post('/update')
      .expect(200)
      .expect('Location',/\/superuser/, done())
  })
})

describe('sign in', function(){
  it("signs in to the superuser page", function(done){
    request(app).post('/login/interface')
    .send({userName:'kevin'})
    .send({passWord:'admin001'})
      .expect(302)
      .expect('Location',/\/superuser/, done())
  })
})
describe('sign in', function(){
  it("signs in to the admin page", function(done){
    request(app).post('/login/interface')
    .send({userName:'jack'})
    .send({passWord:'123456'})
      .expect(302)
      .expect('Location',/\/superuser/, done())
  })
})
describe('sign in', function(){
  it("signs in to the player page", function(done){
    request(app).post('/login/interface')
    .send({userName:'123'})
    .send({passWord:'123456'})
      .expect(302)
      .expect('Location',/\/play/, done())
  })
})