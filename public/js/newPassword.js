function forribid1(){
    var a = document.getElementById('newPassword').value;
    var b = document.getElementById('rePassword').value;
    // var c = document.getElementById('User').value;
    // var d = document.getElementById('em').value;
    // var names = [];
    // let flag = 0;
    // rows.forEach(function(t){
    //   names.push(t.username);
    // });
    // for(var i = 0; i<names.length;i++){
    //   if(c == names[i]){
    //     flag = 1;
    //     break;
    //   }
    // }
    // if(flag == 0){
    //   window.alert("exec!");
    // }
  
    if(a != b)
    {
      document.getElementById('rePassword').style.borderColor = 'red';
      event.preventDefault();
    }
    else{
      document.getElementById('rePassword').style.borderColor = '';
    }
  }