var socket = io.connect('https://bobbysohandsome.herokuapp.com/');
var ras = document.getElementById('room').innerHTML;
var nm = document.getElementById('showInfo').innerHTML;
socket.emit('ops',ras,nm);
socket.emit('room',ras,nm);
socket.on('lookme',function(room,a,b){
  if(room == ras){
    // var parent = document.getElementById('display');
    // var node = document.createElement('p');
    if(a != '' && b != '')
      document.getElementById('play').style.display = "";
    var node = document.getElementById('match');
    if(a == nm)
      node.innerHTML = "Your Opponent: " + b;
    else {
      node.innerHTML = "Your Opponent: " + a;
    }
  }
})
socket.on('reset',function(room){
    if(room == ras){
     document.getElementById('match').innerHTML = 'Waiting for Your Opponent';
     document.getElementById('play').style.display = "none";
   }
  })
socket.on('go',function(room){
    if(room == ras){
      var temp = document.createElement("form");
      document.body.appendChild(temp);
      var room1 = document.createElement("input");
      temp.appendChild(room1);
      var user1 = document.createElement("input");
      temp.appendChild(user1);

      room1.setAttribute("name", "rooom");
      room1.setAttribute("value", ras);
      user1.setAttribute("name", "userr");
      user1.setAttribute("value", nm);
      room1.style.display = "none";
      user1.style.display = "none";
      temp.method = "POST";
      temp.action = "/login/interface/multiplayer/room/start";
      temp.submit();
    }
})
function ready(){
    document.getElementById('pbutton').style.display = "none";
    socket.emit('player is ready',ras,nm);
    var flag1 = document.getElementById('p1').innerHTML;
    var flag2 = document.getElementById('p2').innerHTML;
    if(flag1 != "Player1 is not ready"&& flag2 == "Player2 is not ready"){
      socket.emit('start',ras,nm);
    }
  }
  socket.on('tell',function(room,name){
    if(ras == room){
      var one = document.getElementById('p1');
      var two = document.getElementById('p2');
      if(one.innerHTML == 'Player1 is not ready'){
        one.innerHTML = "Player " + name + " is ready";
      }
      else{
        two.innerHTML = "Player " + name + " is ready";
      }
    }
  })
  function back(){
    var room = document.getElementById("room").innerHTML;
    console.log(room);
    var user = document.getElementById("showInfo").innerHTML;
    console.log(user);
    var temp = document.createElement("form");
    document.body.appendChild(temp);
    var room1 = document.createElement("input");
    temp.appendChild(room1);
    var user1 = document.createElement("input");
    temp.appendChild(user1);

    room1.setAttribute("name", "room");
    room1.setAttribute("value", room);
    user1.setAttribute("name", "userName");
    user1.setAttribute("value", user);
    room1.style.display = "none";
    user1.style.display = "none";
    temp.method = "POST";
    temp.action = "/login/interface/multiplayer";
    temp.submit();
    var sig = document.getElementById('room').innerHTML;
  }
  var na = document.getElementById('showInfo').innerHTML;
  var ra = document.getElementById('room').innerHTML;
  socket.emit('user',na,ra);
  socket.on('user',function(x,r1){
    if(r1 == ra)
    document.getElementById('display').innerHTML = "user " + x + " enter the room";
  })