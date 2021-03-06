document.getElementById('button').addEventListener('click', start);
var rrr = 0;
var level_test = 0;
var last_level = 0;
var passpoint = 0;
var count = 0;
var times = 0;
var tails = 0;
var score = 0;
var wrong = 0;
var color = [];
var wrong_flag = 0;
var before_score = 0;

function level_check() {
  if (level_test == 0)
    return 2;
  else if (level_test <= 1) {
    return 3;
  }
  else if (level_test <= 2) {
    return 4;
  }
  else if (level_test <= 4) {
    return 5;
  }
  else if (level_test <= 6) {
    return 6;
  }
  else if (level_test <= 8) {
    return 6;
  }
  else if (level_test <= 10) {
    return 7;
  }
  else if (level_test <= 12) {
    return 8;
  }
}

function diffculty_check() {
  if (level_test <= 6) {
    if (passpoint == 1) {
      last_level = level_test;
      level_test++;
      passpoint = 0;
    }
  }
  else {
    if (passpoint == 2) {
      last_level = level_test;
      level_test++;
      passpoint = 0;
    }
  }
}

function score_add() {
  if (level_test <= 3) {
    score += 100;
  }
  else if (level_test <= 6) {
    score += 300;
  }
  else if (level_test <= 8) {
    score += 600;
  }
  else if (level_test <= 10) {
    score += 900;
  }
  else if (level_test < 12) {
    score += 1000;
  }
  else {
    score += 2000;
  }
}

function flip(event) {
  var element = event.currentTarget;
  if (element.className === "card" && element.childNodes[1].style.backgroundColor != element.childNodes[0].style.backgroundColor) {
    let x = new Audio("/js/flip.mp3");
    element.classList.toggle("rotatecard");
    x.play();
    score += 25;
    document.getElementsByTagName("p")[2].innerHTML = "SCORE" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + score;
    count--;
    if (count == 0) {
      element.childNodes[1].classList.add("image");
      document.getElementById("tbody").classList.add("block");
      passpoint++;
      wrong = 0;
      before_score = score;
      score_add();
      diffculty_check();
      var lev = new Audio("/js/levelup.mp3");
      lev.play();
      setTimeout(function () { document.getElementById("tbody").classList.add("fadeout"); }, 1000);
      setTimeout(function () { count_check(); }, 2500);
    }
  }
  else if (element.childNodes[1].style.backgroundColor == element.childNodes[0].style.backgroundColor) {
    count = 0;
    document.getElementById("tbody").classList.add("block");
    element.childNodes[1].classList.add("corr");
    let y = new Audio("/js/wrong.mp3");
    element.classList.toggle("rotatecard");
    y.play();
    if (level_test != 0) {
      wrong++;
      wrong_flag = 1;
      if (wrong == 2) {
        level_test--;
        wrong = 0;
        wrong_flag = 0;
      }
    }
    setTimeout(function () { document.getElementById("tbody").classList.add("fadeout"); }, 1000);
    setTimeout(function () { count_check(); }, 2500);
  }
}

function count_check() {
  if (count == 0) {
    let bonus = score - before_score;
    document.getElementsByClassName("reset")[0].innerHTML = "Your score is " + "&nbsp;" + before_score;
    document.getElementsByClassName("reset")[1].innerHTML = "The bonus you earned is  " + "&nbsp;" + bonus;
    document.getElementById("button2").style.display = "inline";
  }
}

document.getElementById("button2").addEventListener('click', next);

function next() {
  document.getElementsByClassName("reset")[0].innerHTML = "&nbsp;";
  document.getElementsByClassName("reset")[1].innerHTML = "&nbsp;";
  document.getElementById("button2").style.display = "none";
  start();
}


function matrixBuilder() {
  let matrix = document.getElementById("matrix");
  let row = 0;
  let col = 0;
  if (level_test == 0) {
    row = 2;
    col = 2;
  }
  else {
    row = document.getElementsByClassName('trgame').length;
    console.log(row);
    col = (document.getElementsByClassName('container').length) / row;
    console.log(col)
  }
  if (level_test <= 12) {
    if (level_test != 0 && wrong_flag != 1) {
      if ((level_test - last_level) == 1) {
        if (row < col)
          row++;
        else
          col++;
      }
      else {
        if (row == col)
          row--;
        else
          col--;
      }
    }
    else {
      wrong_flag = 0;
    }
    console.log("The row is " + row + '\n' + "The col is " + col);
    console.log("The level is " + level_test);
    if (times != 0) {
      var parent = document.getElementById('matrix');
      var child = document.getElementsByTagName('tbody');
      parent.removeChild(child[1]);
    }
    document.getElementById("matrix");
    var tbody = document.createElement("tbody");
    tbody.setAttribute("id", 'tbody');
    document.getElementById("matrix").appendChild(tbody);
    for (var i = 0; i < row; i++) {
      var tr = document.createElement("tr");
      tr.setAttribute("class", "trgame");
      document.getElementById("tbody").appendChild(tr);
      for (var j = 0; j < col; j++) {
        let td = document.createElement("td");
        td.setAttribute("id", i * col + j)
        td.setAttribute("class", "container");
        tr.appendChild(td);
        let div = document.createElement("div");
        div.setAttribute("class", "card");
        div.setAttribute("onclick", "flip(event)");
        td.appendChild(div)
        var back = document.createElement("div");
        var front = document.createElement("div");
        back.setAttribute("class", "back");
        front.setAttribute("class", "front");
        div.appendChild(front);
        div.appendChild(back);
      }
    }
    setColor(row, col);
    times++;
  }
  else {
    window.alert("You are in the top level!");
  }
  document.getElementsByTagName("p")[0].innerHTML = "TILES" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + tails;
  document.getElementsByTagName("p")[1].innerHTML = "TRAIL" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + times + " / " + 21;
  document.getElementsByTagName("p")[2].innerHTML = "SCORE" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + score;
}

function setColor(row, col) {
  let level = level_check();
  let number = row * col;
  let a = document.getElementsByClassName('back');
  let arr = [];
  for (var i = 0; i < level; i++) {
    let temp = Math.floor(Math.random() * number);
    var flag = 1;
    for (var j = 0; j < i; j++) {
      if (arr[j] == temp) {
        var flag = 0;
        break;
      }
    }
    if (flag == 0) {
      i--;
      continue;
    }
    arr.push(temp);
  }
  count = arr.length;
  tails = count;
  for (var k = 0; k < level; k++) {
    a[arr[k]].style.backgroundColor = "#0f90a2";
  }
  color = arr;
}

function show() {
  var a = document.getElementsByClassName('card');
  let x1 = new Audio("/js/flip.mp3");
  x1.play();
  for (var i = 0; i < count; i++) {
    a[color[i]].classList.toggle("rotatecard");
  }
}

function start() {
  if (times <= 20) {
    if (times == 0) {
      if (rrr == 0) {
        document.getElementById("button").style.display = "none";
      }
      document.getElementsByTagName("p")[0].style.display = "inline";
      document.getElementsByTagName("p")[1].style.display = "inline";
      document.getElementsByTagName("p")[2].style.display = "inline";
    }
    matrixBuilder();
    document.getElementById("box").classList.add("block");
    setTimeout(function () { show(); }, 1000);
    setTimeout(function () { show(); }, 2000);
    setTimeout(function () { document.getElementById("tbody").classList.toggle("rotate"); }, 3000);
    setTimeout(function () { document.getElementById("box").classList.remove("block"); }, 3200);
  }
  else {
    document.getElementsByTagName("p")[0].style.display = "none";
    document.getElementsByTagName("p")[1].style.display = "none";
    document.getElementsByTagName("p")[2].style.display = "none";
    document.getElementsByClassName("reset")[0].innerHTML = "Your final score is " + "&nbsp;" + score;
    document.getElementById("button1").style.display = "inline";
    document.getElementById("button3").style.display = "inline";
  }
}

document.getElementById("button1").addEventListener('click', restart);
document.getElementById("button3").addEventListener('click', recode);


var flag = 0;
function restart() {
  // rrr++;
  // level_test = 0;
  // last_level = 0;
  // passpoint = 0;
  // count = 0;
  // times = 0;
  // tails = 0;
  // score = 0;
  // wrong = 0;
  // before_score = 0;
  // wrong_flag = 0;
  // var parent = document.getElementById('matrix');
  // var child = document.getElementsByTagName('tbody');
  // parent.removeChild(child[1]);
  document.getElementsByClassName("reset")[0].innerHTML = "&nbsp;";


  var comp = document.getElementById("oldScore").innerHTML;
  console.log(comp);
  if (flag == 0 && comp > score) {
    window.alert("Your rank is greater than your current Score. Do you really want to record ?");
    event.preventDefault();
    flag = 1;
  }
  else {
    var temp = document.createElement("form");
    document.body.appendChild(temp);
    var insert = document.createElement("input");
    var local = document.createElement("input");
    temp.appendChild(insert);
    temp.appendChild(local);
    insert.setAttribute("name", "score");
    local.setAttribute("name", "username");
    insert.setAttribute("value", score);
    var nam = document.getElementById("user").innerHTML;
    console.log(nam);
    local.setAttribute("value", nam);
    insert.style.display = "none";
    local.style.display = "none";
    temp.method = "POST";
    temp.action = "/login/interface/insert";
    temp.submit();
    document.getElementById("button1").style.display = "none";
    document.getElementById("button3").style.display = "none";
    // start();
  }
}


function recode() {
  var comp = document.getElementById("oldScore").innerHTML;
  console.log(comp);
  if (flag == 0 && comp > score) {
    window.alert("Your rank is greater than your current Score. Do you really want to record ?");
    event.preventDefault();
    flag = 1;
  }
  else {
    var temp = document.createElement("form");
    document.body.appendChild(temp);
    var insert = document.createElement("input");
    var local = document.createElement("input");
    temp.appendChild(insert);
    temp.appendChild(local);
    insert.setAttribute("name", "score");
    local.setAttribute("name", "username");
    insert.setAttribute("value", score);
    var nam = document.getElementById("user").innerHTML;
    console.log(nam);
    local.setAttribute("value", nam);
    insert.style.display = "none";
    local.style.display = "none";
    temp.method = "POST";
    temp.action = "/login/interface/end";
    temp.submit();
  }
}