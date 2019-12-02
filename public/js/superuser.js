function user(){
    document.getElementById("user").style.display = 'block';
    document.getElementById("room").style.display = 'none';
    event.preventDefault();
}
function room(){
    document.getElementById("user").style.display = 'none';
    document.getElementById("room").style.display = 'block';
    event.preventDefault();
}