function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    // if(profile.getId() && profile.getEmail()){
    //   document.getElementsByClassName("login")[1].style.display = "none";
    //   //document.getElementsByClassName("login1")[0].style.display = "inline";
    // }
    var temp = document.createElement("form");
    document.body.appendChild(temp);
    var user = document.createElement("input");
    temp.appendChild(user);
    user.style.display = "none";
    var eml = document.createElement("input");
    temp.appendChild(eml);
    eml.style.display = "none";
    user.setAttribute("name", "user");
    user.setAttribute("value", profile.getName());
    eml.setAttribute("name", "email");
    eml.setAttribute("value", profile.getEmail());
    signOut();
    temp.method = "POST";
    temp.action = "/login/GoogleInterface";
    temp.submit();
  }

  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out.');
    });
  }