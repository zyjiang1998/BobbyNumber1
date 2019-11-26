


window.onload = function(){
    var c = document.getElementById("myCanvas");
    // var ctx = c.getContext("2d");
    // ctx.fillStyle = "#FF0000";

}


// Login Modal
var modal1=document.getElementById('loginModal');
var modalBtn1=document.getElementById('loginClick');
var closeBtn1=document.getElementById('closeBtn1');

var modal2=document.getElementById('signupModal');
var modalBtn2=document.getElementById('signupHere');
var closeBtn2=document.getElementById('closeBtn2');
// var signupBtn=document.getElementById('signup');



modalBtn1.addEventListener('click',openModal1);
closeBtn1.addEventListener('click',closeModal1);
window.addEventListener('click',outsideClick);

modalBtn2.addEventListener('click',openModal2);
closeBtn2.addEventListener('click',closeModal2);
// signupBtn.addEventListener('click',signup);


function openModal1(){
    modal1.style.display = 'block';

}

function closeModal1(){
    modal1.style.display = 'none';
}

function openModal2(){
    modal1.style.display = 'none';
    modal2.style.display = 'block';
}

function closeModal2(){
    modal2.style.display = 'none';
}

// function signup(){
//     location.href="./pages/submit.ejs";
// }

function outsideClick(e){
    if(e.target==modal1 || e.target==modal2){
    modal1.style.display = 'none';
    modal2.style.display = 'none';
    }
}

//repeat password
/*var password = document.getElementById("password")
, repeatpassword = document.getElementById("repeatpassword");
function validatePassword(){
  if((repeatpassword.value.length>=password.value.length)&&(password.value != repeatpassword.value)) {
    // repeatpassword.setCustomValidity("Passwords Don't Match");
    window.alert("Don't match");
  }// } else {
  //   repeatpassword.setCustomValidity('');
  // }
}

// password.onchange = validatePassword;
repeatpassword.onkeyup = validatePassword;
*/

document.getElementById('signup').addEventListener('click',forribid1);


function forribid1(){
  var a = document.getElementById('password').value;
  var b = document.getElementById('repeatpassword').value;

  if(a != b)
  {
    document.getElementById('repeatpassword').style.borderColor = 'red';
    event.preventDefault();
  }
  else{
    document.getElementById('repeatpassword').style.borderColor = '';
  }

  var obj = document.getElementById("em").value;
  var reg=/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/i;//邮箱验证
    if(reg.test(obj)){
        document.getElementById("em").style.borderColor = "green";
    }else{
      document.getElementById("em").style.borderColor = "red";
        event.preventDefault();
    }
}

// function validateForm(){
//   var c = document.forms["myFrom"]["username"].value;
//   var names = [];
//   let flag = 0;
//   rows.forEach(function(t){
//     names.push(t.username);
//   });
//   for(var i = 0; i<names.length;i++){
//     if(c == names[i]){
//       flag = 1;
//       break;
//     }
//   }
//   if(flag == 0){
//     window.alert("exec!");
//   }
// }
