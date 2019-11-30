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
    temp.action = "/login/interface/multiplayer-cache";
    temp.submit();
}