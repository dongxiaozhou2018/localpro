
var global_path = "http://" + "192.168.1.142" + ":8083";

// var global_path = "https://" + window.location.hostname + ":8083";
var HTlogin = sessionStorage.getItem('HTlogin');
if(HTlogin){
    var at = JSON.parse(HTlogin).data.token;
}
function commonAjax(a, e, j, g) {
    var c = {
        url: a,
        contentType: 'application/json',
        data: JSON.stringify(e),

        // data: e,
        crossDomain: true,
        type: "post",
        dataType: "json",
        success: j,
        crossDomain: true,  
        xhrFields: {
            withCredentials: false
        },
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("at",at);
        },
        crossDomain: true,
        mimeType:"multipart/form-data",
        error: function (n, m) {
            var o = this;
            if (g) {
                g.apply(o, arguments)
            }
        },
        complete: function (m) {
            var n = m.responseText;
            if (isJSON(n)) {
                n = JSON.parse(n)
            }
        }
    };
    return $.ajax(c);
}
function getAjax(a, j, g) {
    var c = {
        url: a,

        // data: e,
        crossDomain: true,
        type: "get",
        dataType: "json",
        success: j,
        crossDomain: true,  
        xhrFields: {
            withCredentials: false
        },
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("at",at);
        },
        crossDomain: true,
        mimeType:"multipart/form-data",
        error: function (n, m) {
            var o = this;
            if (g) {
                g.apply(o, arguments)
            }
        },
        complete: function (m) {
            var n = m.responseText;
            if (isJSON(n)) {
                n = JSON.parse(n)
            }
        }
    };
    return $.ajax(c);
}
function isJSON(b) {
    if (typeof b == "string") {
        try {
            JSON.parse(b);
            return true
        } catch (a) {
            return false
        }
    }
}
function getQueryString(b) {
    var a = decodeURIComponent(window.location.search);
    var c = new RegExp("(^|&)" + b + "=([^&]*)(&|$)", "i");
    var d = a.substr(1).match(c);
    if (d != null) {
        return unescape(d[2])
    }
    return null
}
// 用户名渲染
function loginName(){
    var HTlogin = sessionStorage.getItem('HTlogin');
    if(HTlogin){
        HTlogin = JSON.parse(HTlogin);
        $('.loginName').html(HTlogin.data.username);
    }else{
        window.location.href = '../login.html';
    }
}
// 登录超时
function unauthorized(code){
    if(code == 401){
        sessionStorage.removeItem('HTlogin');
        alert('登录超时，请重新登陆');
        window.location.href = '../login.html';;
    }
}

