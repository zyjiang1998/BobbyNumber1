function check(){
    var obj = document.getElementById("email_field").value;
    var reg=/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/i;//邮箱验证
    if(reg.test(obj)){
        document.getElementById("email_field").style.borderColor = "green";
    }else{
        document.getElementById("email_field").style.borderColor = "red";
        event.preventDefault();
    }
}