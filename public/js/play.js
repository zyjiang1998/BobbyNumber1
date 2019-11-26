
var logAlert=document.getElementById('loggedinAlert');

window.addEventListener('click',outsideClick);

function outsideClick(e){
    if(e.target!=logAlert){
    loggedinAlert.style.display ='none';
    }
}