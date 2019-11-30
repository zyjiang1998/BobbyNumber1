function into(event) {
    var i = event.currentTarget;
    var roomName = i.getAttribute("id");
    console.log(roomName);
    var user = document.getElementById("showInfo").innerHTML;
    console.log(user);
    var person = i.getAttribute("value");
    console.log(person);
    if (person == 2) {
        document.getElementById("Person").style.color = 'red';
        event.preventDefault();
    }
    else {
        var temp = document.createElement("form");
        document.body.appendChild(temp);
        var room1 = document.createElement("input");
        temp.appendChild(room1);
        var user1 = document.createElement("input");
        temp.appendChild(user1);

        room1.setAttribute("name", "room");
        room1.setAttribute("value", roomName);
        user1.setAttribute("name", "user");
        user1.setAttribute("value", user);
        room1.style.display = "none";
        user1.style.display = "none";

        temp.method = "POST";
        temp.action = "/login/interface/multiplayer/room";
        temp.submit();
    }
}