/*var x = document.querySelectorAll("canvas");

x.forEach(x => x.addEventListener('click', flip)); 

function flip(){
  if(this.style.backgroundColor == "red"){
    this.style.backgroundColor = "#60423a";
  }
  else
    this.style.backgroundColor = "red";
}
var x = document.querySelectorAll(".front")*/

/*function flip(event){
	var element = event.currentTarget;
	if (element.className === "card") {
    element.style.transform = "rotateY(180deg)";
  }
};*/

/*document.getElementById('button').addEventListener('click',rotation)
function rotation(){
  var a = document.getElementsByClassName('box');
  window.alert("fffff");
  a[0].style.animation = "show 2s forwards";
}*/

/*function matrixBuilder(col,row){
	let matrix = document.getElementById("matrix");
	let m = []
	for (var i = 0; i < row.length; i++) {
		document.createElement("tr");
		for (var j = 0; j < col.length; j++) {
			let td = document.createElement("td");
			td.setAttribute("id",i*col + j)

		} 	
	}
}*/
let count = 0;
let flag = 1;
var first = 0;
function flip(event){
	var element = event.currentTarget;
	if (element.className === "card") {
		if(element.getAttribute('value') == '1'){
			element.classList.toggle("rotatecard");
			element.setAttribute('value','2');
			flag = 1;
			count--;
		}
		else{
			element.children[1].style.backgroundColor = "red";
			element.classList.toggle("rotatecard");
			window.alert("Oooops!!!You clicked the wrong box!!Please try again!");
			document.getElementById("box").classList.toggle("block");
			setTimeout(function(){element.classList.toggle("rotatecard");},1000);
			flag = 0;
			count = 0;
		}
		if(count == 0){
			setTimeout(function(){reset();},2000);
		}
	}
}

function show(){
	var a  = document.getElementsByClassName('card');
	for(var i = 0; i < a.length; i++){
		if(a[i].getAttribute('value') == '1'){
			a[i].classList.toggle("rotatecard");
		}
	}
}

function assign(){
	var a  = document.getElementsByClassName('card');
	var b  = document.getElementsByClassName('back');
	var arr =[];
	var check = 0;
	for(var i = 0;i <4;i++){
		var temp = Math.floor(Math.random() * 9);
		var flag = 1;
		for(var j = 0 ; j <i;j++){
			if(arr[j] == temp){
				var flag = 0;
				break;
			}
		}
		if(flag == 0){
			i--;
			continue;
		}
		arr.push(temp);
	}
	for(var k = 0; k < 4; k++){
		a[arr[k]].setAttribute('value','1');
		b[arr[k]].style.backgroundColor = "black";
	}
	count = arr.length;
}
function reset(){
	if(flag == 1){
		first++;
	}
	if(first != 2){
		var a  = document.getElementsByClassName('card');
		var b  = document.getElementsByClassName('back');
		document.getElementById("box").classList.toggle("block");
		for(var i = 0; i < a.length; i++){
			if(a[i].getAttribute('value') == '1'){
				a[i].setAttribute('value','-1');
				b[i].style.backgroundColor = "#cccccc";
			}
			if(a[i].getAttribute('value') == '2'){
				a[i].setAttribute('value','-1');
				b[i].style.backgroundColor = "#cccccc";
				a[i].classList.toggle("rotatecard");
			}
		}
		document.getElementById("box").classList.remove("rotate");
		setTimeout(function(){document.getElementById('follow').innerHTML = "Let us try again!";},2000);
		setTimeout(function(){test1();},3000);
	}
	else if (first == 2){
		ending();
	}
}


function test (){
	document.getElementById("button").style.display = "none";
	document.getElementsByClassName("word")[0].style.display = "block";
	setTimeout(function(){document.getElementById("box").classList.toggle("display");},1000);
	test1();
}

function test1(){
	document.getElementById("box").classList.add("block");
	assign();
	setTimeout(function(){show();},3000);
	document.getElementById('follow').innerHTML = "Firstly You have to remember all box with black color!";
	setTimeout(function(){show();},4500);
	setTimeout(function(){document.getElementById('follow').innerHTML = "Then wait for seconds until rotation done!";},5000);
	setTimeout(function(){document.getElementById("box").classList.add("rotate");},7000);
	setTimeout(function(){document.getElementById("box").classList.remove("block");},7000);
	setTimeout(function(){document.getElementById('follow').innerHTML = "Now, it's your turn to guess which box has black color in its back!";},8000);
}

function ending(){
	document.getElementById('follow').innerHTML = "Well Done!";
	setTimeout(function(){
		var temp = document.createElement("form");
		document.body.appendChild(temp);
		temp.method = "POST";
		temp.action = "/home";
		temp.submit();
	}, 500);
}