
var global_path = "http://" + "192.168.1.142" + ":8083";

// var global_path = "https://" + window.location.hostname + ":8083";

function commonAjax(a, e, j, g) {
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

