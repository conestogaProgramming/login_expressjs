function askLogout(){
    var logoutResult = confirm("Would you like to logout?","");
    if(logoutResult == true){
        location.href = "http://localhost:3000/logout";
    }
}
