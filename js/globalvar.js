var changeUrl = "/mocha_itom";
var global_path = "http://" + "192.168.1.142" + ":8083";
// var new_global_path = "https://" + returnCitySN["cip"] + ":8083";
// var hostname_path = "https://" + window.location.hostname + changeUrl;
// var new_hostname_path = "https://" + window.location.hostname;
// var pathnameStr = window.location.pathname,
//     pathnameArr = pathnameStr.split("/", 4);
// pathnameStr = pathnameArr.join("/");
// var dir_path = (new_hostname_path + pathnameStr).replace(/\/\w+\.html$/, "");
// dir_path = dir_path.replace(/\/$/, "");
// var ROOT_PATH = "https://" + window.location.hostname + changeUrl;

function commonAjax(a, e, j, g) {
    var f = l[0];
    var c = {
        url: a,
        data: e,
        type: "post",
        dataType: "json",
        success: j,
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

