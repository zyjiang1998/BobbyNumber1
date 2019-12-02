var logAlert=document.getElementById('loggedinAlert');

window.addEventListener('click',outsideClick);

function outsideClick(e){
    if(e.target!=logAlert){
    loggedinAlert.style.display ='none';
    }
}
function func1(){
    var userName = document.getElementsByClassName("showInfo")[1].innerHTML;
    
    var temp = document.createElement("form");
    document.body.appendChild(temp);
    var user = document.createElement("input");
    temp.appendChild(user);
    user.style.display = "none";
    user.setAttribute("name", "userName");
    user.setAttribute("value", userName);
    temp.method = "GET";
    temp.action = "/login/interface/multiplayer";
    temp.submit();
}
function func2(){
    var userName = document.getElementsByClassName("showInfo")[1].innerHTML;
    var temp = document.createElement("form");
    document.body.appendChild(temp);
    var user = document.createElement("input");
    temp.appendChild(user);
    user.style.display = "none";
    user.setAttribute("name", "userName");
    user.setAttribute("value", userName);
    temp.method = "POST";
    temp.action = "/login/interface/singleplayer";
    temp.submit();
}