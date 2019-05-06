
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
        xhrFields: {
            withCredentials: false
        },
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("at",at);
        },
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
        contentType: 'application/json',
        // data: e,
        crossDomain: true,
        type: "get",
        dataType: "json",
        success: j,  
        xhrFields: {
            withCredentials: false
        },
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("at",at);
        },
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
        $('.layui-nav-img').attr('src',HTlogin.data.url);
    }else{
        window.location.href = '../../login.html';
    }
}
// 登录超时
function unauthorized(code){
    if(code == -1){
        sessionStorage.removeItem('HTlogin');
        alert('登录超时，请重新登陆');
        window.location.href = '../../login.html';
    }
}
// 树形菜单
function menutree(a){
    if(a.length>0){
        for(var i = 0;i < a.length;i++){
            a[i].name = a[i].text;
            a[i].spread = false;
            if(a[i].children && a[i].children.length>0){
                menutree(a[i].children);
            }
        }
    }
    return a;
}
// webSocket 链接
var webSocket = null;
function initSocket(message) {
    
    if (!window.WebSocket) {
        alert("您的浏览器不支持ws");
        return false;
    }

    webSocket = new WebSocket('ws://192.168.1.185:80');

    // 建立连接
    webSocket.onopen = function(event) {
        send(message);
        console.log("建立连接成功" + event);

    };

    // 收到服务端消息
    webSocket.onmessage = function(msg) {
        console.log("收到消息 : " + msg.data);
    };

    // 断线重连
    webSocket.onclose = function() {
        initSocket();
    };

    // 异常
    webSocket.onerror = function(event) {
        alert("链接异常");
    };
}

// 发送数据
function send(message) {
    if(message&&message!=null&&message!=undefined){
        webSocket.send(JSON.stringify(message));
    }
}

// 关闭webSocket
function closeWebSocket() {

    webSocket.close();

}
