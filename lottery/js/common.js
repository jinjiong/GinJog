var GJ=GJ || {}
GJ.URL='http://120.24.97.63:9090/betting/app/manage';
GJ.loginState = false; //登陆状态
GJ.user ={
    account :'',
    companyGrade:'',
    companyId:'',
    id:'',
    nickName:'',
    phone:'',
    token:'',
    userType:''
}
GJ.checkLogin =  function(){
    var url = window.location.href;
    if (Cookies.get("user")) {
        GJ.loginState=true;
        if (url.substring(url.lastIndexOf('/')+1, url.length) =='login.html') {
            $('input[name="account"]').val(Cookies.get('log_account'));
        }
    }else{
        if (url.substring(url.lastIndexOf('/')+1, url.length) !='login.html') {
            location.replace('login.html');
        }else{
            $('input[name="account"]').val(Cookies.get('log_account'));
        }
    }
}
// 登陆后存储用户信息
GJ.user_info_storage = function(user){
    var S_user =JSON.stringify(user);
    Cookies.set("user", S_user);
    // 记住用户名
     Cookies.set('log_account',user.account);
};
// 检查是否登录
GJ.checkLogin();

// 登陆后页面的渲染
if (GJ.loginState) {
    var str =Cookies.get("user");
    $('#user-name').text(JSON.parse(str).account);
    $('.quit-btn').on('click',function(){
        Cookies.remove("user");
        location.replace('login.html');
    })
}
