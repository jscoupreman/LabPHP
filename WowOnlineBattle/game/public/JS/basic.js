if (typeof $WH == "undefined") {
    var $WH = {}
}
$WH.$E = function(a) {
    if (!a) {
        if (typeof event != "undefined") {
            a = event
        } else {
            return null
        }
    }
    if (a.which) {
        a._button = a.which
    } else {
        a._button = a.button;
        if ($WH.Browser.ie6789 && a._button) {
            if (a._button & 4) {
                a._button = 2
            } else {
                if (a._button & 2) {
                    a._button = 3
                }
            }
        } else {
            a._button = a.button + 1
        }
    }
    a._target = a.target ? a.target : a.srcElement;
    a._wheelDelta = a.wheelDelta ? a.wheelDelta : -a.detail;
    return a
};
$WH.$A = function(c) {
    var e = [];
    for (var d = 0, b = c.length; d < b; ++d) {
        e.push(c[d])
    }
    return e
};
if (!Function.prototype.bind) {
    Function.prototype.bind = function() {
        var c = this,
            a = $WH.$A(arguments),
            b = a.shift();
        return function() {
            return c.apply(b, a.concat($WH.$A(arguments)))
        }
    }
}
$WH.bindfunc = function() {
    args = $WH.$A(arguments);
    var b = args.shift();
    var a = args.shift();
    return function() {
        return b.apply(a, args.concat($WH.$A(arguments)))
    }
};
if (!String.prototype.ltrim) {
    String.prototype.ltrim = function() {
        return this.replace(/^\s*/, "")
    }
}
if (!String.prototype.rtrim) {
    String.prototype.rtrim = function() {
        return this.replace(/\s*$/, "")
    }
}
if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.ltrim().rtrim()
    }
}
if (!String.prototype.removeAllWhitespace) {
    String.prototype.removeAllWhitespace = function() {
        return this.replace("/s+/g", "")
    }
}
$WH.strcmp = function(d, c) {
    if (d == c) {
        return 0
    }
    if (d == null) {
        return -1
    }
    if (c == null) {
        return 1
    }
    var f = parseFloat(d);
    var e = parseFloat(c);
    if (!isNaN(f) && !isNaN(e) && f != e) {
        return f < e ? -1 : 1
    }
    if (typeof d == "string" && typeof c == "string") {
        return d.localeCompare(c)
    }
    return d < c ? -1 : 1
};
$WH.trim = function(a) {
    return a.replace(/(^\s*|\s*$)/g, "")
};
$WH.rtrim = function(c, d) {
    var b = c.length;
    while (--b > 0 && c.charAt(b) == d) {}
    c = c.substring(0, b + 1);
    if (c == d) {
        c = ""
    }
    return c
};
$WH.sprintf = function(b) {
    var a;
    for (a = 1, len = arguments.length; a < len; ++a) {
        b = b.replace("$" + a, arguments[a])
    }
    return b
};
$WH.sprintfa = function(b) {
    var a;
    for (a = 1, len = arguments.length; a < len; ++a) {
        b = b.replace(new RegExp("\\$" + a, "g"), arguments[a])
    }
    return b
};
$WH.sprintfo = function(c) {
    if (typeof c == "object" && c.length) {
        var a = c;
        c = a[0];
        var b;
        for (b = 1; b < a.length; ++b) {
            c = c.replace("$" + b, a[b])
        }
        return c
    }
};
$WH.str_replace = function(e, d, c) {
    while (e.indexOf(d) != -1) {
        e = e.replace(d, c)
    }
    return e
};
$WH.htmlentities = function(a) {
    return a.replace(/[\u00A0-\u9999<>\&]/gim, function(b) {
        return "&#" + b.charCodeAt(0) + ";"
    })
};
$WH.urlencode = function(a) {
    a = encodeURIComponent(a);
    a = $WH.str_replace(a, "+", "%2B");
    return a
};
$WH.urlencode2 = function(a) {
    a = encodeURIComponent(a);
    a = $WH.str_replace(a, "%20", "+");
    a = $WH.str_replace(a, "%3D", "=");
    return a
};
$WH.number_format = function(a) {
    x = ("" + parseFloat(a)).split(".");
    a = x[0];
    x = x.length > 1 ? "." + x[1] : "";
    if (a.length <= 3) {
        return a + x
    }
    return $WH.number_format(a.substr(0, a.length - 3)) + "," + a.substr(a.length - 3) + x
};
$WH.is_array = function(b) {
    return !!(b && b.constructor == Array)
};
$WH.in_array = function(c, g, h, e) {
    if (c == null) {
        return -1
    }
    if (h) {
        return $WH.in_arrayf(c, g, h, e)
    }
    for (var d = e || 0, b = c.length; d < b; ++d) {
        if (c[d] == g) {
            return d
        }
    }
    return -1
};
$WH.in_arrayf = function(c, g, h, e) {
    for (var d = e || 0, b = c.length; d < b; ++d) {
        if (h(c[d]) == g) {
            return d
        }
    }
    return -1
};
$WH.rs = function() {
    var e = $WH.rs.random;
    var b = "";
    for (var a = 0; a < 16; a++) {
        var d = Math.floor(Math.random() * e.length);
        if (a == 0 && d < 11) {
            d += 10
        }
        b += e.substring(d, d + 1)
    }
    return b
};
$WH.rs.random = "0123456789abcdefghiklmnopqrstuvwxyz";
$WH.isset = function(a) {
    return typeof window[a] != "undefined"
};
if (!$WH.isset("console")) {
    console = {
        log: function() {}
    }
}
$WH.array_walk = function(d, h, c) {
    var g;
    for (var e = 0, b = d.length; e < b; ++e) {
        g = h(d[e], c, d, e);
        if (g != null) {
            d[e] = g
        }
    }
};
$WH.array_apply = function(d, h, c) {
    var g;
    for (var e = 0, b = d.length; e < b; ++e) {
        h(d[e], c, d, e)
    }
};
$WH.array_filter = function(c, g) {
    var e = [];
    for (var d = 0, b = c.length; d < b; ++d) {
        if (g(c[d])) {
            e.push(c[d])
        }
    }
    return e
};
$WH.array_index = function(c, e, g, h) {
    if (!$WH.is_array(c)) {
        return false
    }
    if (!c.__R || h) {
        c.__R = {};
        if (!g) {
            g = function(a) {
                return a
            }
        }
        for (var d = 0, b = c.length; d < b; ++d) {
            c.__R[g(c[d])] = d
        }
    }
    return (e == null ? c.__R : !isNaN(c.__R[e]))
};
$WH.array_compare = function(d, c) {
    if (d.length != c.length) {
        return false
    }
    var g = {};
    for (var f = d.length; f >= 0; --f) {
        g[d[f]] = true
    }
    var e = true;
    for (var f = c.length; f >= 0; --f) {
        if (g[c[f]] === undefined) {
            e = false
        }
    }
    return e
};
$WH.array_unique = function(b) {
    var c = [];
    var e = {};
    for (var d = b.length - 1; d >= 0; --d) {
        e[b[d]] = 1
    }
    for (var d in e) {
        c.push(d)
    }
    return c
};
$WH.ge = function(a) {
    if (typeof a != "string") {
        return a
    }
    return document.getElementById(a)
};
$WH.gE = function(a, b) {
    return a.getElementsByTagName(b)
};
$WH.ce = function(d, b, e) {
    var a = document.createElement(d);
    if (b) {
        $WH.cOr(a, b)
    }
    if (e) {
        $WH.ae(a, e)
    }
    return a
};
$WH.de = function(a) {
    if (!a || !a.parentNode) {
        return
    }
    a.parentNode.removeChild(a)
};
$WH.ae = function(a, b) {
    if ($WH.is_array(b)) {
        $WH.array_apply(b, a.appendChild.bind(a));
        return b
    } else {
        return a.appendChild(b)
    }
};
$WH.aef = function(a, b) {
    return a.insertBefore(b, a.firstChild)
};
$WH.ee = function(a, b) {
    if (!b) {
        b = 0
    }
    while (a.childNodes[b]) {
        a.removeChild(a.childNodes[b])
    }
};
$WH.ct = function(a) {
    return document.createTextNode(a)
};
$WH.st = function(a, b) {
    if (a.firstChild && a.firstChild.nodeType == 3) {
        a.firstChild.nodeValue = b
    } else {
        $WH.aef(a, $WH.ct(b))
    }
};
$WH.nw = function(a) {
    a.style.whiteSpace = "nowrap"
};
$WH.rf = function() {
    return false
};
$WH.rf2 = function(a) {
    a = $WH.$E(a);
    if (a.ctrlKey || a.shiftKey || a.altKey || a.metaKey) {
        return
    }
    return false
};
$WH.tb = function() {
    this.blur()
};
$WH.aE = function(b, c, a) {
    if (b.addEventListener) {
        b.addEventListener(c, a, false)
    } else {
        if (b.attachEvent) {
            b.attachEvent("on" + c, a)
        }
    }
};
$WH.dE = function(b, c, a) {
    if (b.removeEventListener) {
        b.removeEventListener(c, a, false)
    } else {
        if (b.detachEvent) {
            b.detachEvent("on" + c, a)
        }
    }
};
$WH.sp = function(a) {
    if (!a) {
        a = event
    }
    if ($WH.Browser.ie6789) {
        a.cancelBubble = true
    } else {
        a.stopPropagation()
    }
};
$WH.sc = function(h, j, d, f, g) {
    var e = new Date();
    var c = h + "=" + escape(d) + "; ";
    e.setDate(e.getDate() + j);
    c += "expires=" + e.toUTCString() + "; ";
    if (f) {
        c += "path=" + f + "; "
    }
    if (g) {
        c += "domain=" + g + "; "
    }
    document.cookie = c;
    $WH.gc(h);
    $WH.gc.C[h] = d
};
$WH.dc = function(a) {
    $WH.sc(a, -1);
    $WH.gc.C[a] = null
};
$WH.gc = function(f) {
    if ($WH.gc.I == null) {
        var e = unescape(document.cookie).split("; ");
        $WH.gc.C = {};
        for (var c = 0, a = e.length; c < a; ++c) {
            var g = e[c].indexOf("="),
                b, d;
            if (g != -1) {
                b = e[c].substr(0, g);
                d = e[c].substr(g + 1)
            } else {
                b = e[c];
                d = ""
            }
            $WH.gc.C[b] = d
        }
        $WH.gc.I = 1
    }
    if (!f) {
        return $WH.gc.C
    } else {
        return $WH.gc.C[f]
    }
};
$WH.ns = function(a) {
    if ($WH.Browser.ie6789) {
        a.onfocus = $WH.tb;
        a.onmousedown = a.onselectstart = a.ondragstart = $WH.rf
    }
};
$WH.eO = function(b) {
    for (var a in b) {
        delete b[a]
    }
};
$WH.dO = function(a) {
    function b() {}
    b.prototype = a;
    return new b
};
$WH.cO = function(c, a) {
    for (var b in a) {
        if (a[b] !== null && typeof a[b] == "object" && a[b].length) {
            c[b] = a[b].slice(0)
        } else {
            c[b] = a[b]
        }
    }
    return c
};
$WH.cOr = function(e, b, a) {
    for (var c in b) {
        if (a && (c.substr(0, a.length) == a)) {
            continue
        }
        if (b[c] !== null && typeof b[c] == "object") {
            if (b[c].length) {
                e[c] = b[c].slice(0)
            } else {
                if (!e[c]) {
                    e[c] = {}
                }
                $WH.cOr(e[c], b[c], a)
            }
        } else {
            e[c] = b[c]
        }
    }
    return e
};
$WH.fround = function(b) {
    if (Math.fround) {
        return Math.fround(b)
    } else {
        if (typeof Float32Array != "undefined" && Float32Array) {
            var a = new Float32Array(1);
            a[0] = +b;
            return a[0]
        } else {
            return b
        }
    }
};
$WH.Browser = {
    ie: !!(window.attachEvent && !window.opera),
    opera: !!window.opera,
    safari: navigator.userAgent.indexOf("Safari") != -1,
    firefox: navigator.userAgent.indexOf("Firefox") != -1,
    chrome: navigator.userAgent.indexOf("Chrome") != -1
};
$WH.Browser.ie9 = $WH.Browser.ie && navigator.userAgent.indexOf("MSIE 9.0") != -1;
$WH.Browser.ie8 = $WH.Browser.ie && navigator.userAgent.indexOf("MSIE 8.0") != -1 && !$WH.Browser.ie9;
$WH.Browser.ie7 = $WH.Browser.ie && navigator.userAgent.indexOf("MSIE 7.0") != -1 && !$WH.Browser.ie8;
$WH.Browser.ie6 = $WH.Browser.ie && navigator.userAgent.indexOf("MSIE 6.0") != -1 && !$WH.Browser.ie7;
$WH.Browser.ie67 = $WH.Browser.ie6 || $WH.Browser.ie7;
$WH.Browser.ie678 = $WH.Browser.ie67 || $WH.Browser.ie8;
$WH.Browser.ie6789 = $WH.Browser.ie678 || $WH.Browser.ie9;
$WH.OS = {
    windows: navigator.appVersion.indexOf("Windows") != -1,
    mac: navigator.appVersion.indexOf("Macintosh") != -1,
    linux: navigator.appVersion.indexOf("Linux") != -1
};
$WH.localStorage = new function() {
    this.isSupported = function() {
        var a;
        try {
            a = "localStorage" in window && window.localStorage !== null
        } catch (b) {
            a = false
        }
        if (a) {
            try {
                localStorage.setItem("test", "123");
                a = localStorage.getItem("test") == "123";
                localStorage.removeItem("test")
            } catch (b) {
                a = false
            }
        }
        $WH.localStorage.isSupported = (function(c) {
            return c
        }).bind(null, a);
        return a
    };
    this.set = function(a, b) {
        if (!$WH.localStorage.isSupported()) {
            return
        }
        localStorage.setItem(a, b)
    };
    this.get = function(a) {
        if (!$WH.localStorage.isSupported()) {
            return
        }
        return localStorage.getItem(a)
    };
    this.remove = function(a) {
        if (!$WH.localStorage.isSupported()) {
            return
        }
        localStorage.removeItem(a)
    }
};
$WH.g_getWindowSize = function() {
    var a = 0,
        b = 0;
    if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        a = document.documentElement.clientWidth;
        b = document.documentElement.clientHeight
    } else {
        if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
            a = document.body.clientWidth;
            b = document.body.clientHeight
        } else {
            if (typeof window.innerWidth == "number") {
                a = window.innerWidth;
                b = window.innerHeight
            }
        }
    }
    return {
        w: a,
        h: b
    }
};
$WH.g_getScroll = function() {
    var a = 0,
        b = 0;
    if (typeof(window.pageYOffset) == "number") {
        a = window.pageXOffset;
        b = window.pageYOffset
    } else {
        if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
            a = document.body.scrollLeft;
            b = document.body.scrollTop
        } else {
            if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
                a = document.documentElement.scrollLeft;
                b = document.documentElement.scrollTop
            }
        }
    }
    return {
        x: a,
        y: b
    }
};
$WH.g_getCursorPos = function(c) {
    var a, d;
    if (window.innerHeight) {
        a = c.pageX;
        d = c.pageY
    } else {
        var b = $WH.g_getScroll();
        a = c.clientX + b.x;
        d = c.clientY + b.y
    }
    return {
        x: a,
        y: d
    }
};
$WH.ac = function(c, d) {
    var a = 0,
        g = 0,
        b;
    while (c) {
        a += c.offsetLeft;
        g += c.offsetTop;
        b = c.parentNode;
        while (b && b != c.offsetParent && b.offsetParent) {
            if (b.scrollLeft || b.scrollTop) {
                a -= (b.scrollLeft | 0);
                g -= (b.scrollTop | 0);
                break
            }
            b = b.parentNode
        }
        c = c.offsetParent
    }
    if ($WH.isset("Lightbox") && Lightbox.isVisible()) {
        d = true
    }
    if (d) {
        var f = $WH.g_getScroll();
        a += f.x;
        g += f.y
    }
    var e = [a, g];
    e.x = a;
    e.y = g;
    return e
};
$WH.g_scrollTo = function(c, b) {
    var m, l = $WH.g_getWindowSize(),
        o = $WH.g_getScroll(),
        j = l.w,
        e = l.h,
        g = o.x,
        d = o.y;
    c = $WH.ge(c);
    if (b == null) {
        b = []
    } else {
        if (typeof b == "number") {
            b = [b]
        }
    }
    m = b.length;
    if (m == 0) {
        b[0] = b[1] = b[2] = b[3] = 0
    } else {
        if (m == 1) {
            b[1] = b[2] = b[3] = b[0]
        } else {
            if (m == 2) {
                b[2] = b[0];
                b[3] = b[1]
            } else {
                if (m == 3) {
                    b[3] = b[1]
                }
            }
        }
    }
    m = $WH.ac(c);
    var a = m[0] - b[3],
        h = m[1] - b[0],
        k = m[0] + c.offsetWidth + b[1],
        f = m[1] + c.offsetHeight + b[2];
    if (k - a > j || a < g) {
        g = a
    } else {
        if (k - j > g) {
            g = k - j
        }
    }
    if (f - h > e || h < d) {
        d = h
    } else {
        if (f - e > d) {
            d = f - e
        }
    }
    scrollTo(g, d)
};
$WH.g_createReverseLookupJson = function(b) {
    var c = {};
    for (var a in b) {
        c[b[a]] = a
    }
    return c
};
$WH.g_getLocaleFromDomain = function(b) {
    var d = $WH.g_getLocaleFromDomain.L;
    if (b && (typeof b == "string")) {
        var c = b.split(".");
        for (var a = 0; a < c.length; a++) {
            if (c[a] in d) {
                return d[c[a]]
            }
        }
    }
    return 0
};
$WH.g_getLocaleFromDomain.L = {
    fr: 2,
    de: 3,
    cn: 4,
    es: 6,
    ru: 7,
    pt: 8,
    it: 9,
    www: 0
};
$WH.g_getDomainFromLocale = function(d) {
    var g;
    if ($WH.g_getDomainFromLocale.L) {
        g = $WH.g_getDomainFromLocale.L
    } else {
        g = $WH.g_getDomainFromLocale.L = $WH.g_createReverseLookupJson($WH.g_getLocaleFromDomain.L);
        if ((typeof g_dev != "undefined") && g_dev) {
            var f = "",
                b = "",
                e;
            e = document.location.hostname.split(".");
            e.splice(-2, 2);
            for (var a = 0; a < e.length; a++) {
                if (e[a] in $WH.g_getLocaleFromDomain.L) {
                    continue
                }
                if (/staging\d*/.test(e[a])) {
                    f = f + "." + e[a]
                } else {
                    b = b + e[a] + "."
                }
            }
            for (var c in $WH.g_getDomainFromLocale.L) {
                if (c == 0) {
                    $WH.g_getDomainFromLocale.L[c] = (b + f).replace(/\.+/g, ".").replace(/^\./, "").replace(/\.$/, "")
                } else {
                    $WH.g_getDomainFromLocale.L[c] = b + $WH.g_getDomainFromLocale.L[c] + f
                }
            }
        }
    }
    return (g[d] ? g[d] : "www")
};
$WH.g_getIdFromTypeName = function(a) {
    var b = $WH.g_getIdFromTypeName.L;
    return (b[a] ? b[a] : -1)
};
$WH.g_getIdFromTypeName.L = {
    npc: 1,
    object: 2,
    item: 3,
    itemset: 4,
    quest: 5,
    spell: 6,
    zone: 7,
    faction: 8,
    pet: 9,
    achievement: 10,
    title: 11,
    event: 12,
    statistic: 16,
    currency: 17,
    building: 20,
    follower: 21,
    garrisonability: 22,
    mission: 23,
    ship: 25,
    threat: 26,
    resource: 27,
    "transmog-set": 101,
    petability: 200,
    "hearthstone/card": 220,
    card: 220,
    mechanic: 221,
    hsachievement: 222,
    hsquest: 223,
    cardback: 225,
    adventure: 227,
    boss: 228,
    deck: 104
};
$WH.g_ajaxIshRequest = function(b, e) {
    var c = document.getElementsByTagName("head")[0];
    if (b.substr(0, 5) == "http:" && location.protocol == "https:") {
        if (typeof console != "undefined" && console) {
            var d = "Refused to ajaxish load " + b + " from " + location.href;
            if (typeof console.log == "function") {
                console.log(d)
            } else {
                if (typeof console.error == "function") {
                    console.error(d)
                }
            }
        }
        return false
    }
    if (e) {
        $WH.ae(c, $WH.ce("script", {
            type: "text/javascript",
            src: b
        }));
        return
    }
    var a = $WH.g_getGets();
    if (a.refresh != null) {
        if (a.refresh.length) {
            b += ("&refresh=" + a.refresh)
        } else {
            b += "&refresh"
        }
    }
    if (a.locale != null) {
        b += "&locale=" + a.locale
    }
    if (a.ptr != null) {
        b += "&ptr"
    }
    $WH.ae(c, $WH.ce("script", {
        type: "text/javascript",
        src: b,
        charset: "utf8"
    }))
};
$WH.g_getGets = function() {
    if ($WH.g_getGets.C != null) {
        return $WH.g_getGets.C
    }
    var b = $WH.g_getQueryString();
    var a = $WH.g_parseQueryString(b);
    $WH.g_getGets.C = a;
    return a
};
$WH.g_convertNodesToHtml = function(a) {
    var b = $WH.ce("div");
    $WH.ae(b, a);
    return b.innerHTML
};
$WH.g_escapeHtml = function(a) {
    var b = $WH.ce("div");
    $WH.ae(b, $WH.ct(a));
    return b.innerHTML
};
$WH.g_visitUrlWithPostData = function(b, d) {
    var c = $WH.ce("form");
    c.action = b;
    c.method = "post";
    for (var a in d) {
        if (d.hasOwnProperty(a)) {
            var e = $WH.ce("input");
            e.type = "hidden";
            e.name = a;
            e.value = d[a];
            $WH.ae(c, e)
        }
    }
    $WH.ae(document.body, c);
    c.submit()
};
$WH.g_getQueryString = function() {
    var a = "";
    if (location.pathname) {
        a += location.pathname.substr(1)
    }
    if (location.search) {
        if (location.pathname) {
            a += "&"
        }
        a += location.search.substr(1)
    }
    return a
};
$WH.g_parseQueryString = function(e) {
    e = decodeURIComponent(e);
    var d = e.split("&");
    var c = {};
    for (var b = 0, a = d.length; b < a; ++b) {
        $WH.g_splitQueryParam(d[b], c)
    }
    return c
};
$WH.g_splitQueryParam = function(c, d) {
    var e = c.indexOf("=");
    var a;
    var b;
    if (e != -1) {
        a = c.substr(0, e);
        b = c.substr(e + 1)
    } else {
        a = c;
        b = ""
    }
    d[a] = b
};
$WH.g_createRect = function(d, c, a, b) {
    return {
        l: d,
        t: c,
        r: d + a,
        b: c + b
    }
};
$WH.g_intersectRect = function(d, c) {
    return !(d.l >= c.r || c.l >= d.r || d.t >= c.b || c.t >= d.b)
};
$WH.g_keyPressIsAlphaNumeric = function(b) {
    var a = document.all ? b.keycode : b.which;
    return ((a > 47 && a < 58) || (a > 64 && a < 91) || (a > 95 && a < 112) || a == 222 || a == 0)
};
$WH.g_isRemote = function() {
    return $WH.g_getSite() == "remote"
};
$WH.g_isWowhead = function() {
    return typeof g_wowhead != "undefined" && g_wowhead
};
$WH.g_isHearthhead = function() {
    return typeof g_hearthhead != "undefined" && g_hearthhead
};
$WH.g_isThottbot = function() {
    return typeof g_thottbot != "undefined" && g_thottbot
};
$WH.g_getSite = function() {
    if ($WH.g_isWowhead()) {
        return "wowhead"
    }
    if ($WH.g_isHearthhead()) {
        return "hearthhead"
    }
    if ($WH.g_isThottbot()) {
        return "thottbot"
    }
    return "remote"
};
$WH.g_typeIsHearthstone = function(a) {
    return g_types_host[a] == "hearthhead.com"
};
$WH.g_setupFooterMenus = function() {
    var b = $WH.g_isHearthhead() ? {
        "footer-help-menu": mn_hh_footer_help,
        "footer-tools-menu": mn_hh_footer_tools,
        "footer-about-menu": mn_hh_footer_about
    } : {
        "footer-help-menu": mn_wh_footer_help,
        "footer-tools-menu": mn_wh_footer_tools,
        "footer-about-menu": mn_wh_footer_about
    };
    b["footer-change-view"] = mn_footer_platform;
    for (var c in b) {
        if (!b.hasOwnProperty(c)) {
            continue
        }
        var a = $("#" + c);
        if (a.length) {
            a.addClass("hassubmenu");
            Menu.add(a.get(0), b[c])
        }
    }
};
$WH.g_getConfidenceInterval = function(b, a) {
    if (b == 0 && a == 0) {
        return 0
    }
    var e = 1.96,
        d = 1 * b / a;
    var c = (d + e * e / (2 * a) - e * Math.sqrt((d * (1 - d) + e * e / (4 * a)) / a)) / (1 + e * e / a);
    if (isNaN(c) || c == 0) {
        return (a * -1 + b) / 10000
    }
    return c
};
$WH.g_convertRatingToPercent = function(b, d, h, a) {
    var f = $WH.g_convertRatingToPercent.RB,
        e = $WH.g_convertRatingToPercent.LH,
        g = $WH.g_convertRatingToPercent.LT;
    if (b < 0) {
        b = 1
    } else {
        if (b > 100) {
            b = 100
        }
    }
    if ((d == 12 || d == 13 || d == 14 || d == 15) && b < 34) {
        b = 34
    }
    if ((d == 28 || d == 36) && (a == 2 || a == 6 || a == 7 || a == 11)) {
        f[d] /= 1.3
    }
    if (h < 0) {
        h = 0
    }
    if (g && g[d] && (b >= 80) && (b - 80 < g[d].length)) {
        return h / g[d][b - 80]
    }
    var c;
    if (!f || f[d] == null) {
        c = 0
    } else {
        var j;
        if (b > 80) {
            j = e[b]
        } else {
            if (b > 70) {
                j = (82 / 52) * Math.pow((131 / 63), ((b - 70) / 10))
            } else {
                if (b > 60) {
                    j = (82 / (262 - 3 * b))
                } else {
                    if (b > 10) {
                        j = ((b - 8) / 52)
                    } else {
                        j = 2 / 52
                    }
                }
            }
        }
        c = h / f[d] / j
    }
    return c
};
$WH.g_statToRating = {
    11: 0,
    12: 1,
    13: 2,
    14: 3,
    15: 4,
    16: 5,
    17: 6,
    18: 7,
    19: 8,
    20: 9,
    21: 10,
    25: 15,
    26: 15,
    27: 15,
    28: 17,
    29: 18,
    30: 19,
    31: 5,
    32: 8,
    34: 15,
    35: 15,
    36: 17,
    37: 23,
    44: 24,
    49: 25,
    57: 26,
    59: 11,
    60: 12,
    61: 13,
    62: 16,
    63: 20,
    64: 21,
    40: 29
};
$WH.g_statToJson = {
    0: "mana",
    1: "health",
    3: "agi",
    4: "str",
    5: "int",
    6: "spi",
    7: "sta",
    8: "energy",
    9: "rage",
    10: "focus",
    13: "dodgertng",
    14: "parryrtng",
    16: "mlehitrtng",
    17: "rgdhitrtng",
    18: "splhitrtng",
    19: "mlecritstrkrtng",
    20: "rgdcritstrkrtng",
    21: "splcritstrkrtng",
    22: "_mlehitrtng",
    23: "_rgdhitrtng",
    24: "_splhitrtng",
    25: "_mlecritstrkrtng",
    26: "_rgdcritstrkrtng",
    27: "_splcritstrkrtng",
    28: "mlehastertng",
    29: "rgdhastertng",
    30: "splhastertng",
    31: "hitrtng",
    32: "critstrkrtng",
    33: "_hitrtng",
    34: "_critstrkrtng",
    35: "resirtng",
    36: "hastertng",
    37: "exprtng",
    38: "atkpwr",
    39: "rgdatkpwr",
    40: "versatility",
    41: "splheal",
    42: "spldmg",
    43: "manargn",
    44: "armorpenrtng",
    45: "splpwr",
    46: "healthrgn",
    47: "splpen",
    49: "mastrtng",
    50: "armorbonus",
    51: "firres",
    52: "frores",
    53: "holres",
    54: "shares",
    55: "natres",
    56: "arcres",
    57: "pvppower",
    58: "amplify",
    59: "multistrike",
    60: "readiness",
    61: "speedbonus",
    62: "lifesteal",
    63: "avoidance",
    64: "sturdiness",
    66: "cleave",
    71: "agistrint",
    72: "agistr",
    73: "agiint",
    74: "strint"
};
$WH.g_jsonToStat = {};
for (var i in $WH.g_statToJson) {
    $WH.g_jsonToStat[$WH.g_statToJson[i]] = i
}
$WH.g_individualToGlobalStat = {
    16: 31,
    17: 31,
    18: 31,
    19: 32,
    20: 32,
    21: 32,
    22: 33,
    23: 33,
    24: 33,
    25: 34,
    26: 34,
    27: 34,
    28: 36,
    29: 36,
    30: 36
};
$WH.g_convertScalingFactor = function(c, b, g, d, k) {
    var f = $WH.g_convertScalingFactor.SV;
    var e = $WH.g_convertScalingFactor.SD;
    if (!f || !f[c]) {
        if (g_user.roles & U_GROUP_ADMIN) {
            alert("There are no item scaling values for level " + c)
        }
        return (k ? {} : 0)
    }
    var j = {},
        h = f[c],
        a = e[g];
    if (!a || !(d >= 0 && d <= 9)) {
        j.v = h[b]
    } else {
        j.n = $WH.g_statToJson[a[d]];
        j.s = a[d];
        j.v = Math.floor(h[b] * a[d + 10] / 10000)
    }
    return (k ? j : j.v)
};
g_itemScalingCallbacks = [];
if (!$WH.wowheadRemote) {
    $WH.g_ajaxIshRequest("/data=item-scaling")
}
$WH.g_convertScalingSpell = function(b, g) {
    var j = {},
        f = $WH.g_convertScalingSpell.SV,
        d = $WH.g_convertScalingSpell.SD,
        a, k;
    if (!d || !d[g]) {
        if (g_user.roles & U_GROUP_ADMIN) {
            alert("There are no spell scaling distributions for dist " + g)
        }
        return j
    }
    if (!f[b]) {
        if (g_user.roles & U_GROUP_ADMIN) {
            alert("There are no spell scaling values for level " + b)
        }
        return j
    }
    a = d[g];
    if (!a[3]) {
        if (g_user.roles & U_GROUP_ADMIN) {
            alert("This spell should not scale at all")
        }
        return j
    } else {
        if (a[3] == -1) {
            if (g_user.roles & U_GROUP_ADMIN) {
                alert("This spell should use the generic scaling distribution 12")
            }
            a[3] = 12
        }
    }
    if (!f[b][a[3] - 1]) {
        if (g_user.roles & U_GROUP_ADMIN) {
            alert("Unknown category for spell scaling " + a[3])
        }
        return j
    }
    if (a[15] > 0 && a[15] < b) {
        b = a[15]
    }
    k = f[b][a[3] - 1];
    if (a[13]) {
        k *= (Math.min(b, a[14]) + (a[13] * Math.max(0, b - a[14]))) / b
    }
    j.cast = Math.min(a[1], a[1] > 0 && b > 1 ? a[0] + (((b - 1) * (a[1] - a[0])) / (a[2] - 1)) : a[0]);
    j.effects = {};
    for (var c = 0; c < 3; ++c) {
        var l = a[4 + c],
            h = a[7 + c],
            e = a[10 + c],
            m = j.effects[c + 1] = {};
        m.avg = l * k * (a[1] > 0 ? j.cast / a[1] : 1);
        m.min = Math.round(m.avg) - Math.floor(m.avg * h / 2);
        m.max = Math.round(m.avg) + Math.floor(m.avg * h / 2);
        m.pts = Math.round(e * k);
        m.avg = Math.max(Math.ceil(l), Math.round(m.avg))
    }
    j.cast = Math.round(j.cast / 10) / 100;
    return j
};
if (!$WH.wowheadRemote) {
    //$WH.g_ajaxIshRequest("/data=spell-scaling")
}
$WH.g_getDataSource = function() {
    if ($WH.isset("g_pageInfo")) {
        switch (g_pageInfo.type) {
            case 3:
                if ($WH.isset("g_items")) {
                    return g_items
                }
            case 6:
                if ($WH.isset("g_spells")) {
                    return g_spells
                }
            case 200:
                if ($WH.isset("g_petabilities")) {
                    return g_petabilities
                }
            case 220:
                if ($WH.isset("g_hearthstone_cards")) {
                    return g_hearthstone_cards
                }
        }
    }
    return []
};
$WH.g_setJsonItemLevel = function(s, a, g) {
    if (g && ((g.scalingcategory - 11) > 0)) {
        var m = g.maxlvlscaling ? Math.min(a, g.maxlvlscaling) : a;
        var e = $WH.g_getSpellScalingValue(g.scalingcategory, m);
        for (var p = 1; p < 3; ++p) {
            var l = g["itemenchspell" + p];
            var b = g["itemenchtype" + p];
            var n = $WH.g_statToJson[l];
            if ((b == 5) && s[n]) {
                var c = g["damage" + p];
                if (c) {
                    s[n] = Math.round(e * c)
                }
            }
        }
        if (g.allstats) {
            for (var r in s) {
                s[r] = Math.round(e * g.damage1)
            }
        }
    }
    if (!s.scadist || !s.scaflags) {
        return
    }
    s.bonuses = s.bonuses || {};
    var j = s.scaflags & 255,
        h = (s.scaflags >> 8) & 255,
        o = (s.scaflags & (1 << 16)) != 0,
        d = (s.scaflags & (1 << 17)) != 0,
        u = (s.scaflags & (1 << 18)) != 0,
        t;
    switch (j) {
        case 5:
        case 1:
        case 7:
        case 17:
            t = 7;
            break;
        case 3:
        case 12:
            t = 8;
            break;
        case 16:
        case 11:
        case 14:
            t = 9;
            break;
        case 15:
            t = 10;
            break;
        case 23:
        case 21:
        case 22:
        case 13:
            t = 11;
            break;
        default:
            t = -1
    }
    if (t >= 0) {
        for (var p = 0; p < 10; ++p) {
            var f = $WH.g_convertScalingFactor(a, t, s.scadist, p, 1);
            if (f.n) {
                s[f.n] = f.v
            }
            s.bonuses[f.s] = f.v
        }
    }
    if (u) {
        s.splpwr = s.bonuses[45] = $WH.g_convertScalingFactor(a, 6)
    }
    if (o) {
        switch (j) {
            case 3:
                s.armor = $WH.g_convertScalingFactor(a, 11 + h);
                break;
            case 5:
                s.armor = $WH.g_convertScalingFactor(a, 15 + h);
                break;
            case 1:
                s.armor = $WH.g_convertScalingFactor(a, 19 + h);
                break;
            case 7:
                s.armor = $WH.g_convertScalingFactor(a, 23 + h);
                break;
            case 16:
                s.armor = $WH.g_convertScalingFactor(a, 28);
                break;
            case 14:
                s.armor = $WH.g_convertScalingFactor(a, 29);
                break;
            default:
                s.armor = 0
        }
    }
    if (d) {
        var k = (s.mledps ? "mle" : "rgd"),
            q;
        switch (j) {
            case 23:
            case 21:
            case 22:
            case 13:
                s.dps = s[k + "dps"] = $WH.g_convertScalingFactor(a, u ? 2 : 0);
                q = 0.3;
                break;
            case 17:
                s.dps = s[k + "dps"] = $WH.g_convertScalingFactor(a, u ? 3 : 1);
                q = 0.2;
                break;
            case 15:
                s.dps = s[k + "dps"] = $WH.g_convertScalingFactor(a, h == 19 ? 5 : 4);
                q = 0.3;
                break;
            default:
                s.dps = s[k + "dps"] = 0;
                q = 0
        }
        s.dmgmin = s[k + "dmgmin"] = Math.floor(s.dps * s.speed * (1 - q));
        s.dmgmax = s[k + "dmgmax"] = Math.floor(s.dps * s.speed * (1 + q))
    }
};
$WH.g_setJsonSpellLevel = function(a, b) {
    if (!a.scadist) {
        return
    }
    $WH.cO(a, $WH.g_convertScalingSpell(b, a.scadist))
};
$WH.g_scaleItemEnchantment = function(f, c) {
    var h = f.enchantment;
    if (f.scalinginfo && (f.scalinginfo.scalingcategory - 11) > 0) {
        var e = h.match(/\d+/g);
        if (e) {
            var g = parseInt(f.scalinginfo.maxlvlscaling) ? Math.min(c, parseInt(f.scalinginfo.maxlvlscaling)) : c;
            var b = $WH.g_getSpellScalingValue(f.scalinginfo.scalingcategory, g);
            for (var d = 0; d < e.length; ++d) {
                var a = f.scalinginfo["damage" + (d + 1)];
                if (a) {
                    h = h.replace(e[d], Math.round(b * a))
                }
            }
        }
    }
    return h
};
$WH.g_getItemRandPropPointsType = function(a) {
    var b = a.slotbak ? a.slotbak : a.slot;
    switch (b) {
        case 1:
        case 4:
        case 5:
        case 7:
        case 15:
        case 17:
        case 20:
        case 25:
            return 0;
        case 26:
            if (a.subclass == 19) {
                return 3
            }
            return 0;
        case 13:
        case 21:
        case 22:
            return 3;
        case 3:
        case 6:
        case 8:
        case 10:
        case 12:
            return 1;
        case 2:
        case 9:
        case 11:
        case 14:
        case 16:
        case 23:
            return 2;
        case 28:
            return 4;
        default:
            return -1
    }
};
$WH.scaleHeirloomItemLevel = function(a, o) {
    var g = a.level;
    if (a.scadist) {
        var d = $WH.g_convertScalingFactor.SD;
        var s = $WH.g_curvePoints;
        var l = d ? d[a.scadist] : null;
        if (s && l && l[22] && l[22] > 0) {
            var t = l[22];
            var u = o ? o : 100;
            if (l[20] && u < l[20]) {
                u = l[20]
            }
            if (l[21] && u > l[21]) {
                u = l[21]
            }
            var c = s[t];
            if (c && c.length > 0) {
                var p = 0;
                for (var f in c) {
                    var q = c[f];
                    if (q[1] >= u) {
                        p = f;
                        break
                    }
                }
                var m = c[p];
                var e = null;
                var k = 0;
                if (p > 0) {
                    e = c[p - 1];
                    var r = m[1] - e[1];
                    if (r > 0) {
                        var j = u - e[1];
                        var n = j / r;
                        var h = m[2] - e[2];
                        var b = n * h;
                        k = e[2] + b
                    }
                } else {
                    k = m[2]
                }
                if (k > 0) {
                    g = Math.round(k)
                }
            }
        }
    }
    return g
};
$WH.g_applyStatModifications = function(Y, D, g, A, X, e) {
    if (!Y.quality && Y.name && Y.name.length && parseInt(Y.name[0])) {
        Y.quality = 8 - parseInt(Y.name[0])
    }
    var a = {};
    if (Y.hasOwnProperty("level")) {
        a = $WH.dO(Y)
    } else {
        $WH.cOr(a, Y, "__")
    }
    if (X && X.length) {
        for (var S = 0; S < X.length; ++S) {
            var m = X[S];
            if (m > 0 && $WH.isset("g_itembonuses") && g_itembonuses[m]) {
                var p = g_itembonuses[m];
                for (var Q = 0; Q < p.length; ++Q) {
                    var t = p[Q];
                    switch (t[0]) {
                        case 11:
                            a.scadist = t[1];
                            a.scadistbonus = m;
                            break;
                        default:
                            break
                    }
                }
            }
        }
    }
    a.level = $WH.scaleHeirloomItemLevel(a, e);
    if (g == "pvp" && Y.pvpUpgrade) {
        a.level += Y.pvpUpgrade
    }
    if (a.subitems && a.subitems[D]) {
        for (var Z in a.subitems[D].jsonequip) {
            if (!a.hasOwnProperty(Z)) {
                a[Z] = 0
            }
            a[Z] += a.subitems[D].jsonequip[Z]
        }
    }
    if (X && X.length) {
        if (Y.statsInfo) {
            a.statsInfo = {};
            for (var S in Y.statsInfo) {
                a.statsInfo[S] = {
                    alloc: parseInt(Y.statsInfo[S].alloc),
                    qty: Y.statsInfo[S].qty,
                    socketMult: Y.statsInfo[S].socketMult
                }
            }
        }
        var v = [0, 0, 0, 0, 2147483647, 2147483647, 2147483647, 2147483647];
        a.extraStats = [];
        for (var S = 0; S < X.length; ++S) {
            var m = X[S];
            if (m > 0 && $WH.isset("g_itembonuses") && g_itembonuses[m]) {
                var p = g_itembonuses[m];
                for (var Q = 0; Q < p.length; ++Q) {
                    var t = p[Q];
                    switch (t[0]) {
                        case 1:
                            a.level += t[1];
                            break;
                        case 2:
                            if (a.statsInfo) {
                                if (a.statsInfo.hasOwnProperty(t[1])) {
                                    a.statsInfo[t[1]].alloc += t[2]
                                } else {
                                    a.extraStats.push(t[1]);
                                    a.statsInfo[t[1]] = {
                                        alloc: parseInt(t[2]),
                                        qty: 0,
                                        socketMult: 0
                                    }
                                }
                            }
                            break;
                        case 3:
                            a.name = (8 - parseInt(t[1])) + (a.name ? a.name.substr(1) : "");
                            a.quality = parseInt(t[1]);
                            break;
                        case 4:
                            var R = t[1];
                            var b = t[2];
                            var M = 4;
                            var K = 4;
                            do {
                                if (b <= v[M]) {
                                    var B = R;
                                    R = v[M - 4];
                                    v[M - 4] = B;
                                    var H = b;
                                    b = v[M];
                                    v[M] = H
                                }++M;
                                --K
                            } while (K);
                            break;
                        case 5:
                            if ($WH.isset("g_item_namedescriptions") && g_item_namedescriptions[t[1]]) {
                                a.nameSuffix = g_item_namedescriptions[t[1]][0]
                            }
                            break;
                        case 6:
                            var E = a.nsockets ? a.nsockets : 0;
                            a.nsockets = E + t[1];
                            for (var L = E; L < (E + t[1]); ++L) {
                                a["socket" + (L + 1)] = t[2]
                            }
                            break;
                        case 7:
                            break;
                        case 8:
                            a.reqlevel += t[1];
                            break;
                        default:
                            break
                    }
                }
            }
        }
        if ($WH.isset("g_item_namedescriptions")) {
            a.namedesc = a.namedesc ? a.namedesc : "";
            for (var Q = 0; Q < 4; ++Q) {
                if (v[Q] && g_item_namedescriptions[v[Q]]) {
                    a.namedesc += (!a.namedesc ? "" : " ") + g_item_namedescriptions[v[Q]][0];
                    if (!Q) {
                        a.namedesccolor = g_item_namedescriptions[v[Q]][1]
                    }
                }
            }
        }
    }
    if (Y.statsInfo && Y.level && $WH.g_applyStatModifications.ScalingData) {
        var c = $WH.g_applyStatModifications.ScalingData.AV,
            G = $WH.g_applyStatModifications.ScalingData.SV,
            w = $WH.g_applyStatModifications.ScalingData.AL;
        a.level = A ? A : (g && Y.upgrades && Y.upgrades[g - 1] ? (a.level + Y.upgrades[g - 1]) : a.level);
        var s = a.level - Y.level;
        var F = Math.pow(1.15, s / 15);
        var o = $WH.g_getItemRandPropPointsType(a);
        var I = G[a.level];
        var q = 0;
        if (o != -1) {
            var k = 0;
            switch (a.quality) {
                case 5:
                case 4:
                    k = 0;
                    break;
                case 7:
                case 3:
                    k = 1;
                    break;
                case 2:
                    k = 2;
                    break;
                default:
                    break
            }
            var r = k * 5 + o;
            q = I[r] ? I[r] : 0
        }
        var h = G[a.level][15];
        for (var S in $WH.g_statToJson) {
            var N = $WH.g_statToJson[S];
            if (a[N] || (a.statsInfo && a.statsInfo[S])) {
                var f = 0;
                var W = 0;
                if (a.statsInfo.hasOwnProperty(S)) {
                    f = parseFloat(a.statsInfo[S].socketMult);
                    W = parseInt(a.statsInfo[S].alloc)
                }
                var y = Math.round(f * h);
                if (W && q > 0) {
                    a[N] = Math.round((W / 10000) * q) - y
                } else {
                    a[N] = Math.floor(((a[N] + y) * F) - y)
                }
                switch (N) {
                    case "agistrint":
                        a.agi = a.str = a["int"] = a[N];
                        break;
                    case "agistr":
                        a.agi = a.str = a[N];
                        break;
                    case "agiint":
                        a.agi = a["int"] = a[N];
                        break;
                    case "strint":
                        a.str = a["int"] = a[N];
                        break;
                    default:
                        break
                }
            }
        }
        if (a.armor && c[a.level]) {
            var u = (a.quality == 7) ? 3 : a.quality;
            var U = (a.subclass == -6) ? 1 : a.subclass;
            if ($WH.in_array([1, 2, 3, 4], U) != -1) {
                var V = c[a.level][11 + u];
                var l = c[a.level][U - 1];
                var O = w[a.slot][U - 1];
                a.armor = Math.floor(l * V * O + 0.5)
            }
            if (a.subclass == 6) {
                a.armor = c[a.level][4 + u]
            }
        }
        if (a.dps) {
            var P = ["dps", "mledps", "rgddps"];
            var d = ["dmgmin1", "mledmgmin", "rgddmgmin", "dmgmax1", "mledmgmax", "rgddmgmax"];
            var C = 0,
                J = 0,
                z = 0;
            var T = $WH.g_getEffectiveWeaponDamage(a.level, a.classs, a.subclass, a.quality, a.speed * 1000, a.dmgrange, a.slotbak ? a.slotbak : a.slot, a.flags2, false);
            J = Math.floor(T);
            z = $WH.g_getEffectiveWeaponDamage(a.level, a.classs, a.subclass, a.quality, a.speed * 1000, a.dmgrange, a.slotbak ? a.slotbak : a.slot, a.flags2, true);
            C = ((T + z) / 2) / a.speed;
            for (var S in P) {
                if (a[P[S]]) {
                    a[P[S]] = parseFloat(C.toFixed(2))
                }
            }
            for (var S in d) {
                if (a[d[S]]) {
                    if (d[S].indexOf("max") != -1) {
                        a[d[S]] = z
                    } else {
                        a[d[S]] = J
                    }
                }
            }
        }
    }
    return a
};
$WH.g_applyStatModifications.ITEM_CHALLENGEMODE_LEVEL = 630;
$WH.g_applyStatModifications.ITEM_TIMEWALKINGMODE_TBC_LEVEL = 95;
$WH.g_applyStatModifications.ITEM_TIMEWALKINGMODE_WOTLK_LEVEL = 160;
$WH.g_getItemDamageValue = function(c, e, b) {
    var a = $WH.g_applyStatModifications.ScalingData.DV;
    var d = 7 * b + e;
    if (a && a[c] && a[c][d]) {
        return a[c][d]
    }
    return 0
};
$WH.g_getEffectiveWeaponDamage = function(e, a, f, l, d, g, b, m, j) {
    g = g ? g : 0;
    var h = 0;
    var k = 0;
    var n = false;
    var c = (m & 512);
    if (a != 2) {
        return 0
    }
    if (l > 7) {
        return 0
    }
    if (l == 7) {
        l = 3
    }
    if (b > 22) {
        if (b == 24) {
            k = 0;
            n = true
        }
        if (!n && (b <= 24 || b > 26)) {
            n = true
        }
    } else {
        if (b == 21 || b == 22 || b == 13) {
            if (!c) {
                k = $WH.g_getItemDamageValue(e, l, 0)
            } else {
                k = $WH.g_getItemDamageValue(e, l, 1)
            }
            n = true
        }
        if (!n && b != 15) {
            if (b != 17) {
                n = true
            } else {
                if (!c) {
                    k = $WH.g_getItemDamageValue(e, l, 2)
                } else {
                    k = $WH.g_getItemDamageValue(e, l, 3)
                }
                n = true
            }
        }
    }
    if (!n && f >= 2) {
        if (f == 2 || f == 3 || f == 18) {
            if (!c) {
                k = $WH.g_getItemDamageValue(e, l, 2)
            } else {
                k = $WH.g_getItemDamageValue(e, l, 3)
            }
            n = true
        }
        if (!n && f == 19) {
            k = $WH.g_getItemDamageValue(e, l, 1)
        }
    }
    if (k > 0) {
        if (!j) {
            h = k * (d / 1000) * (1 - g / 2)
        } else {
            h = Math.floor((k * (d / 1000) * (1 + g / 2)) + 0.5)
        }
    }
    return h
};
$WH.g_getJsonReforge = function(b, c) {
    if (!c) {
        if (!$WH.g_reforgeStats) {
            return []
        }
        b.__reforge = {};
        b.__reforge.all = [];
        for (var c in $WH.g_reforgeStats) {
            var d = $WH.g_getJsonReforge(b, c);
            if (d.amount) {
                b.__reforge.all.push(d)
            }
        }
        return b.__reforge.all
    }
    if (!$WH.g_reforgeStats || !$WH.g_reforgeStats[c]) {
        return {}
    }
    b.__statidx = {};
    for (var a in b) {
        if ($WH.g_individualToGlobalStat[$WH.g_jsonToStat[a]]) {
            b.__statidx[$WH.g_individualToGlobalStat[$WH.g_jsonToStat[a]]] = b[a]
        } else {
            b.__statidx[$WH.g_jsonToStat[a]] = b[a]
        }
    }
    if (!b.__reforge) {
        b.__reforge = {}
    }
    var d = b.__reforge[c] = $WH.dO($WH.g_reforgeStats[c]);
    b.__reforge[c].amount = Math.floor(d.v * (b.__statidx[d.i1] && !b.__statidx[d.i2] ? b.__statidx[d.i1] : 0));
    return b.__reforge[c]
};
$WH.g_getJsonItemEnchantMask = function(a) {
    if (a.classs == 2 && a.subclass == 19) {
        return 1 << (21 - 1)
    }
    return 1 << (a.slot - 1)
};
$WH.g_setItemModifications = function(j, t, O, g, c) {
    if (!$WH.isset("g_items") || !g_items[t] || !g_items[t].jsonequip) {
        return j
    }
    O = O ? O.split(":") : null;
    var l = g_items[t].bonusesData;
    var p = 0;
    var k = O ? O.indexOf("u") : -1;
    if (l && k != -1) {
        p = O[k + 1];
        O.splice(k, 1)
    }
    var s = 0;
    switch (g) {
        case "chal":
            s = $WH.g_applyStatModifications.ITEM_CHALLENGEMODE_LEVEL;
            break;
        case "twtbc":
            s = $WH.g_applyStatModifications.ITEM_TIMEWALKINGMODE_TBC_LEVEL;
            break;
        case "twwotlk":
            s = $WH.g_applyStatModifications.ITEM_TIMEWALKINGMODE_WOTLK_LEVEL;
            break
    }
    g = !s ? g : null;
    var H = $WH.g_applyStatModifications(g_items[t].jsonequip, 0, g, s, O, c);
    if (p) {
        var y = $WH.g_bonusesBtnGetContextBonusId(O);
        var q = l[y].sub[p].sub;
        for (var A in q) {
            var f = $WH.g_applyStatModifications(g_items[t].jsonequip, 0, g, s, [y, A]);
            for (var K in f.statsInfo) {
                var d = f[$WH.g_statToJson[K]];
                if (H.statsInfo[K]) {
                    if (typeof H[$WH.g_statToJson[K]] == "number" || !H[$WH.g_statToJson[K]]) {
                        var C = H[$WH.g_statToJson[K]] ? H[$WH.g_statToJson[K]] : d;
                        H[$WH.g_statToJson[K]] = {};
                        H[$WH.g_statToJson[K]]["min"] = C;
                        H[$WH.g_statToJson[K]]["max"] = C
                    }
                    var L = H[$WH.g_statToJson[K]]["min"];
                    var w = H[$WH.g_statToJson[K]]["max"];
                    if (d < L) {
                        H[$WH.g_statToJson[K]]["min"] = d
                    } else {
                        if (d > w) {
                            H[$WH.g_statToJson[K]]["max"] = d
                        }
                    }
                }
            }
        }
    }
    j = j.replace(/(<!--ilvl-->)\d+/, function(R, Q) {
        return Q + H.level
    });
    if (H.scadist) {
        var m = $WH.g_convertScalingFactor.SD;
        var B = m ? m[H.scadist] : null;
        if (B && B[21]) {
            var r = (B[20] ? B[20] : 1);
            var v = B[21];
            c = ((c && c <= v) ? c : v);
            j = j.replace(/(<!--lvl-->)\d+/g, function(R, Q) {
                return Q + ((c && c <= v) ? c : v)
            });
            j = j.replace(/(<!--minlvl-->)\d+/, function(R, Q) {
                return Q + r
            });
            j = j.replace(/(<!--maxlvl-->)\d+/, function(R, Q) {
                return Q + v
            });
            j = j.replace(/<!--i\?(\d+):(\d+):(\d+):(\d+):(\d+):(\d+)/, function(U, W, S, Q, T, R, V) {
                return "<!--i?" + W + ":" + r + ":" + v + ":" + c + ":" + H.scadist + ":" + V
            });
            j = j.replace(/(<!--huindex-->)\d+/, function(R, Q) {
                var S = 0;
                if (H.scadistbonus && H.heirloombonuses) {
                    if (parseInt(H.scadistbonus) == H.heirloombonuses[0]) {
                        S = 1
                    } else {
                        if (parseInt(H.scadistbonus) == H.heirloombonuses[1]) {
                            S = 2
                        }
                    }
                }
                return Q + S
            });
            var P = j.match(/<!--\?([0-9-:]*)-->/);
            if (P) {
                P = P[1].split(":");
                var I = parseInt(P[4]) || 0;
                if (I > 0) {
                    var M = {
                        scadist: I
                    };
                    $WH.g_setJsonSpellLevel(M, c);
                    if (M.effects) {
                        j = $WH.g_adjustSpellPoints(j, M)
                    }
                }
            }
        }
    }
    j = j.replace(/(<!--pvpilvl-->)\d+/, function(R, Q) {
        return Q + (H.level + ((g != "pvp") ? H.pvpUpgrade : 0))
    });
    j = j.replace(/(<!--rlvl-->)\d+/, function(R, Q) {
        return Q + H.reqlevel
    });
    j = j.replace(/(<!--uindex-->)\d+/, function(R, Q) {
        return (g && g != "pvp") ? (Q + g) : R
    });
    var a = (typeof H.dmgrange != "undefined") && H.dmgrange;
    var J = new RegExp("(<!--dmg-->)\\d+" + (a ? "(\\D*?)\\d+" : "") + "");
    j = j.replace(J, function(S, Q, R) {
        return Q + H.dmgmin1 + (a ? (R + H.dmgmax1) : "")
    });
    j = j.replace(/(<!--dps-->\D*?)(\d+\.\d+)/, function(R, Q) {
        return Q + (H.dps ? H.dps.toFixed(2) : "0")
    });
    j = j.replace(/(<!--amr-->)\d+/, function(R, Q) {
        return Q + H.armor
    });
    j = j.replace(/<span><!--stat(\d+)-->[-+]\d+(\D*?)<\/span>(<!--e-->)?(<!--ps-->)?(<br ?\/?>)?/gi, function(Q, V, T, W, R, Z) {
        var S, Y = (H[$WH.g_statToJson[V]] ? H[$WH.g_statToJson[V]] : 0);
        if (Y) {
            var U = p && Y.min ? Y.min : Y;
            var X = p && Y.max ? Y.max : Y;
            Y = (U > 0 ? "+" : "-") + (U != X ? (U + "-" + X) : U);
            S = "";
            Z = (Z ? "<br />" : "")
        } else {
            Y = "+0";
            S = ' style="display: none"';
            Z = (Z ? "<!--br-->" : "")
        }
        return "<span" + S + "><!--stat" + V + "-->" + Y + T + "</span>" + (W || "") + (R || "") + Z
    });
    j = j.replace(/<span class="q2">((?:<!--stat\d+-->)?[-+])<!--rtg(\d+)-->\d+(.*?)<\/span>(<br \/>)?/gi, function(Q, S, T, X, Y) {
        var R, W = (H[$WH.g_statToJson[T]] ? H[$WH.g_statToJson[T]] : 0);
        if (W) {
            var U = p && W.min ? W.min : W;
            var V = p && W.max ? W.max : W;
            W = (U != V ? (U + "-" + V) : U);
            R = "";
            Y = (Y ? "<br />" : "")
        } else {
            R = ' style="display: none"';
            Y = (Y ? "<!--br-->" : "")
        }
        return '<span class="q2"' + R + ">" + S + "<!--rtg" + T + "-->" + W + X + "</span>" + Y
    });
    if (H.extraStats && H.extraStats.length) {
        j = j.replace(/<!--re--><span[^<]*?<\/span>(<br \/>)?/, "");
        var u = [4, 3, 5, 71, 72, 73, 74, 7, 1, 0, 8, 9, 2, 10];
        j = j.replace(/<!--ebstats-->/, function(Y) {
            var T = "";
            for (var S = 0; S < H.extraStats.length; ++S) {
                var Q = H.extraStats[S];
                if (u.indexOf(Q) == -1) {
                    continue
                }
                var U = "$1$2 " + ($WH.g_statToJson && $WH.g_statToJson[Q] && LANG.traits[$WH.g_statToJson[Q]] ? LANG.traits[$WH.g_statToJson[Q]][1] : "Unknown");
                var V = $WH.g_statToJson && $WH.g_statToJson[Q] ? H[$WH.g_statToJson[Q]] : 0;
                var R = p && V.min ? V.min : V;
                var W = p && V.max ? V.max : V;
                var X = (R != W ? (R + "-" + W) : R);
                T += "<br /><span><!--stat" + Q + "-->" + $WH.sprintf(U, (R < 0) ? "-" : "+", X) + "</span>"
            }
            return T + Y
        });
        j = j.replace(/<!--egstats-->/, function(aa) {
            var T = "";
            for (var S = 0; S < H.extraStats.length; ++S) {
                var Q = H.extraStats[S];
                if (u.indexOf(Q) != -1) {
                    continue
                }
                var V = "$1$2 " + ($WH.g_statToJson && $WH.g_statToJson[Q] && LANG.traits[$WH.g_statToJson[Q]] ? LANG.traits[$WH.g_statToJson[Q]][1] : "Unknown");
                var W = $WH.g_statToJson && $WH.g_statToJson[Q] ? H[$WH.g_statToJson[Q]] : 0;
                var R = p && W.min ? W.min : W;
                var X = p && W.max ? W.max : W;
                var Z = (R != X ? (R + "-" + X) : R);
                var U = $WH.sprintf("<!--rtg$1-->$2", Q, Z);
                var ab = "";
                if ($WH.g_statToRating && $WH.g_statToRating[Q]) {
                    ab = $WH.sprintf("&nbsp;<small>(<!--rtg%$1-->0&nbsp;@&nbsp;L$2100)</small>", Q, p ? "" : "<!--lvl-->")
                }
                var Y = "";
                if (Q == 50) {
                    Y = "<!--stat%d-->"
                }
                T += '<br /><span class="q2">' + Y + $WH.sprintf(V, (R >= 0) ? "+" : "-", U) + ab + "</span>"
            }
            return T + aa
        })
    }
    j = j.replace(/(<!--rtg%(\d+)-->)([\.0-9]+)%?/g, function(T, Q, U, R) {
        P = j.match(new RegExp("<!--rtg" + U + "-->(\\d+)(-\\d+)?"));
        if (!P) {
            return T
        }
        var S = P[2] ? ((Math.abs(parseInt(P[2])) + parseInt(P[1])) / 2) : P[1];
        return Q + (P[2] ? "~" : "") + (Math.round($WH.g_convertRatingToPercent(c ? c : 100, U, S) * 100) / 100) + (U != 49 ? "%" : "")
    });
    j = j.replace(/(<!--nstart-->)(.*)(<!--nend-->)/, function(T, U, S, Q) {
        var W = 8 - parseInt(H.name.substr(0, 1));
        var R = H.name.substr(1);
        var V = H.nameSuffix ? (" " + H.nameSuffix) : "";
        return U + $WH.sprintf('<b class="q$1">$2</b>', W, R + V) + Q
    });
    j = j.replace(/(<!--ndstart-->)(.*)(<!--ndend-->)/, function(T, R, Q, U) {
        if (!H.namedesccolor) {
            return T
        }
        var S = parseInt(H.namedesccolor).toString(16);
        while (S.length < 6) {
            S = "0" + S
        }
        return R + (H.namedesc ? $WH.sprintf('<br /><span style="color: $1">$2</span>', "#" + S, H.namedesc) : Q) + U
    });
    var E = g_items[t].jsonequip.nsockets | 0;
    if ((!E && H.nsockets) || (E && H.nsockets > E)) {
        j = j.replace(/<!--ps-->(<br \/>)?/, function(V, U) {
            var S = "";
            for (var T = E; T < H.nsockets; ++T) {
                if (!H["socket" + (T + 1)]) {
                    continue
                }
                var Q = 7;
                var R = "socket-unknown";
                switch (H["socket" + (T + 1)]) {
                    case 1:
                        Q = 1;
                        R = "socket-meta";
                        break;
                    case 2:
                        Q = 2;
                        R = "socket-red";
                        break;
                    case 4:
                        Q = 3;
                        R = "socket-yellow";
                        break;
                    case 8:
                        Q = 4;
                        R = "socket-blue";
                        break;
                    case 16:
                        Q = 5;
                        R = "socket-hydraulic";
                        break;
                    case 32:
                        Q = 6;
                        R = "socket-cogwheel";
                        break;
                    case 14:
                        Q = 7;
                        R = "socket-prismatic";
                        break;
                    default:
                        break
                }
                var W = $WH.sprintf('<a href="/items=3&amp;filter=cr=81;crs=$1;crv=0" class="$2 q0">', Q, R);
                W += (g_socket_names[H["socket" + (T + 1)]]) ? g_socket_names[H["socket" + (T + 1)]] : "Unknown Socket";
                W += "</a>";
                S += "<br />" + W
            }
            return "<br />" + S + "<br /><br />"
        })
    }
    if ($WH.g_applyStatModifications && $WH.g_applyStatModifications.ScalingData) {
        var e;
        var b = /(<!--pts(\d):(\d):(\d+(?:\.\d+)?):(\d+):(\d+(?:\.\d+)?)-->(?:<!--rtg\d+-->)?)(\d+(?:\.\d+)?)(<!---->(%?))?/g;
        while ((e = b.exec(j)) !== null) {
            var N = parseFloat(e[6]);
            var D = $WH.g_applyStatModifications.ScalingData.SV;
            var F = D[H.level];
            var h = 0;
            switch (H.quality) {
                case 5:
                case 4:
                case 7:
                case 3:
                    h = 1;
                    break;
                case 2:
                    h = 2;
                    break;
                default:
                    break
            }
            var o = h * 5;
            var n = F[o] ? F[o] : 0;
            var G = (N * n).toFixed((e[9] == "%") ? 2 : 0);
            j = j.replace(e[0], e[1] + G + (e[8] ? e[8] : ""))
        }
    }
    var z = 0;
    switch (s) {
        case $WH.g_applyStatModifications.ITEM_TIMEWALKINGMODE_TBC_LEVEL:
            z = 70;
            break;
        case $WH.g_applyStatModifications.ITEM_TIMEWALKINGMODE_WOTLK_LEVEL:
            z = 80;
            break;
        default:
            break
    }
    if (z) {
        j = j.replace(/<!--ee(\d+):(\d+):(\d+):(\d+):(\d+):(\d+)-->([^<]*)<\/span>/gi, function(Q, Z, U, T, Y, W, V, X) {
            var R = {
                enchantment: X,
                scalinginfo: {
                    scalingcategory: Z,
                    minlvlscaling: U,
                    maxlvlscaling: T,
                    damage1: Y / 1000,
                    damage2: W / 1000,
                    damage3: V / 1000
                }
            };
            var S = $WH.g_scaleItemEnchantment(R, z);
            return "<!--ee-->" + S + "</span>"
        })
    }
    return j
};
$WH.g_setTooltipLevel = function(f, a, p) {
    var t = typeof f;
    if (t == "number") {
        var b = $WH.g_getDataSource();
        if (b[f] && b[f][(p ? "buff_" : "tooltip_") + Locale.getName()]) {
            f = b[f][(p ? "buff_" : "tooltip_") + Locale.getName()]
        } else {
            return f
        }
    } else {
        if (t != "string") {
            return f
        }
    }
    f = f.replace(/<!--(gem|ee)(\d+):(\d+):(\d+):(\d+):(\d+):(\d+)-->([^<]*)<\/span>/gi, function(j, E, D, y, w, C, B, z, A) {
        var u = {
            enchantment: A,
            scalinginfo: {
                scalingcategory: D,
                minlvlscaling: y,
                maxlvlscaling: w,
                damage1: C / 1000,
                damage2: B / 1000,
                damage3: z / 1000
            }
        };
        var v = $WH.g_scaleItemEnchantment(u, a);
        return "<!--" + E + "-->" + v + "</span>"
    });
    t = f.match(/<!--i?\?([0-9-:]*)-->/);
    if (!t) {
        return f
    }
    t = t[1].split(":");
    var a = Math.min(parseInt(t[2]), Math.max(parseInt(t[1]), a)),
        q = parseInt(t[4]) || 0;
    if (q) {
        if (!f.match(/<!--pts\d:\d:\d+(?:\.\d+)?:\d+-->/g) && !(q < 0)) {
            f = $WH.g_setItemModifications(f, parseInt(t[0]), null, null, a);
            $WH.updateItemStringLink.call(this)
        } else {
            if (q > 0) {
                if (!parseInt(t[7]) && $WH.isset("g_pageInfo") && g_pageInfo.type == 3 && g_items[g_pageInfo.typeId] && g_items[g_pageInfo.typeId].quality != 7) {
                    a = Math.min(g_items[g_pageInfo.typeId].reqlevel, a)
                }
                var o = {
                    scadist: q
                };
                $WH.g_setJsonSpellLevel(o, a);
                f = f.replace(/<!--cast-->\d+\.\d+/, "<!--cast-->" + o.cast);
                var g;
                var d = /<!--\?\+\+(\d+):(\d+)-->/g;
                while ((g = d.exec(f)) !== null) {
                    var h = parseInt(g[1]);
                    var r = parseInt(g[2]);
                    o[h] = {
                        scadist: r
                    };
                    $WH.g_setJsonSpellLevel(o[h], a)
                }
                if (o.effects) {
                    f = $WH.g_adjustSpellPoints(f, o);
                    if (this.modified) {
                        for (var c in this.modified[1]) {
                            var s = this.modified[1][c];
                            for (var m = 0; m < s.length; ++m) {
                                s[m][0] = $WH.g_adjustSpellPoints(s[m][0], o);
                                s[m][1] = $WH.g_adjustSpellPoints(s[m][1], o)
                            }
                        }
                    }
                }
            } else {
                var k = -q;
                var e = $WH.g_getSpellScalingValue(k, a);
                for (var n = 0; n < 3; ++n) {
                    var l = t[5 + n] / 1000;
                    f = f.replace(new RegExp("<!--gem" + (n + 1) + "-->(.+?)<"), "<!--gem" + (n + 1) + "-->" + Math.round(e * l) + "<")
                }
            }
        }
    }
    f = f.replace(/<!--ppl(\d+):(\d+):(\d+):(\d+)-->\s*\d+/gi, function(v, j, u, w, y) {
        return "<!--ppl" + j + ":" + u + ":" + w + ":" + y + "-->" + Math.round(parseInt(w) + (Math.min(Math.max(a, j), u) - j) * y / 100)
    });
    f = f.replace(/(<!--rtg%(\d+)-->)([\.0-9]+)%?/g, function(v, j, w, u) {
        t = f.match(new RegExp("<!--rtg" + w + "-->(\\d+)"));
        if (!t) {
            return v
        }
        return j + (Math.round($WH.g_convertRatingToPercent(a, w, t[1]) * 100) / 100) + (w != 49 ? "%" : "")
    });
    f = f.replace(/(<!--i?\?\d+:\d+:\d+:)\d+/g, "$1" + a);
    f = f.replace(/<!--lvl-->\d+/g, "<!--lvl-->" + a);
    return f
};
$WH.g_getSpellScalingValue = function(b, c) {
    var a = $WH.g_convertScalingSpell ? $WH.g_convertScalingSpell.SV : null;
    if (!a) {
        return 0
    }
    return a[c][b - 1]
};
$WH.g_adjustSpellPoints = function(c, b) {
    for (var a = 1; a < 4; ++a) {
        c = c.replace(new RegExp("<!--pts" + a + ":0:0:(\\d+)-->(<!--rtg\\d+-->)?(.+?)<", "g"), function(g, f, e) {
            var d = (b[f] && b[f].hasOwnProperty("effects")) ? b[f].effects[a] : b.effects[a];
            if (!d) {
                return g
            }
            return "<!--pts" + a + ":0:0:" + f + "-->" + (e ? e : "") + (d.min == d.max ? d.avg : d.min + " to " + d.max) + "<"
        });
        c = c.replace(new RegExp("<!--pts" + a + ":1:0:(\\d+)-->(<!--rtg\\d+-->)?(.+?)<", "g"), function(g, f, e) {
            var d = (b[f] && b[f].hasOwnProperty("effects")) ? b[f].effects[a] : b.effects[a];
            if (!d) {
                return g
            }
            return "<!--pts" + a + ":1:0:" + f + "-->" + (e ? e : "") + d.min + "<"
        });
        c = c.replace(new RegExp("<!--pts" + a + ":2:0:(\\d+)-->(<!--rtg\\d+-->)?(.+?)<", "g"), function(g, f, e) {
            var d = (b[f] && b[f].hasOwnProperty("effects")) ? b[f].effects[a] : b.effects[a];
            if (!d) {
                return g
            }
            return "<!--pts" + a + ":2:0:" + f + "-->" + d.max + "<"
        });
        c = c.replace(new RegExp("<!--pts" + a + ":3:(\\d+(?:\\.\\d+)?):(\\d+)-->(<!--rtg\\d+-->)?(.+?)<", "g"), function(h, g, f, e) {
            var d = (b[f] && b[f].hasOwnProperty("effects")) ? b[f].effects[a] : b.effects[a];
            if (!d) {
                return h
            }
            return "<!--pts" + a + ":3:" + g + ":" + f + "-->" + (e ? e : "") + Math.round(d.avg * g) + "<"
        });
        c = c.replace(new RegExp("<!--pts" + a + ":4:0:(\\d+)-->(<!--rtg\\d+-->)?(.+?)<", "g"), function(g, f, e) {
            var d = (b[f] && b[f].hasOwnProperty("effects")) ? b[f].effects[a] : b.effects[a];
            if (!d) {
                return g
            }
            return "<!--pts" + a + ":4:0:" + f + "-->" + (e ? e : "") + d.pts + "<"
        })
    }
    return c
};
$WH.g_setTooltipSpells = function(h, e, g, c) {
    var l = {},
        j = "<!--sp([0-9]+):[01]-->.*?<!--sp\\1-->",
        d;
    if (e == null) {
        e = []
    }
    if (c == null) {
        c = {}
    }
    for (var b = 0; b < e.length; ++b) {
        l[e[b]] = 1
    }
    if (d = h.match(new RegExp(j, "g"))) {
        for (var b = 0; b < d.length; ++b) {
            var a = d[b].match(j)[1];
            l[a] = (l[a] | 0);
            if (c[a] == null) {
                c[a] = -1
            }
            c[a]++;
            if (g[a] == null || g[a][c[a]] == null || g[a][c[a]][l[a]] == null) {
                continue
            }
            var f = g[a][c[a]][l[a]];
            f = $WH.g_setTooltipSpells(f, e, g, c);
            if (l[a] && !g[a][c[a]][0] && (b < (d.length - 1)) && (h.indexOf(d[b] + d[b + 1]) != -1)) {
                var k = d[b + 1].match(j)[1];
                l[k] = (l[k] | 0);
                h = h.replace(d[b + 1], "<!--sp" + k + ":" + l[k] + "-->" + f + "<!--sp" + k + "-->");
                continue
            }
            h = h.replace(d[b], "<!--sp" + a + ":" + l[a] + "-->" + f + "<!--sp" + a + "-->")
        }
    }
    return h
};
$WH.g_enhanceTooltip = function(p, o, z, K, r, f, N, k, G, u, d, B, q, A) {
    if ((!$WH.g_applyStatModifications || !$WH.g_applyStatModifications.ScalingData) && (A || k)) {
        g_itemScalingCallbacks.push((function(P) {
            return function() {
                var Q = $WH.g_enhanceTooltip.call(P, p, o, z, K, r, f, N, k, G, u, d, B, q, A);
                $WH.updateTooltip.call(P, Q)
            }
        })(this));
        return LANG.tooltip_loading
    }
    var O = typeof p,
        c, E;
    var s = $WH.g_getDataSource();
    var l = $WH.isset("g_pageInfo") ? g_pageInfo.type : null;
    E = $WH.isset("g_pageInfo") ? g_pageInfo.typeId : null;
    this._knownSpells = f;
    if (O == "number") {
        E = p;
        var m = "tooltip_";
        if (r) {
            m = "buff_"
        }
        if (B) {
            m = "tooltip_premium_"
        }
        if (q) {
            m = "text_"
        }
        if (s[E] && s[E][m + Locale.getName()]) {
            p = s[E][m + Locale.getName()];
            c = s[E][(r ? "buff" : "") + "spells_" + Locale.getName()];
            this._rppmModList = s[E]["rppmmod"];
            if (c) {
                p = $WH.g_setTooltipSpells(p, f, c)
            }
        } else {
            return p
        }
    } else {
        if (O != "string") {
            return p
        }
    }
    if (z) {
        var M = $WH.g_getGets();
        if (M.lvl) {
            p = $WH.g_setTooltipLevel(p, M.lvl, r)
        }
    }
    if ((A || k) && E) {
        p = $WH.g_setItemModifications(p, E, A, k, this._selectedLevel ? this._selectedLevel : null)
    }
    if (o) {
        p = p.replace(/\(([^\)]*?<!--lvl-->[^\(]*?)\)/gi, function(Q, P) {
            return '(<a href="javascript:;" onmousedown="return false" class="tip" style="color: white; cursor: pointer" onclick="$WH.g_staticTooltipLevelClick(this, null, 0)" onmouseover="$WH.Tooltip.showAtCursor(event, \'<span class=\\\'q2\\\'>\' + LANG.tooltip_changelevel + \'</span>\')" onmousemove="$WH.Tooltip.cursorUpdate(event)" onmouseout="$WH.Tooltip.hide()">' + P + "</a>)"
        })
    }
    if (K && Slider) {
        var g = $WH.g_groupSizeScalingShouldShow(E);
        if (r) {
            r.bufftip = this;
            if (g && $WH.isset("g_difficulties") && g_difficulties[g]) {
                p = $WH.g_groupSizeScalingOnChange.call(r, this, g_difficulties[g].maxplayers, 1, true)
            }
        } else {
            var e = new RegExp("<!--" + ((l && l == 3) ? "i" : "") + "\\?(\\d+):(\\d+):(\\d+):(\\d+)");
            var I = p.match(e);
            if (g && $WH.isset("g_difficulties") && g_difficulties[g]) {
                var F = $WH.ce("label");
                F.innerHTML = LANG.tooltip_difficulty + ": ";
                this._difficultyBtn = $WH.ce("a");
                this._difficultyBtn.ttId = E;
                $WH.g_difficultyBtnBuildMenu.call(this, E);
                Menu.add(this._difficultyBtn, this._difficultyBtn.menu);
                $("#dd" + E).append(F).append(this._difficultyBtn);
                $WH.g_difficultyBtnOnChange.call(this, g);
                p = $WH.g_groupSizeScalingOnChange.call(this, this, g_difficulties[g].maxplayers, 0, true)
            } else {
                if (I) {
                    if (I[2] != I[3]) {
                        this.slider = Slider.init(K, {
                            minValue: parseInt(I[2]),
                            maxValue: parseInt(I[3]),
                            onMove: $WH.g_tooltipSliderMove.bind(this)
                        });
                        Slider.setValue(this.slider, parseInt(I[4]));
                        this.slider.onmouseover = function(P) {
                            $WH.Tooltip.showAtCursor(P, LANG.tooltip_changelevel2, 0, 0, "q2")
                        };
                        this.slider.onmousemove = $WH.Tooltip.cursorUpdate;
                        this.slider.onmouseout = $WH.Tooltip.hide;
                        this.slider.input.onmouseover = function(P) {
                            $WH.Tooltip.showAtCursor(P, LANG.tooltip_changelevel, 0, 0, "q2")
                        };
                        this.slider.input.onmousemove = $WH.Tooltip.cursorUpdate;
                        this.slider.input.onmouseout = $WH.Tooltip.hide
                    }
                }
            }
        }
    }
    if (N) {
        if (r && r.modified) {
            r.bufftip = this
        } else {
            for (var L in c) {
                if (!g_spells[L] || $WH.in_array(f, L) != -1) {
                    continue
                }
                $(N).append('<input type="checkbox" id="known-' + L + '" />').append('<label for="known-' + L + '"><a rel="spell=' + L + "&know=" + L + '">' + g_spells[L]["name_" + Locale.getName()] + (g_spells[L]["rank_" + Locale.getName()] ? " (" + g_spells[L]["rank_" + Locale.getName()] + ")" : "") + "</a></label>").append("<br />");
                $("#known-" + L).change($WH.g_tooltipSpellsChange.bind(this))
            }
        }
        this.modified = [N, c, f];
        $(N).toggle(!$(N).is(":empty"))
    }
    if (d) {
        var a = p.match(/<!--rppm-->(\d+(?:\.\d+)?)<!--rppm-->/);
        if (a) {
            var j = $("#rppm" + E);
            if (this._rppmModList.hasOwnProperty(4)) {
                this._rppmModBase = parseFloat(a[1]);
                if (j.is(":empty")) {
                    this._rppmSpecModList = this._rppmModList[4];
                    this._rppmSpecModList.splice(0, 0, {
                        spec: -1,
                        modifiervalue: 0,
                        filename: ""
                    });
                    j.append(g_getMajorHeading(LANG.realppmmodifiers, 2, 3));
                    for (var L in this._rppmSpecModList) {
                        var n = Icon.create(this._rppmSpecModList[L]["filename"], 0, null);
                        n.style.display = "inline-block";
                        n.style.verticalAlign = "middle";
                        var h = $('<input name="rppmmod" type="radio" id="rppm-' + L + '" />');
                        h.get(0).checked = (this._rppmSpecModList[L]["spec"] == -1);
                        j.append(h).append(this._rppmSpecModList[L]["spec"] == -1 ? "" : n).append('<label for="rppm-' + L + '"> <a>' + (this._rppmSpecModList[L]["spec"] == -1 ? LANG.finone : g_chr_specs[this._rppmSpecModList[L]["spec"]]) + "</a></label>").append("<br />");
                        var H = this;
                        $("#rppm-" + L).change(function() {
                            $WH.g_tooltipRPPMChange.call(this, H)
                        })
                    }
                } else {
                    var t = this._rppmModBase;
                    var w = this._rppmSpecModList;
                    p = p.replace(/<!--rppm-->(\[?)(\d+(?:\.\d+)?)([^<]*)<!--rppm-->/, function(P, S, R, Q) {
                        return "<!--rppm-->" + S + (t * (1 + parseFloat(w[$('input[name="rppmmod"]:checked', j).attr("id").match(/\d+$/)[0]].modifiervalue))).toFixed(2) + Q + "<!--rppm-->"
                    })
                }
            }
            j.toggle(!(j.is(":empty")));
            var v = "";
            if (this._rppmModList.hasOwnProperty(1)) {
                v += " + " + LANG.traits.hastertng[2]
            } else {
                if (this._rppmModList.hasOwnProperty(2)) {
                    v += " + " + LANG.traits.critstrkrtng[2]
                }
            }
            if (g_pageInfo.type == 6 && this._rppmModList.hasOwnProperty(6)) {
                v += " + Budget"
            }
            if (v.length > 0) {
                p = p.replace(/<!--rppm-->\[?(\d+(?:\.\d+)?)([^<]*)<!--rppm-->/, function(P, R, Q) {
                    return "<!--rppm-->[" + R + v + "]" + Q + "<!--rppm-->"
                })
            }
        }
    }
    if (u) {
        for (L = 1; L <= G; ++L) {
            $(u).append('<input type="checkbox" id="item-upgrade-' + L + '" />').append('<label for="item-upgrade-' + L + '"><a>' + $WH.sprintf(LANG.itemupgrade_format, L) + "</a></label>").append("<br />");
            $("#item-upgrade-" + L).change($WH.g_upgradeItemTooltip.bind(this, u, L))
        }
        if (s[E] && s[E].hasOwnProperty("tooltip_" + Locale.getName() + "_pvp")) {
            $(u).append('<input type="checkbox" id="item-upgrade-pvp" />').append('<label for="item-upgrade-pvp"><a>' + LANG.su_menu_pvpmode + "</a></label>").append("<br />");
            $("#item-upgrade-pvp").change($WH.g_upgradeItemTooltip.bind(this, u, "pvp"))
        }
        if (s[E] && s[E].hasOwnProperty("tooltip_" + Locale.getName() + "_chal")) {
            $(u).append('<input type="checkbox" id="item-upgrade-chal" />').append('<label for="item-upgrade-chal"><a>' + LANG.su_menu_challengemode + "</a></label>").append("<br />");
            $("#item-upgrade-chal").change($WH.g_upgradeItemTooltip.bind(this, u, "chal")).next().mouseover(function(P) {
                $WH.Tooltip.showAtCursor(P, LANG.challengemodescaling_tip)
            }).mousemove($WH.Tooltip.cursorUpdate).mouseout($WH.Tooltip.hide)
        }
        if (s[E] && s[E].hasOwnProperty("tooltip_" + Locale.getName() + "_twtbc")) {
            $(u).append('<input type="checkbox" id="item-upgrade-twtbc" />').append('<label for="item-upgrade-twtbc"><a>' + g_difficulty_names[24] + " " + LANG.su_note_bc + "</a></label>").append("<br />");
            $("#item-upgrade-twtbc").change($WH.g_upgradeItemTooltip.bind(this, u, "twtbc"))
        }
        if (s[E] && s[E].hasOwnProperty("tooltip_" + Locale.getName() + "_twwotlk")) {
            $(u).append('<input type="checkbox" id="item-upgrade-twwotlk" />').append('<label for="item-upgrade-twwotlk"><a>' + g_difficulty_names[24] + " " + LANG.su_note_wotlk + "</a></label>").append("<br />");
            $("#item-upgrade-twwotlk").change($WH.g_upgradeItemTooltip.bind(this, u, "twwotlk"))
        }
        $(u).toggle(!$(u).is(":empty"))
    }
    if (l == 3) {
        var D = $("#cs" + E);
        if (D && $WH.g_classSpecBtnShouldShow(p)) {
            if (!this._classSpecBtn) {
                var C = $WH.ce("label");
                C.innerHTML = LANG.tooltip_showingtooltipfor + " ";
                this._classSpecBtn = $WH.ce("a");
                this._classSpecBtn.ttId = E;
                $WH.g_classSpecBtnBuildMenu.call(this);
                Menu.add(this._classSpecBtn, this._classSpecBtn.menu);
                D.append(C).append(this._classSpecBtn).show()
            }
            var y = $WH.localStorage.get("tooltips_class:spec");
            y = y ? y.split(":") : null;
            if (y && y.length == 2) {
                p = $WH.g_classSpecBtnOnChange.call(this, y[0], y[1], p)
            } else {
                $(this._classSpecBtn).text(LANG.tooltip_chooseaspec)
            }
        }
    }
    if (s[E] && $WH.g_bonusesBtnShouldShow(s[E].bonusesData)) {
        var b = $("#bs" + E);
        if (b && !this._bonusesBtn) {
            var J = $WH.ce("label");
            J.innerHTML = LANG.tooltip_itembonuses + ": ";
            this._bonusesBtn = $WH.ce("a");
            this._bonusesBtn.ttId = E;
            $WH.g_bonusesBtnBuildMenu.call(this, s[E]);
            Menu.add(this._bonusesBtn, this._bonusesBtn.menu);
            $(this._bonusesBtn).text(LANG.selectbonus);
            b.append(J).append(this._bonusesBtn).show();
            if (A !== "") {
                $WH.g_bonusesBtnOnChange.call(this, A, true)
            }
        }
    }
    return p
};
$WH.g_evalPlayerCondition = function(g, j) {
    switch (j.id) {
        case 34116:
            j.achievementLogic = 6;
            j.achievement_2 = 6566;
            break;
        case 34647:
        case 34645:
            j.achievementLogic = 65536;
            j.achievement_0 = 6566;
            break;
        case 34648:
            j.achievementLogic = 65537;
            j.achievement_1 = 6566;
            break;
        case 33788:
        case 33790:
            j.prevquest1 = 38445;
            j.prevquest2 = 37935;
            break;
        default:
            break
    }
    if (j.minLevel && g.level < j.minLevel) {
        return false
    }
    if (j.maxLevel && g.level > j.maxLevel) {
        return false
    }
    if (j.raceMask && !((1 << (g.race - 1)) & j.raceMask)) {
        return false
    }
    if (j.classMask && !((1 << (g["class"] - 1)) & j.classMask)) {
        return false
    }
    if (typeof j.gender != "undefined" && j.gender != -1 && g.gender != j.gender) {
        return false
    }
    if (j.minAvgItemLevel && g.items && j.minAvgItemLevel > g.items.averageItemLevel) {
        return false
    }
    if (j.maxAvgItemLevel && g.items && j.maxAvgItemLevel < g.items.averageItemLevel) {
        return false
    }
    if (j.minAvgEquippedItemLevel && g.items && j.minAvgEquippedItemLevel > g.items.averageItemLevelEquipped) {
        return false
    }
    if (j.maxAvgEquippedItemLevel && g.items && j.maxAvgEquippedItemLevel > g.items.averageItemLevelEquipped) {
        return false
    }
    if (j.skillID_0 && g.professions) {
        var b = {};
        for (var a in g.professions.primary) {
            b[g.professions.primary[a].id] = parseInt(g.professions.primary[a].rank)
        }
        for (var a in g.professions.secondary) {
            b[g.professions.secondary[a].id] = parseInt(g.professions.secondary[a].rank)
        }
        if (!$WH.g_evalComplexCondition(j.skillLogic, function(c) {
                return b[j["skillID_" + c]] && (!j["minSkill_" + c] || b[j["skillID_" + c]] >= j["minSkill_" + c]) && (!j["maxSkill_" + c] || b[j["skillID_" + c]] <= j["maxSkill_" + c])
            })) {
            return false
        }
    }
    if (j.time_0 && j.time_1) {
        var h = $WH.g_decodeBlizzDate(j.time_0);
        var f = $WH.g_decodeBlizzDate(j.time_1);
        if (j.id == 34518) {
            h = new Date(h.getTime() - 24 * 3600 * 1000);
            f = new Date(h.getTime() - 24 * 3600 * 1000)
        }
        if (g_serverTime < h || g_serverTime > f) {
            return false
        }
    }
    if (j.worldStateExpressionID && $WH.g_worldStateExpressionToEvent[j.worldStateExpressionID]) {
        if (!$WH.isset("g_events")) {
            return false
        }
        var d = g_events[$WH.g_worldStateExpressionToEvent[j.worldStateExpressionID]];
        if (!d) {
            return false
        }
        var e = $WH.g_getEventNextDates(d);
        if (!e[0] || !e[1] || g_serverTime < e[0] || g_serverTime > e[1]) {
            return false
        }
    }
    if (j.prevquest0 && g.quests) {
        if (!$WH.g_evalComplexCondition(j.prevquestlogic, function(c) {
                return $WH.in_array(g.quests, j["prevquest" + c]) != -1
            })) {
            return 0
        }
    }
    if (j.achievement_0 && g.achievements) {
        if (!$WH.g_evalComplexCondition(j.achievementLogic, function(c) {
                return $WH.in_array(g.achievements.achievementsCompleted, j["achievement_" + c]) != -1
            })) {
            return 0
        }
    }
    return true
};
$WH.g_worldStateExpressionToEvent = {
    1368: 141,
    2941: 321,
    3555: 341,
    4546: 372,
    6572: 404,
    11286: 479,
    17483: 559,
    17484: 562,
    17485: 561,
    17486: 563,
    17499: 560,
    17500: 564,
    17503: 565,
    17567: 566
};
$WH.g_evalComplexCondition = function(b, j) {
    var d = (b >> 16) & 15;
    var a = (b >> 0) & 255;
    var h = j(0);
    h = (d & 1) ? !h : h;
    var e = 0;
    opLoop: while (e < 3) {
        var g = j(e + 1);
        var c = (d >> (e + 1)) & 1;
        g = c ? !g : g;
        var f = (a >> (e * 2)) & 3;
        switch (f) {
            case 0:
                break opLoop;
            case 1:
                h = h && g;
                break;
            case 2:
                h = h || g;
                break
        }++e
    }
    return h
};
$WH.g_decodeBlizzDate = function(b) {
    var e = new Date();
    var d = b & 63;
    var l = (b >> 6) & 31;
    var j = (b >> 20) & 15;
    var k = (b >> 14) & 63;
    var f = (b >> 24) & 31;
    e.setMinutes(d == 63 ? 0 : d, 0, 0);
    e.setHours(l == 31 ? 0 : l);
    e.setFullYear(1900 + (f == 31 ? 0 : (f + 100)), j == 15 ? 0 : j, k == 63 ? 1 : (k + 1));
    var a = e.getTime();
    var h = 7 * 24 * 3600 * 1000;
    var c = 0;
    if (h > 0) {
        c = Math.ceil((g_serverTime.getTime() - a) / h) * h
    }
    var g = new Date();
    g.setTime(a + c);
    return g
};
$WH.g_getEventNextDates = function(a, n) {
    if (n == null) {
        n = g_serverTime
    }
    var l = new Date();
    var c = new Date();
    if (a.dates[0] == "" && a.startDate) {
        a.dates[0] = a.startDate
    }
    var j = a.duration0 ? a.duration0 : 0;
    var k = a.duration1 ? a.duration1 : 0;
    var o = a.filtertype ? a.filtertype : 0;
    if (a.dates[0] && a.dates[0] != "") {
        if (a.dates[1] != "") {
            for (var h = 0; h < a.dates.length; ++h) {
                var b = new Date(a.dates[h]).getTime();
                var f;
                if (k) {
                    b += j * 3600 * 1000;
                    f = b + k * 3600 * 1000
                } else {
                    f = b + j * 3600 * 1000
                }
                if (n.getTime() < f || (h == a.dates.length - 1) || (!a.dates[h + 1])) {
                    l.setTime(b);
                    c.setTime(f);
                    break
                }
            }
        } else {
            if (o == -1) {
                var b = new Date(a.dates[0]);
                for (var h = 0; h < 2; ++h) {
                    var g = new Date(n.getFullYear() + h, b.getMonth(), b.getDate(), b.getHours(), b.getMinutes(), b.getSeconds()).getTime();
                    var d;
                    if (k) {
                        g += j * 3600 * 1000;
                        d = g + k * 3600 * 1000
                    } else {
                        d = g + j * 3600 * 1000
                    }
                    if (n.getTime() < d) {
                        l.setTime(g);
                        c.setTime(d);
                        break
                    }
                }
            } else {
                var b = new Date(a.dates[0]).getTime();
                if (a.id == 301) {
                    b -= 24 * 3600 * 1000
                }
                var f = b + j * 3600 * 1000;
                var m = 0;
                if (k > 0) {
                    m = k * 3600 * 1000
                } else {
                    switch (o) {
                        case 0:
                            m = 7 * 24 * 3600 * 1000;
                            break;
                        default:
                            break
                    }
                }
                var e = 0;
                if (m > 0) {
                    e = Math.ceil((n.getTime() - f) / m) * m
                }
                l.setTime(b + e);
                c.setTime(f + e)
            }
        }
    }
    return [l, c]
};
$WH.g_groupSizeScalingShouldShow = function(c) {
    if ($WH.isset("g_difficulties") && $WH.isset("g_spells") && g_spells[c] && g_spells[c].effects && g_spells[c].effects.length > 0) {
        for (var b = 0; b < g_spells[c].effects.length; ++b) {
            for (var a in g_spells[c].effects[b]) {
                if (g_spells[c].effects[b].hasOwnProperty(a)) {
                    return a
                }
            }
        }
    }
    return false
};
$WH.g_groupSizeScalingSliderMove = function(c, b, a) {
    $WH.g_groupSizeScalingOnChange.call(this, this, a.value, 0);
    if (this.bufftip) {
        $WH.g_groupSizeScalingOnChange.call(this, this.bufftip, a.value, 1)
    }
    $WH.Tooltip.hide()
};
$WH.g_groupSizeScalingOnChange = function(l, g, s, q) {
    while (l.className.indexOf("tooltip") == -1) {
        l = l.parentNode
    }
    g = parseInt(g);
    if (isNaN(g)) {
        return
    }
    var a = $WH.g_getDataSource();
    var f = $WH.isset("g_pageInfo") ? g_pageInfo.typeId : null;
    if (a[f] && a[f].effects && a[f].effects.length > 0) {
        var j = a[f][(s ? "buff_" : "tooltip_") + Locale.getName()];
        var d = this._difficultyBtn.selectedDD;
        this._difficultyBtn.selectedPlayers = g;
        var b = {
            effects: {}
        };
        var c = false;
        for (var o = 0; o < a[f].effects.length; ++o) {
            var t = a[f].effects[o][d] ? a[f].effects[o][d] : (a[f].effects[o][14] ? a[f].effects[o][14] : (a[f].effects[o][1] ? a[f].effects[o][1] : null));
            if (t) {
                c = true;
                var u = b.effects[o + 1] = {};
                var n = t.basepoints + (t.randompoints != 0 ? 1 : 0);
                var p = t.basepoints + t.randompoints;
                var k = g_difficulties[d];
                var r = k.minplayers;
                var e = k.maxplayers;
                if (r < e && g > r && t.groupmod > 1) {
                    if (e < g) {
                        g = e
                    }
                    var h = (g - r) / (e - r);
                    var m = t.groupmod - 1;
                    n += n * m * h;
                    p += p * m * h
                }
                u.avg = Math.round((n + p) / 2);
                u.min = Math.round(n);
                u.max = Math.round(p)
            }
        }
        if (c) {
            j = $WH.g_adjustSpellPoints(j, b);
            if (q) {
                return j
            }
            $WH.updateTooltip.call(l, j)
        }
    }
};
$WH.g_difficultyBtnBuildMenu = function(g) {
    var e = [];
    var a = g_spells[g];
    var f = {};
    for (var d = 0; d < a.effects.length; ++d) {
        for (var b in a.effects[d]) {
            var c = [b, g_difficulty_names[b], $WH.g_difficultyBtnOnChange.bind(this, b)];
            if (a.effects[d].hasOwnProperty(b) && !f[b]) {
                e.push(c);
                f[b] = true
            }
        }
    }
    this._difficultyBtn.menu = e
};
$WH.g_difficultyBtnOnChange = function(b) {
    this._difficultyBtn.selectedDD = b;
    $(this._difficultyBtn).text("");
    $WH.array_walk(this._difficultyBtn.menu, function(h) {
        h.checked = false
    });
    var g = Menu.findItem(this._difficultyBtn.menu, [b]);
    g.checked = true;
    $(this._difficultyBtn).text(g[MENU_IDX_NAME]);
    var d = this._difficultyBtn.selectedPlayers;
    var e = g_difficulties[b].minplayers,
        a = g_difficulties[b].maxplayers,
        c = g_difficulties[b].maxplayers;
    if (d) {
        if (d > a) {
            c = a
        } else {
            if (d < e) {
                c = e
            } else {
                c = d
            }
        }
    }
    var f = $("#sl" + this._difficultyBtn.ttId);
    f.html("").hide();
    this.slider = null;
    if (e != a) {
        f.show();
        this.slider = Slider.init(f.get(0), {
            minValue: parseInt(e),
            maxValue: parseInt(a),
            onMove: $WH.g_groupSizeScalingSliderMove.bind(this)
        });
        Slider.setValue(this.slider, parseInt(c));
        this.slider.onmouseover = function(h) {
            $WH.Tooltip.showAtCursor(h, LANG.tooltip_changeplayers2, 0, 0, "q2")
        };
        this.slider.onmousemove = $WH.Tooltip.cursorUpdate;
        this.slider.onmouseout = $WH.Tooltip.hide;
        this.slider.input.onmouseover = function(h) {
            $WH.Tooltip.showAtCursor(h, LANG.tooltip_changeplayers, 0, 0, "q2")
        };
        this.slider.input.onmousemove = $WH.Tooltip.cursorUpdate;
        this.slider.input.onmouseout = $WH.Tooltip.hide
    }
    $WH.g_groupSizeScalingSliderMove.call(this, null, null, {
        value: c
    })
};
$WH.g_classSpecBtnShouldShow = function(a) {
    var c = /<span[^>]*?><!--stat(\d+)-->([-+]\d+(?:-\d+)?\D*?)<\/span>/gi;
    var b = c.exec(a);
    while (b != null) {
        if (g_grayedOutStats.hasOwnProperty(b[1]) || ($WH.in_array(g_specDependantStats, b[1]) != -1)) {
            return true
        }
        b = c.exec(a)
    }
    return false
};
$WH.g_classSpecBtnOnChange = function(g, d, a) {
    g = parseInt(g);
    d = parseInt(d);
    $(this._classSpecBtn).html("");
    var h = $("<span></span>");
    h.text($WH.sprintf(" $1 $2", g_chr_specs[d], g_chr_classes[g]));
    var c = Menu.findItem(this._classSpecBtn.menu, [g, d]);
    if (c && c[MENU_IDX_OPT] && c[MENU_IDX_OPT].tinyIcon) {
        var b = c[MENU_IDX_OPT].tinyIcon;
        var e = Icon.create(b, 0, null, "javascript:;");
        e.style.display = "inline-block";
        e.style.verticalAlign = "middle";
        $(this._classSpecBtn).append(e)
    }
    $(this._classSpecBtn).append(h);
    $WH.localStorage.set("tooltips_class:spec", g + ":" + d);
    var f = a ? a : this.innerHTML;
    f = f.replace(/<span[^>]*?><!--stat(\d+)-->([-+]\d+(?:-\d+)?)(\D*?)<\/span>/gi, function(n, k, p, j) {
        var m = k == 50 ? ' class="q2"' : "";
        if (g_grayedOutStats[k] && (g_grayedOutStats[k].indexOf(d) != -1)) {
            m = ' style="color:gray"'
        }
        if ($WH.in_array(g_specDependantStats, k) != -1) {
            var o = $WH.g_getRealStatIdForSpec(k, g_specPrimaryStatOrders[d], g_specPrimaryStatOrders[d].length);
            var l = $WH.g_statToJson[o];
            if (l && LANG.traits[l]) {
                j = " " + LANG.traits[l][1]
            }
        }
        return "<span" + m + "><!--stat" + k + "-->" + p + j + "</span>"
    });
    f = f.replace(/<!--scstart(\d+):(\d+)--><span class="q(\d+)">(<!--asc\d+-->)?(.*?)<\/span><!--scend-->/i, function(p, m, n, l, o, k) {
        l = 1;
        var q = m == 2 && (!g_classes_allowed_weapon[g] || $WH.in_array(g_classes_allowed_weapon[g], n) == -1);
        var j = m == 4 && (!g_classes_allowed_armor[g] || $WH.in_array(g_classes_allowed_armor[g], n) == -1);
        if (q || j) {
            l = 10
        }
        return "<!--scstart" + m + ":" + n + '--><span class="q' + l + '">' + (o ? o : "") + k + "</span><!--scend-->"
    });
    if (a) {
        return f
    } else {
        this.innerHTML = f
    }
};
$WH.g_classSpecBtnBuildMenu = function() {
    var a = [
        [, LANG.tooltip_chooseaspec]
    ];
    var n = Menu.findItem(mn_spells, [-14]);
    a = a.concat($.extend(true, [], n[MENU_IDX_SUB]));
    for (var g in g_chr_specs_by_class) {
        var d = g_chr_specs_by_class[g];
        var h = null;
        for (var m in a) {
            var k = a[m];
            if (k[MENU_IDX_ID] == g) {
                if (k[MENU_IDX_URL]) {
                    k[MENU_IDX_URL] = null
                }
                h = m;
                break
            }
        }
        if (h == null) {
            continue
        }
        for (var f in d) {
            var e = a[h][MENU_IDX_SUB];
            for (var c in e) {
                var b = e[c];
                if (b[MENU_IDX_ID] == d[f]) {
                    b[MENU_IDX_URL] = $WH.g_classSpecBtnOnChange.bind(this, g, d[f], false);
                    break
                }
            }
        }
    }
    this._classSpecBtn.menu = a
};
$WH.g_getClassFromSpec = function(d) {
    for (var c in g_chr_specs_by_class) {
        if (!g_chr_specs_by_class.hasOwnProperty(c)) {
            continue
        }
        for (var b = 0, a; a = g_chr_specs_by_class[c][b]; b++) {
            if (a == d) {
                return c
            }
        }
    }
    return null
};
$WH.g_getRealStatIdForSpec = function(a, c, b) {
    var d;
    var e;
    if (a == 71) {
        e = 0;
        if (!b) {
            return 5
        }
        while (1) {
            d = c[e];
            if (d >= 3) {
                if (d <= 5) {
                    break
                }
            }++e;
            if (e >= b) {
                return 5
            }
        }
    } else {
        if (a != 72) {
            if (a != 73) {
                if (a != 74) {
                    return a
                }
                e = 0;
                if (b) {
                    while (1) {
                        d = c[e];
                        if (d >= 4) {
                            if (d <= 5) {
                                break
                            }
                        }++e;
                        if (e >= b) {
                            return 5
                        }
                    }
                    return d
                }
                return 5
            }
            e = 0;
            if (b) {
                while (1) {
                    d = c[e];
                    if (c[e] == 3) {
                        break
                    }
                    if (c[e] == 5) {
                        break
                    }++e;
                    if (e >= b) {
                        return 5
                    }
                }
                return d
            }
            return 5
        }
        e = 0;
        if (!b) {
            return 3
        }
        while (1) {
            d = c[e];
            if (d >= 3) {
                if (d <= 4) {
                    break
                }
            }++e;
            if (e >= b) {
                return 3
            }
        }
    }
    return d
};
$WH.g_bonusesBtnShouldShow = function(b) {
    for (var a in b) {
        if (b.hasOwnProperty(a)) {
            return true
        }
    }
    return false
};
$WH.g_bonusesBtnBuildMenu = function(e) {
    var a = [
        [, LANG.selectbonus]
    ];
    var n = e.bonusesData;
    if (n && $WH.isset("g_itembonuses")) {
        var k = [];
        for (var j in n) {
            var m = n[j].groupedUpgrade;
            var l = [j, $WH.g_getItemBonusName.call(this, j, e), $WH.g_bonusesBtnOnChange.bind(this, (m ? "u:" : "") + j, false)];
            if (typeof m == "undefined") {
                for (var d in n[j].sub) {
                    m = n[j].sub[d].groupedUpgrade;
                    var c = [d, $WH.g_getItemBonusName.call(this, d, e), $WH.g_bonusesBtnOnChange.bind(this, j + ":" + (m ? "u:" : "") + d, false, true)];
                    if (!l[MENU_IDX_SUB]) {
                        l[MENU_IDX_SUB] = []
                    }
                    l[MENU_IDX_SUB].push(c)
                }
            }
            if (l[MENU_IDX_SUB] && $WH.isset("g_itembonuses")) {
                l[MENU_IDX_SUB].sort(function(p, o) {
                    var r = $WH.g_getItemBonusChanceType(p[MENU_IDX_ID]);
                    var q = $WH.g_getItemBonusChanceType(o[MENU_IDX_ID]);
                    return $WH.strcmp(r, q) || $WH.strcmp(p[MENU_IDX_NAME], o[MENU_IDX_NAME])
                });
                var h = [];
                var b = 0;
                for (var f = 0; f < l[MENU_IDX_SUB].length; ++f) {
                    var d = l[MENU_IDX_SUB][f][MENU_IDX_ID];
                    if (d && n[j].sub[d].type != b) {
                        b = n[j].sub[d].type;
                        var g = LANG.unknown;
                        switch (b) {
                            case 1:
                                g = LANG.upgrades;
                                break;
                            case 2:
                                g = LANG.su_note_stats;
                                break;
                            case 4:
                                g = LANG.sockets;
                                break;
                            default:
                                break
                        }
                        h.push([f, [, g]])
                    }
                }
                for (var f = 0; f < h.length; ++f) {
                    l[MENU_IDX_SUB].splice(h[f][0] + f, 0, h[f][1])
                }
            }
            k.push(l)
        }
        k.sort(function(q, o) {
            var r = q[1].innerText ? q[1].innerText : q[1];
            var p = o[1].innerText ? o[1].innerText : o[1];
            return $WH.strcmp(r, p)
        });
        a = a.concat(k)
    }
    this._bonusesBtn.menu = a
};
$WH.g_getItemBonusChanceType = function(f) {
    var e = 0;
    if (f > 0 && $WH.isset("g_itembonuses") && g_itembonuses && g_itembonuses[f]) {
        var a = g_itembonuses[f];
        for (var c = 0; c < a.length; ++c) {
            var b = a[c];
            var d = 0;
            switch (b[0]) {
                case 1:
                case 3:
                case 4:
                case 5:
                case 11:
                    d = 1;
                    break;
                case 2:
                    d = 2;
                    break;
                case 6:
                    d = 4;
                    break;
                default:
                    break
            }
            if (d && (!e || d < e)) {
                e = d
            }
        }
    }
    return e
};
$WH.g_getItemBonusUpgradeType = function(d) {
    if (d > 0 && $WH.isset("g_itembonuses") && g_itembonuses && g_itembonuses[d]) {
        var a = g_itembonuses[d];
        for (var c = 0; c < a.length; ++c) {
            var b = a[c];
            switch (b[0]) {
                case 3:
                case 4:
                case 5:
                case 11:
                    return 1 << b[0];
                default:
                    break
            }
        }
    }
    return 0
};
$WH.g_getItemBonusName = function(d, c) {
    var a = "";
    if ($WH.isset("g_itembonuses") && d > 0 && g_itembonuses[d]) {
        for (var b = 0; b < g_itembonuses[d].length; ++b) {
            var e = g_itembonuses[d][b];
            switch (e[0]) {
                case 1:
                    a += (a ? " / " : "") + LANG.itemlevel + " " + (c.level + e[1]);
                    break;
                case 2:
                    a += (a ? " / " : "") + (($WH.g_statToJson[e[1]] && LANG.traits[$WH.g_statToJson[e[1]]]) ? LANG.traits[$WH.g_statToJson[e[1]]][1] : "Unknown stat");
                    break;
                case 3:
                    a += (a ? " / " : "") + g_item_qualities[e[1]];
                    break;
                case 4:
                case 5:
                    if ($WH.isset("g_item_namedescriptions") && g_item_namedescriptions[e[1]]) {
                        a = g_item_namedescriptions[e[1]][0]
                    }
                    break;
                case 6:
                    a += (a ? " / " : "") + e[1] + " " + g_socket_names[e[2]];
                    break;
                case 8:
                    a += (a ? " / " : "") + $WH.sprintf(LANG.tooltip_reqlevel_format.replace("%s", "$1"), c.reqlevel + e[1]);
                    break;
                case 11:
                    if (c.heirloombonuses) {
                        a += (a ? " / " : "") + $WH.sprintf(LANG.heirloomupgrade_format, (parseInt(d) == c.heirloombonuses[0]) ? 1 : 2)
                    }
                    break;
                default:
                    break
            }
        }
    } else {
        if (d == "0") {
            a = LANG.normal
        }
    }
    return a ? a : "???"
};
$WH.g_bonusesBtnGetContextBonusId = function(c) {
    var a = 0;
    if (c && c.length) {
        for (var b = 0; b < c.length; ++b) {
            if ($WH.isset("g_itembonuses") && g_itembonuses["-1"].indexOf(parseInt(c[b])) != -1) {
                a = c[b];
                break
            }
        }
    }
    return a
};
$WH.g_bonusesBtnIsComboValid = function(j, c, g) {
    if (!j[c] || !j[c].sub) {
        return false
    }
    var e = j[c].sub;
    var f = 32768;
    var d = 32768;
    for (var a in g) {
        var h = g[a];
        if (h != c) {
            if (e[h]) {
                if ((f & e[h].type) == 1) {} else {
                    if (f & e[h].type) {
                        f = false;
                        break
                    } else {
                        f |= e[h].type
                    }
                }
                if (d & e[h].upgradeType) {
                    d = false;
                    break
                } else {
                    d |= e[h].upgradeType
                }
            } else {
                f = false;
                break
            }
        }
    }
    return f && d
};
$WH.g_bonusesBtnOnChange = function(I, U, c) {
    var u = $WH.g_getDataSource();
    var D = this._bonusesBtn.ttId;
    var r = u[D].bonusesData;
    if (c === true) {
        var Q = I.split(":");
        var w = 0;
        var q = Q.indexOf("u");
        if (q != -1) {
            w = Q[q + 1];
            Q.splice(q, 1)
        }
        var h = Q[0];
        var t = !Menu.findItem(this._bonusesBtn.menu, Q).checked;
        var l = 0;
        var o = [];
        $WH.array_walk(this._bonusesBtn.menu, function(j) {
            if (j.checked) {
                l = j[MENU_IDX_ID];
                if (j[MENU_IDX_SUB]) {
                    $WH.array_walk(j[MENU_IDX_SUB], function(aa) {
                        if (aa[MENU_IDX_ID] && aa.checked) {
                            o.push(aa[MENU_IDX_ID]);
                            if (l == h && r[l].sub[aa[MENU_IDX_ID]].groupedUpgrade && !w) {
                                w = aa[MENU_IDX_ID]
                            }
                        }
                    })
                }
            }
        });
        var S;
        if (l == h) {
            if (t) {
                S = o.concat(Q)
            } else {
                o.splice(o.indexOf(Q[1]), 1);
                S = o.concat([h])
            }
        } else {
            S = Q
        }
        S.sort(function(aa, j) {
            return aa - j
        });
        if (!$WH.g_bonusesBtnIsComboValid(r, h, S)) {
            S = Q;
            var z = r[h].sub[Q[1]].type;
            var F = r[h].sub[Q[1]].upgradeType;
            for (var V = 0; V < o.length; ++V) {
                if (z != r[h].sub[o[V]].type) {
                    S.push(o[V])
                } else {
                    if (F != r[h].sub[o[V]].upgradeType) {
                        S.push(o[V])
                    }
                }
            }
            S.sort(function(aa, j) {
                return aa - j
            })
        }
        if (w) {
            var y = S.indexOf(w);
            if (y != -1) {
                S.splice(S.indexOf(w), 0, "u")
            }
        }
        I = S.join(":").replace(/^0:/, "")
    }
    this._bonusesBtn.selectedBonus = I;
    var E = this._bonusesBtn.selectedBonus.split(":");
    var q = E.indexOf("u");
    if (q != -1) {
        E.splice(q, 1)
    }
    $(this._bonusesBtn).html("");
    var K = $WH.g_bonusesBtnGetContextBonusId(E);
    $WH.array_walk(this._bonusesBtn.menu, function(j) {
        j.checked = j[MENU_IDX_ID] == K;
        if (j[MENU_IDX_SUB]) {
            $WH.array_walk(j[MENU_IDX_SUB], function(aa) {
                if (aa[MENU_IDX_ID]) {
                    aa.checked = j.checked && E.indexOf(aa[MENU_IDX_ID]) != -1;
                    if (aa.$a) {
                        aa[MENU_IDX_OPT] = null;
                        Menu.updateItem(aa)
                    }
                }
            })
        }
    });
    var Y = Menu.findItem(this._bonusesBtn.menu, [K]);
    if (Y && Y[MENU_IDX_SUB]) {
        $WH.array_walk(Y[MENU_IDX_SUB], function(aa) {
            if (aa[MENU_IDX_ID]) {
                var j = E;
                if (E.indexOf(aa[MENU_IDX_ID]) == -1) {
                    j = j.concat([aa[MENU_IDX_ID]])
                }
                j.sort(function(ac, ab) {
                    return ac - ab
                });
                if (!$WH.g_bonusesBtnIsComboValid(r, K, j)) {
                    aa[MENU_IDX_OPT] = {
                        "class": "q0"
                    }
                } else {
                    aa[MENU_IDX_OPT] = {}
                }
                Menu.updateItem(aa)
            }
        })
    }
    var G = $WH.g_getItemBonusName.call(this, K, u[D]);
    for (var V = 0; V < E.length; ++V) {
        if (E[V] != K) {
            G += " + " + $WH.g_getItemBonusName.call(this, E[V], u[D])
        }
    }
    $(this._bonusesBtn).append(G);
    var p = 0;
    if ($WH.isset("g_itembonuses") && g_items && g_items[D]) {
        for (var V in E) {
            var n = E[V];
            if (g_itembonuses[n]) {
                for (var T = 0; T < g_itembonuses[n].length; ++T) {
                    var v = g_itembonuses[n][T];
                    if (v[0] == 7 && g_items[D].appearances && g_items[D].appearances[v[1]]) {
                        p = g_items[D].appearances[v[1]][0];
                        break
                    }
                }
            }
        }
    }
    var a = $("#d1c4b6d5a978ecb63b47c2e6a45e3389");
    if (a.length > 0) {
        var e = "/upgrade?items=0;" + D;
        if (E.length > 0) {
            e += Array(10).join(".0") + "." + E.join(".")
        }
        a.get(0).href = e
    }
    var k = $("#e8c7e052e3e0");
    if (k.length > 0) {
        var M = k.get(0).attributes.onclick.value;
        var P = new RegExp("\\(this, " + D + ", \\[[^\\]]*?],");
        if (P.test(M)) {
            var m = [];
            for (var f in E) {
                var N = E[f];
                if (N == 0) {
                    m.push(N);
                    continue
                }
                var d = $WH.isset("g_itembonuses") && g_itembonuses[N] ? g_itembonuses[N] : [];
                for (var s in d) {
                    var Z = d[s][0];
                    var C = d[s][1];
                    if ($WH.in_array([1, 2, 6], Z) != -1) {
                        if (Z == 2 && $WH.in_array([61, 62, 63, 64, 66], C) != -1) {
                            continue
                        }
                        m.push(N)
                    }
                }
            }
            k.get(0).attributes.onclick.value = M.replace(P, "(this, " + D + ", [" + m.join(",") + "],")
        }
    }
    var X = $("#ic" + D);
    if (X.length > 0 && g_items) {
        var g = g_items.getIcon(D, E);
        if (g) {
            X[0].removeChild(X[0].firstChild);
            X[0].appendChild(Icon.create(g, 2))
        }
    }
    var b = $("#dsgndslgn464d");
    if (b.length > 0) {
        var L = b[0].attributes.onclick.value;
        if (!b[0]._defaultDisplayId) {
            var P = new RegExp("displayId: (\\d+),", "g");
            var B = P.exec(L);
            if (B) {
                b[0]._defaultDisplayId = B[1]
            }
        }
        if (!p && b[0]._defaultDisplayId) {
            p = b[0]._defaultDisplayId
        }
        if (p) {
            b[0].attributes.onclick.value = L.replace(/displayId: \d+/, "displayId: " + p)
        }
    }
    var H = $("#e8c6e055e3e0");
    if (H.length > 0) {
        var L = H[0].attributes.onclick.value;
        var W = "";
        if (E.length > 0) {
            var J = [];
            while (J.length < 9) {
                J.push(0)
            }
            for (var V = 0; V < E.length; ++V) {
                J.push(E[V])
            }
            W = "." + J.join(".")
        }
        H[0].attributes.onclick.value = L.replace(/su_addToSaved\("?(\d+)[.\w]*"?, 1\)/, 'su_addToSaved("$1' + W + '", 1)')
    }
    if (window.history) {
        var A = this._bonusesBtn.selectedBonus.replace(/u:/, "");
        if (location.pathname.indexOf("&bonus") != -1) {
            window.history.replaceState({}, "", location.pathname.replace(/&bonus=\d+(:\d+)*/, "&bonus=" + A) + location.hash)
        } else {
            if (!location.hash) {
                window.history.replaceState({}, "", location.pathname + "&bonus=" + A)
            } else {
                window.history.replaceState({}, "", location.pathname + "&bonus=" + A + location.hash)
            }
        }
    }
    $WH.updateItemStringLink.call(this);
    if (!U && u[D]["tooltip_" + Locale.getName()]) {
        var R = $WH.ge("sl" + D);
        R.innerHTML = "";
        this.slider = null;
        var O = $WH.g_enhanceTooltip.call(this, D, true, true, R, null, this._knownSpells, $WH.ge("ks" + D), this._selectedUpgrade, null, null, true, null, null, this._bonusesBtn.selectedBonus);
        $WH.updateTooltip.call(this, O)
    }
};
$WH.updateItemStringLink = function() {
    var b = $WH.g_getDataSource();
    var h = $WH.isset("g_pageInfo") ? g_pageInfo.typeId : null;
    if (b[h]) {
        var g = "0";
        var e = [];
        if (this._bonusesBtn && this._bonusesBtn.selectedBonus) {
            g = this._bonusesBtn.selectedBonus.replace(/u:/, "");
            e = g.split(":")
        }
        var d = (typeof this._selectedUpgrade == "number") ? this._selectedUpgrade : 0;
        var c = (b[h].upgradeData.length > 0) ? b[h].upgradeData[d].id : 0;
        var a = this._selectedLevel ? this._selectedLevel : 0;
        var f = c + ":0:" + e.length + ":" + g;
        $("#open-links-button").click(function() {
            this.blur();
            Links.show({
                type: 3,
                typeId: h,
                linkColor: "ff" + g_items.getItemQualityColor(b[h].quality),
                linkId: "item:" + h + ":0:0:0:0:0:0:0:" + a + ":0:" + f,
                linkName: b[h]["name_" + Locale.getName()],
                bonuses: e
            })
        })
    }
};
$WH.g_upgradeItemTooltip = function(d, g) {
    var c = $WH.g_getDataSource();
    var k = g_pageInfo.typeId;
    if (c[k]) {
        var e = $("#" + d.id + " > input");
        var a = null;
        if (typeof g != "number") {
            e.each(function(l, m) {
                if (m.id.indexOf(g) != -1) {
                    a = m;
                    return false
                }
            });
            if (a != null && g == "chal") {
                var j = c[k].level;
                e.each(function(l, m) {
                    if (m.id.indexOf("chal") == -1 && m.checked) {
                        j += (m.id.indexOf("pvp") != -1 ? c[k].pvpUpgrade : c[k].upgradeData[l + 1])
                    }
                });
                if (a.checked && j <= $WH.g_applyStatModifications.ITEM_CHALLENGEMODE_LEVEL) {
                    a.checked = false;
                    return
                }
            }
        } else {
            a = e.get(g - 1)
        }
        var h = a.checked;
        e.each(function(l, m) {
            m.checked = false
        });
        a.checked = h;
        if (!h) {
            g = null
        }
        this._selectedUpgrade = g;
        $WH.updateItemStringLink.call(this);
        if (c[k]["tooltip_" + Locale.getName()]) {
            var f = this._bonusesBtn && this._bonusesBtn.selectedBonus ? this._bonusesBtn.selectedBonus : null;
            var b = $WH.g_enhanceTooltip.call(this, k, true, true, false, null, this._knownSpells, $WH.ge("ks" + k), g, null, null, true, null, null, f);
            $WH.updateTooltip.call(this, b)
        }
    }
};
$WH.updateTooltip = function(a) {
    this.innerHTML = "<table><tr><td>" + a + '</td><th style="background-position: top right"></th></tr><tr><th style="background-position: bottom left"></th><th style="background-position: bottom right"></th></tr></table>';
    $WH.Tooltip.fixSafe(this, 1, 1)
};
$WH.g_staticTooltipLevelClick = function(b, a, j, l) {
    while (b.className.indexOf("tooltip") == -1) {
        b = b.parentNode
    }
    var k = b.innerHTML;
    k = k.match(/<!--i?\?(\d+):(\d+):(\d+):(\d+)/);
    if (!k) {
        return
    }
    var m = parseInt(k[1]),
        e = parseInt(k[2]),
        h = parseInt(k[3]),
        d = parseInt(k[4]);
    if (e >= h) {
        return
    }
    if (!a) {
        a = prompt($WH.sprintf(LANG.prompt_ratinglevel, e, h), d)
    }
    a = parseInt(a);
    if (isNaN(a)) {
        return
    }
    if (a == d || a < e || a > h) {
        return
    }
    b._selectedLevel = a;
    var c = $WH.g_getDataSource();
    k = ($WH.g_setTooltipLevel.bind(b, c[m][(l ? "buff_" : "tooltip_") + Locale.getName()], a, l))();
    var f = b._bonusesBtn && b._bonusesBtn.selectedBonus ? b._bonusesBtn.selectedBonus : null;
    var g = b._selectedUpgrade ? b._selectedUpgrade : 0;
    k = $WH.g_enhanceTooltip.call(b, k, true, null, null, null, null, null, g, null, null, null, null, null, f);
    $WH.updateTooltip.call(b, k);
    if (b.slider && !j) {
        Slider.setValue(b.slider, a)
    }
    if (!l) {
        ($WH.g_tooltipSpellsChange.bind(b))()
    }
};
$WH.g_tooltipSliderMove = function(c, b, a) {
    $WH.g_staticTooltipLevelClick(this, a.value, 1);
    if (this.bufftip) {
        $WH.g_staticTooltipLevelClick(this.bufftip, a.value, 1, 1)
    }
    $WH.Tooltip.hide()
};
$WH.g_tooltipSpellsChange = function() {
    if (!this.modified) {
        return
    }
    var c = this.modified[0],
        a = this.modified[1],
        b = [];
    $.each($("input:checked", c), function(d, e) {
        b.push(parseInt(e.id.replace("known-", "")))
    });
    this.modified[2] = b;
    this.innerHTML = $WH.g_setTooltipSpells(this.innerHTML, b, a);
    if (this.bufftip) {
        ($WH.g_tooltipSpellsChange.bind(this.bufftip))()
    }
};
$WH.g_tooltipRPPMChange = function(a) {
    var b = $(this).attr("id").match(/\d+$/)[0];
    a.innerHTML = a.innerHTML.replace(/<!--rppm-->(\[?)(\d+(?:\.\d+)?)([^<]*)<!--rppm-->/, function(c, f, e, d) {
        return "<!--rppm-->" + f + (a._rppmModBase * (1 + parseFloat(a._rppmSpecModList[b].modifiervalue))).toFixed(2) + d + "<!--rppm-->"
    })
};
$WH.g_validateBpet = function(k, b) {
    var g = 1,
        l = 25,
        j = 25,
        a = 0,
        d = 4,
        c = 3,
        h = (1 << 10) - 1,
        f = 3,
        e = $.extend({}, b);
    if (k.minlevel) {
        g = k.minlevel
    }
    if (k.maxlevel) {
        l = k.maxlevel
    }
    if (k.companion) {
        l = g
    }
    if (!e.level) {
        e.level = j
    }
    e.level = Math.min(Math.max(e.level, g), l);
    if (k.minquality) {
        a = k.minquality;
        if (k.untameable) {
            d = a
        }
    }
    if (k.maxquality) {
        d = k.maxquality
    }
    if (e.quality == null) {
        e.quality = c
    }
    e.quality = Math.min(Math.max(e.quality, a), d);
    if (k.companion) {
        delete(e.quality)
    }
    if (k.breeds > 0) {
        h = k.breeds & h
    }
    if (!(h & (1 << f - 3))) {
        f = Math.floor(3 + Math.log(h) / Math.LN2)
    }
    if (e.breed && e.breed >= 13) {
        e.breed -= 10
    }
    if (!e.breed || !(h & (1 << e.breed - 3))) {
        e.breed = f
    }
    return e
};
$WH.g_calcBattlePetStats = function(a, e, k, c, d) {
    if (!$WH.g_battlePetBreedStats[e]) {
        e = 3
    }
    var h = a.health;
    if (isNaN(h)) {
        h = 0
    }
    var b = a.power;
    if (isNaN(b)) {
        b = 0
    }
    var g = a.speed;
    if (isNaN(g)) {
        g = 0
    }
    if (isNaN(k)) {
        k = 1
    }
    k = Math.min(Math.max(0, k), 5);
    if (isNaN(c)) {
        c = 1
    }
    c = Math.min(Math.max(1, c), 25);
    var f = $WH.g_battlePetBreedStats[e];
    var j = 1 + (k / 10);
    h = ((h + f[0]) * 5 * c * j) + 100;
    b = (b + f[1]) * c * j;
    g = (g + f[2]) * c * j;
    if (d) {
        h = h * 5 / 6;
        b = b * 4 / 5
    }
    return {
        health: Math.round(h),
        power: Math.round(b),
        speed: Math.round(g)
    }
};
$WH.g_battlePetBreedStats = {
    3: [0.5, 0.5, 0.5],
    4: [0, 2, 0],
    5: [0, 0, 2],
    6: [2, 0, 0],
    7: [0.9, 0.9, 0],
    8: [0, 0.9, 0.9],
    9: [0.9, 0, 0.9],
    10: [0.4, 0.9, 0.4],
    11: [0.4, 0.4, 0.9],
    12: [0.9, 0.4, 0.4]
};
$WH.g_battlePetAbilityLevels = [1, 2, 4, 10, 15, 20];
$WH.g_getCharCustomizationVariations = function(n, t, z, y) {
    var I = [
        [],
        [],
        []
    ];
    if ($WH.isset("g_charCustomizations") && g_charCustomizations) {
        if (!$WH.g_charCustomizationsLookup) {
            $WH.g_charCustomizationsLookup = {};
            for (var A = 0; A < g_charCustomizations.length; ++A) {
                var s = g_charCustomizations[A];
                var f = s[0];
                var J = s[1];
                var g = s[2];
                var r = s[3];
                var G = s[4];
                var o = s[5];
                if (!$WH.g_charCustomizationsLookup[f]) {
                    $WH.g_charCustomizationsLookup[f] = {}
                }
                if (!$WH.g_charCustomizationsLookup[f][J]) {
                    $WH.g_charCustomizationsLookup[f][J] = {}
                }
                if (!$WH.g_charCustomizationsLookup[f][J][g]) {
                    $WH.g_charCustomizationsLookup[f][J][g] = {}
                }
                var H = (r & 4);
                var b = (r & 16);
                var w = H || b;
                if (!H) {
                    if (!$WH.g_charCustomizationsLookup[f][J][g]["1"]) {
                        $WH.g_charCustomizationsLookup[f][J][g]["1"] = [
                            [],
                            []
                        ]
                    }
                    if ($WH.in_array($WH.g_charCustomizationsLookup[f][J][g]["1"][0], G) == -1) {
                        $WH.g_charCustomizationsLookup[f][J][g]["1"][0].push(G)
                    }
                    if ($WH.in_array($WH.g_charCustomizationsLookup[f][J][g]["1"][1], o) == -1) {
                        $WH.g_charCustomizationsLookup[f][J][g]["1"][1].push(o)
                    }
                }
                if (w) {
                    if (!$WH.g_charCustomizationsLookup[f][J][g]["2"]) {
                        $WH.g_charCustomizationsLookup[f][J][g]["2"] = [
                            [],
                            []
                        ]
                    }
                    if ($WH.in_array($WH.g_charCustomizationsLookup[f][J][g]["2"][0], G) == -1) {
                        $WH.g_charCustomizationsLookup[f][J][g]["2"][0].push(G)
                    }
                    if ($WH.in_array($WH.g_charCustomizationsLookup[f][J][g]["2"][1], o) == -1) {
                        $WH.g_charCustomizationsLookup[f][J][g]["2"][1].push(o)
                    }
                }
            }
            if ($WH.isset("g_charFeatures") && g_charFeatures) {
                var c = {};
                for (var A = 0; A < g_charFeatures.length; ++A) {
                    var C = g_charFeatures[A];
                    var q = C[0];
                    var k = C[1];
                    var F = C[2];
                    if (!c[q]) {
                        c[q] = {}
                    }
                    if (!c[q][k]) {
                        c[q][k] = []
                    }
                    c[q][k].push(F)
                }
                for (var q in c) {
                    for (var k in c[q]) {
                        if ($WH.g_charCustomizationsLookup[q] && $WH.g_charCustomizationsLookup[q][k] && !$WH.g_charCustomizationsLookup[q][k][7]) {
                            c[q][k].sort();
                            $WH.g_charCustomizationsLookup[q][k][7] = {
                                "1": [c[q][k],
                                    []
                                ],
                                "2": [c[q][k],
                                    []
                                ]
                            };
                            $WH.g_charCustomizationsLookup[q][k][2] = {
                                "1": [c[q][k],
                                    []
                                ],
                                "2": [c[q][k],
                                    []
                                ]
                            }
                        }
                    }
                }
            }
            if ($WH.isset("g_barberStyleNames") && g_barberStyleNames) {
                $WH.g_barberStyleNamesLookup = {};
                for (var A = 0; A < g_barberStyleNames.length; ++A) {
                    var e = g_barberStyleNames[A];
                    var v = e[0];
                    var u = e[1];
                    var E = e[2];
                    var j = e[3];
                    var m = e[4];
                    if (!$WH.g_barberStyleNamesLookup[u]) {
                        $WH.g_barberStyleNamesLookup[u] = {}
                    }
                    if (!$WH.g_barberStyleNamesLookup[u][E]) {
                        $WH.g_barberStyleNamesLookup[u][E] = {}
                    }
                    if (!$WH.g_barberStyleNamesLookup[u][E][v]) {
                        $WH.g_barberStyleNamesLookup[u][E][v] = {}
                    }
                    $WH.g_barberStyleNamesLookup[u][E][v][j] = m
                }
            }
        }
        var p = z == 6 ? "2" : "1";
        var B = [t, t == 1 ? 0 : 1];
        charAppearanceLoops: for (var h in B) {
            var a = B[h];
            if ($WH.g_charCustomizationsLookup[n] && $WH.g_charCustomizationsLookup[n][a]) {
                for (var d in y) {
                    var l = y[d];
                    if ($WH.g_charCustomizationsLookup[n][a][l] && $WH.g_charCustomizationsLookup[n][a][l][p]) {
                        I = $WH.g_charCustomizationsLookup[n][a][l][p];
                        if ($WH.g_barberStyleNamesLookup && $WH.g_barberStyleNamesLookup[n][a]) {
                            var D = -1;
                            switch (l) {
                                case 8:
                                case 3:
                                    D = 0;
                                    break;
                                case 7:
                                case 2:
                                    D = 2;
                                    break
                            }
                            if (I.length == 2 && D != -1 && $WH.g_barberStyleNamesLookup[n][a][D]) {
                                I.push([]);
                                for (var A = 0; A < I[0].length; ++A) {
                                    I[2].push($WH.g_barberStyleNamesLookup[n][a][D][I[0][A]] ? $WH.g_barberStyleNamesLookup[n][a][D][I[0][A]] : "")
                                }
                            }
                        }
                        break charAppearanceLoops
                    }
                }
            }
        }
    }
    return I
};
$WH.Tooltip = {
    create: function(j, l) {
        var g = $WH.ce("div"),
            n = $WH.ce("table"),
            b = $WH.ce("tbody"),
            f = $WH.ce("tr"),
            c = $WH.ce("tr"),
            a = $WH.ce("td"),
            m = $WH.ce("th"),
            k = $WH.ce("th"),
            h = $WH.ce("th");
        g.className = "wowhead-tooltip";
        m.style.backgroundPosition = "top right";
        k.style.backgroundPosition = "bottom left";
        h.style.backgroundPosition = "bottom right";
        if (j) {
            a.innerHTML = j
        }
        $WH.ae(f, a);
        $WH.ae(f, m);
        $WH.ae(b, f);
        $WH.ae(c, k);
        $WH.ae(c, h);
        $WH.ae(b, c);
        $WH.ae(n, b);
        if (!l) {
            $WH.Tooltip.icon = $WH.ce("p");
            $WH.Tooltip.icon.style.visibility = "hidden";
            $WH.ae($WH.Tooltip.icon, $WH.ce("div"));
            $WH.ae(g, $WH.Tooltip.icon)
        }
        $WH.ae(g, n);
        if (!l) {
            var e = $WH.ce("div");
            e.className = "wowhead-tooltip-powered";
            $WH.ae(g, e);
            $WH.Tooltip.logo = e
        }
        return g
    },
    getMultiPartHtml: function(b, a) {
        return "<table><tr><td>" + b + "</td></tr></table><table><tr><td>" + a + "</td></tr></table>"
    },
    fix: function(d, b, f) {
        var e = $WH.gE(d, "table")[0],
            h = $WH.gE(e, "td")[0],
            g = h.childNodes;
        d.className = $WH.trim(d.className.replace("tooltip-slider", ""));
        if (g.length >= 2 && g[0].nodeName == "TABLE" && g[1].nodeName == "TABLE") {
            g[0].style.whiteSpace = "nowrap";
            var a = parseInt(d.style.width);
            if (!d.slider || !a) {
                if (g[1].offsetWidth == 0) {
                    a = 320
                } else {
                    if (g[1].offsetWidth > 300) {
                        a = Math.max(300, g[0].offsetWidth) + 20
                    } else {
                        a = Math.max(g[0].offsetWidth, g[1].offsetWidth) + 20
                    }
                }
            }
            a = Math.min(320, a);
            if (a > 20) {
                d.style.width = a + "px";
                g[0].style.width = g[1].style.width = "100%";
                if (d.slider) {
                    Slider.setSize(d.slider, a - 6);
                    d.className += " tooltip-slider"
                }
                if (!b && d.offsetHeight > document.body.clientHeight) {
                    e.className = "shrink"
                }
            }
        } else {
            if (g.length >= 1 && g[0].nodeName == "TABLE" && d.slider) {
                g[0].style.whiteSpace = "nowrap";
                var a = parseInt(d.style.width);
                if (!a) {
                    a = g[0].offsetWidth + 20
                }
                a = Math.min(320, a);
                if (a > 20) {
                    d.style.width = a + "px";
                    g[0].style.width = "100%";
                    if (d.slider) {
                        Slider.setSize(d.slider, a - 6);
                        d.className += " tooltip-slider"
                    }
                    if (!b && d.offsetHeight > document.body.clientHeight) {
                        e.className = "shrink"
                    }
                }
            }
        }
        if (f) {
            $WH.Tooltip.setTooltipVisibility(d, true)
        }
    },
    fixSafe: function(c, b, a) {
        $WH.Tooltip.fix(c, b, a)
    },
    attachImage: function(d, e, k, h) {
        if (typeof h == "undefined") {
            h = ""
        }
        if (typeof jQuery != "undefined") {
            jQuery(d.parentNode).children(".image" + h).remove()
        } else {
            var l = new RegExp("\\bimage" + h + "\\b");
            for (var g = 0; g < d.parentNode.childNodes.length; g++) {
                if (l.test(d.parentNode.childNodes[g].className)) {
                    d.parentNode.removeChild(d.parentNode.childNodes[g]);
                    g--
                }
            }
        }
        var j = typeof e;
        if (j == "number") {
            var f = $WH.g_getDataSource(),
                b = e;
            if (f[b] && f[b]["image_" + Locale.getName() + h]) {
                e = f[b]["image_" + Locale.getName() + h]
            } else {
                return
            }
        } else {
            if (j != "string") {
                return
            }
        }
        var a = $WH.ce("div");
        a.className = "image" + h + (k ? " " + k : "");
        a.style.backgroundImage = "url(" + e + ")";
        if (typeof jQuery != "undefined") {
            jQuery(d).after(a)
        } else {
            d.parentNode.insertBefore(a, d.nextSibling)
        }
    },
    append: function(c, b) {
        var c = $WH.ge(c);
        var a = $WH.Tooltip.create(b);
        $WH.ae(c, a);
        $WH.Tooltip.fixSafe(a, 1, 1)
    },
    reset: function() {
        if ($WH.Tooltip.tooltip) {
            $WH.Tooltip.tooltip.parentNode.removeChild($WH.Tooltip.tooltip);
            $WH.Tooltip.tooltip = null
        }
        if ($WH.Tooltip.tooltip2) {
            $WH.Tooltip.tooltip2.parentNode.removeChild($WH.Tooltip.tooltip2);
            $WH.Tooltip.tooltip2 = null
        }
    },
    prepare: function(c) {
        if ($WH.Tooltip.tooltip) {
            return
        }
        var a = (typeof c != "undefined") ? c : document.body;
        var b = $WH.Tooltip.create();
        b.style.position = "absolute";
        b.style.left = b.style.top = "-2323px";
        $WH.ae(a, b);
        $WH.Tooltip.tooltip = b;
        $WH.Tooltip.tooltipTable = $WH.gE(b, "table")[0];
        $WH.Tooltip.tooltipTd = $WH.gE(b, "td")[0];
        var b = $WH.Tooltip.create(null, true);
        b.style.position = "absolute";
        b.style.left = b.style.top = "-2323px";
        $WH.ae(a, b);
        $WH.Tooltip.tooltip2 = b;
        $WH.Tooltip.tooltipTable2 = $WH.gE(b, "table")[0];
        $WH.Tooltip.tooltipTd2 = $WH.gE(b, "td")[0]
    },
    prepareScreen: function() {
        if ($WH.Tooltip.screen) {
            $WH.Tooltip.screen.style.display = "block"
        } else {
            $WH.Tooltip.screen = $WH.ce("div", {
                id: "wowhead-tooltip-screen",
                className: "wowhead-tooltip-screen"
            });
            $WH.Tooltip.screenCloser = $WH.ce("a", {
                id: "wowhead-tooltip-screen-close",
                className: "wowhead-tooltip-screen-close",
                onclick: $WowheadPower.clearTouchTooltip
            });
            $WH.Tooltip.screenInnerWrapper = $WH.ce("div", {
                id: "wowhead-tooltip-screen-inner-wrapper",
                className: "wowhead-tooltip-screen-inner-wrapper"
            });
            $WH.Tooltip.screenInner = $WH.ce("div", {
                id: "wowhead-tooltip-screen-inner",
                className: "wowhead-tooltip-screen-inner"
            });
            $WH.Tooltip.screenInnerBox = $WH.ce("div", {
                id: "wowhead-tooltip-screen-inner-box",
                className: "wowhead-tooltip-screen-inner-box"
            });
            $WH.Tooltip.screenCaption = $WH.ce("div", {
                id: "wowhead-tooltip-screen-caption",
                className: "wowhead-tooltip-screen-caption"
            });
            $WH.ae($WH.Tooltip.screen, $WH.Tooltip.screenCloser);
            $WH.ae($WH.Tooltip.screenInner, $WH.Tooltip.screenInnerBox);
            $WH.ae($WH.Tooltip.screenInnerWrapper, $WH.Tooltip.screenInner);
            $WH.ae($WH.Tooltip.screen, $WH.Tooltip.screenInnerWrapper);
            $WH.ae($WH.Tooltip.screen, $WH.Tooltip.screenCaption);
            $WH.ae(document.body, $WH.Tooltip.screen)
        }
        $WH.Tooltip.mobileTooltipShown = true;
        $WH.Tooltip.setupIScroll()
    },
    destroyIScroll: function() {
        if ($WH.Tooltip.iScroll) {
            $WH.Tooltip.iScroll.destroy();
            $WH.Tooltip.iScroll = null
        }
    },
    setupIScroll: function() {
        if (!$WH.Tooltip.mobileScrollSetUp) {
            var a = function(b) {
                if ($WH.Tooltip.mobileTooltipShown) {
                    if (!document.getElementById("wowhead-tooltip-screen-inner").contains(b.target)) {
                        b.preventDefault()
                    }
                }
            };
            $WH.aE(document.body, "touchmove", a);
            $WH.aE(document.body, "mousewheel", a);
            $WH.Tooltip.mobileScrollSetUp = true
        }
        if (typeof IScroll != "function") {
            return
        }
        setTimeout(function() {
            $WH.Tooltip.destroyIScroll();
            $WH.Tooltip.iScroll = new IScroll($WH.Tooltip.screenInnerWrapper, {
                mouseWheel: true,
                tap: true
            })
        }, 1)
    },
    setTooltipVisibility: function(a, b) {
        if (b) {
            a.setAttribute("data-visible", "yes");
            a.style.visibility = "visible"
        } else {
            a.setAttribute("data-visible", "no");
            a.style.visibility = "hidden"
        }
    },
    set: function(g, d, f, c) {
        var b = $WH.Tooltip.tooltip;
        b.style.width = "550px";
        b.style.left = "-2323px";
        b.style.top = "-2323px";
        if (g.match("hearthhead-tooltip-image")) {
            if (g.match("hearthhead-tooltip-image large-tooltip")) {
                $WH.Tooltip.tooltip.className = "wowhead-tooltip hearthhead-tooltip-image large-tooltip"
            } else {
                $WH.Tooltip.tooltip.className = "wowhead-tooltip hearthhead-tooltip-image"
            }
        } else {
            $WH.Tooltip.tooltip.className = "wowhead-tooltip"
        }
        if (g.nodeName) {
            $WH.ee($WH.Tooltip.tooltipTd);
            $WH.ae($WH.Tooltip.tooltipTd, g)
        } else {
            $WH.Tooltip.tooltipTd.innerHTML = g
        }
        b.style.display = "";
        $WH.Tooltip.setTooltipVisibility(b, true);
        $WH.Tooltip.fix(b, 0, 0);
        if (d) {
            $WH.Tooltip.showSecondary = true;
            var b = $WH.Tooltip.tooltip2;
            b.style.width = "550px";
            b.style.left = "-2323px";
            b.style.top = "-2323px";
            if (d.nodeName) {
                $WH.ee($WH.Tooltip.tooltipTd2);
                $WH.ae($WH.Tooltip.tooltipTd2, d)
            } else {
                $WH.Tooltip.tooltipTd2.innerHTML = d
            }
            b.style.display = "";
            $WH.Tooltip.fix(b, 0, 0)
        } else {
            $WH.Tooltip.showSecondary = false
        }
        var a = typeof Platform != "undefined" ? Platform.isTouch() : $WH.isTouch();
        if (a) {
            var h = $WH.Tooltip.showSecondary ? $WH.Tooltip.tooltipTd2 : $WH.Tooltip.tooltipTd;
            var e = $WH.ce("a");
            e.href = "javascript:;";
            e.className = "wowhead-touch-tooltip-closer";
            e.onclick = $WowheadPower.clearTouchTooltip;
            $WH.ae(h, e)
        }
        $WH.Tooltip.tooltipTable.style.display = (g == "") ? "none" : "";
        $WH.Tooltip.attachImage($WH.Tooltip.tooltipTable, f, c);
        $WH.Tooltip.generateEvent("show")
    },
    displayTooltip: function(a, d, b, c) {
        $WowheadPower.displayTooltip(a, d, b, c)
    },
    moveTests: [
        [null, null],
        [null, false],
        [false, null],
        [false, false]
    ],
    move: function(p, o, e, q, d, b) {
        if (!$WH.Tooltip.tooltipTable) {
            return
        }
        var n = $WH.Tooltip.tooltip,
            j = $WH.Tooltip.tooltipTable.offsetWidth,
            c = $WH.Tooltip.tooltipTable.offsetHeight,
            l = $WH.Tooltip.tooltip2,
            g = $WH.Tooltip.showSecondary ? $WH.Tooltip.tooltipTable2.offsetWidth : 0,
            a = $WH.Tooltip.showSecondary ? $WH.Tooltip.tooltipTable2.offsetHeight : 0,
            r;
        n.style.width = (j == 0) ? "auto" : (j + "px");
        l.style.width = g + "px";
        var m, f;
        for (var h = 0, k = $WH.Tooltip.moveTests.length; h < k; ++h) {
            r = $WH.Tooltip.moveTests[h];
            m = $WH.Tooltip.moveTest(p, o, e, q, d, b, r[0], r[1]);
            if ($WH.isset("WAS") && !WAS.intersect(m)) {
                f = true;
                break
            } else {
                if (!$WH.isset("WAS")) {
                    break
                }
            }
        }
        if ($WH.isset("WAS") && !f) {
            WAS.intersect(m, true)
        }
        n.style.left = m.l + "px";
        n.style.top = m.t + "px";
        $WH.Tooltip.setTooltipVisibility(n, true);
        if ($WH.Tooltip.showSecondary) {
            l.style.left = m.l + j + "px";
            l.style.top = m.t + "px";
            $WH.Tooltip.setTooltipVisibility(l, true)
        }
        $WH.Tooltip.generateEvent("move")
    },
    moveTest: function(e, n, q, B, c, a, p, b) {
        var m = e,
            z = n,
            g = $WH.Tooltip.tooltip,
            k = $WH.Tooltip.tooltipTable.offsetWidth,
            s = $WH.Tooltip.tooltipTable.offsetHeight,
            o = $WH.Tooltip.tooltip2,
            A = $WH.Tooltip.showSecondary ? $WH.Tooltip.tooltipTable2.offsetWidth : 0,
            f = $WH.Tooltip.showSecondary ? $WH.Tooltip.tooltipTable2.offsetHeight : 0,
            j = $WH.g_getWindowSize(),
            l = $WH.g_getScroll(),
            h = j.w,
            r = j.h,
            d = l.x,
            y = l.y,
            w = d,
            v = y,
            u = d + h,
            t = y + r;
        if (p == null) {
            p = (e + q + k + A <= u)
        }
        if (b == null) {
            b = (n - Math.max(s, f) >= v)
        }
        if (p) {
            e += q + c
        } else {
            e = Math.max(e - (k + A), w) - c
        }
        if (b) {
            n -= Math.max(s, f) + a
        } else {
            n += B + a
        }
        if (e < w) {
            e = w
        } else {
            if (e + k + A > u) {
                e = u - (k + A)
            }
        }
        if (n < v) {
            n = v
        } else {
            if (n + Math.max(s, f) > t) {
                n = Math.max(y, t - Math.max(s, f))
            }
        }
        if ($WH.Tooltip.iconVisible) {
            if (m >= e - 48 && m <= e && z >= n - 4 && z <= n + 48) {
                n -= 48 - (z - n)
            }
        }
        return $WH.g_createRect(e, n, k, s)
    },
    show: function(e, h, b, a, f, c, d, g) {
        if ($WH.Tooltip.disabled) {
            return
        }
        if (!b || b < 1) {
            b = 1
        }
        if (!a || a < 1) {
            a = 1
        }
        if (f) {
            h = '<span class="' + f + '">' + h + "</span>"
        }
        var j = $WH.ac(e);
        $WH.Tooltip.prepare();
        $WH.Tooltip.set(h, c, d, g);
        $WH.Tooltip.move(j.x, j.y, e.offsetWidth, e.offsetHeight, b, a)
    },
    showAtCursor: function(f, k, b, a, g, c, d, j) {
        if ($WH.Tooltip.disabled) {
            return
        }
        if (!b || b < 10) {
            b = 10
        }
        if (!a || a < 10) {
            a = 10
        }
        if (g) {
            k = '<span class="' + g + '">' + k + "</span>";
            if (c) {
                c = '<span class="' + g + '">' + c + "</span>"
            }
        }
        f = $WH.$E(f);
        var h = $WH.g_getCursorPos(f);
        $WH.Tooltip.prepare();
        $WH.Tooltip.set(k, c, d, j);
        $WH.Tooltip.move(h.x, h.y, 0, 0, b, a)
    },
    showAtXY: function(g, a, h, d, c, e, f, b) {
        if ($WH.Tooltip.disabled) {
            return
        }
        $WH.Tooltip.prepare();
        $WH.Tooltip.set(g, e, f, b);
        $WH.Tooltip.move(a, h, 0, 0, d, c)
    },
    showInScreen: function(d, k, e, b, c, j, f) {
        $WowheadPower.clearTouchTooltip();
        if ($WH.Tooltip.disabled) {
            return
        }
        if (e) {
            k = '<span class="' + e + '">' + k + "</span>"
        }
        $WH.Tooltip.prepareScreen();
        $WH.ee($WH.Tooltip.screenCaption);
        var h = $WH.ce("a", {
            innerHTML: $WH.g_isRemote() ? "Tap Link" : LANG.tooltip_taplink,
            onclick: (function(a, l) {
                a.setAttribute("data-disable-wowhead-tooltip", "true");
                if (a.fireEvent) {
                    a.fireEvent("on" + l)
                } else {
                    var m = document.createEvent("Events");
                    m.initEvent(l, true, true);
                    a.dispatchEvent(m)
                }
                if (a) {
                    a.removeAttribute("data-disable-wowhead-tooltip")
                }
                $WowheadPower.clearTouchTooltip()
            }).bind(null, d, "click")
        });
        var g = $WH.ce("i", {
            className: "fa fa-hand-o-up"
        });
        $WH.aef(h, g);
        $WH.ae($WH.Tooltip.screenCaption, h);
        $WowheadPower.setParent($WH.Tooltip.screenInnerBox);
        $WH.Tooltip.setIcon(f);
        $WH.Tooltip.set(k, b, c, j);
        $WH.Tooltip.move()
    },
    cursorUpdate: function(b, a, d) {
        if ($WH.Tooltip.disabled || !$WH.Tooltip.tooltip) {
            return
        }
        b = $WH.$E(b);
        if (!a || a < 10) {
            a = 10
        }
        if (!d || d < 10) {
            d = 10
        }
        var c = $WH.g_getCursorPos(b);
        $WH.Tooltip.move(c.x, c.y, 0, 0, a, d)
    },
    hide: function() {
        if ($WH.Tooltip.tooltip) {
            $WH.Tooltip.tooltip.style.display = "none";
            $WH.Tooltip.setTooltipVisibility($WH.Tooltip.tooltip, false);
            $WH.Tooltip.tooltipTable.className = "";
            $WH.Tooltip.setIcon(null);
            if ($WH.isset("WAS")) {
                WAS.restoreHidden()
            }
            $WH.Tooltip.generateEvent("hide")
        }
        if ($WH.Tooltip.tooltip2) {
            $WH.Tooltip.tooltip2.style.display = "none";
            $WH.Tooltip.setTooltipVisibility($WH.Tooltip.tooltip2, false);
            $WH.Tooltip.tooltipTable2.className = ""
        }
    },
    setIcon: function(a) {
        $WH.Tooltip.prepare();
        if (a) {
            $WH.Tooltip.icon.style.backgroundImage = "url(https://wowimg.zamimg.com/images/wow/icons/medium/" + a.toLowerCase() + ".jpg)";
            $WH.Tooltip.icon.style.visibility = "visible"
        } else {
            $WH.Tooltip.icon.style.backgroundImage = "none";
            $WH.Tooltip.icon.style.visibility = "hidden"
        }
        $WH.Tooltip.iconVisible = a ? 1 : 0
    },
    generateEvent: function(a) {
        if (!$WH.Tooltip.tooltip) {
            return
        }
        try {
            $WH.Tooltip.tooltip.dispatchEvent(new Event(a))
        } catch (c) {
            try {
                var b = document.createEvent("Event");
                b.initEvent(a, true, true);
                $WH.Tooltip.tooltip.dispatchEvent(b)
            } catch (c) {
                void(0)
            }
        }
    },
    addTooltipText: function(c, d, b) {
        var a = b ? ' class="' + b + '"' : "";
        c._fixTooltip = function(f) {
            if (f.match(/hearthhead-tooltip-image/)) {
                var g = /(<\/td><th[^>]*><\/th><\/tr><tr class="hearthhead-tooltip-inner">.*)/;
                var e = f.match(g);
                if (e) {
                    return f.replace(g, "<div" + a + ' style="margin-top:10px">' + d + "</div>$1")
                } else {
                    return f + "<table><tr><td><span" + a + ">" + d + '</span></td><th style="background-position:right top"></th></tr><tr class="hearthhead-tooltip-inner"><th style="background-position:left bottom"></th><th style="background-position:right bottom"></th></tr></table>'
                }
            } else {
                var g = /<\/table>\s*$/;
                if (g.test(f)) {
                    return f.replace(g, '<tr><td colspan="2"><div' + a + ' style="margin-top:10px">' + d + "</div></td></tr></table>")
                } else {
                    return f + "<div" + a + ' style="margin-top:10px">' + d + "</div>"
                }
            }
        }
    },
    simple: function(b, c, a, d) {
        if (d) {
            b.onmouseover = function(f) {
                $WH.Tooltip.show(b, c, false, false, a)
            }
        } else {
            b.onmouseover = function(f) {
                $WH.Tooltip.showAtCursor(f, c, false, false, a)
            };
            b.onmousemove = $WH.Tooltip.cursorUpdate
        }
        b.onmouseout = $WH.Tooltip.hide
    },
    simpleOverride: function(c, e, b, g, j, f, k, d, l, a, h) {
        c.overrideTooltip = {
            html: e,
            htmlGenerator: b,
            spanClass: g,
            icon: j,
            html2: f,
            html2Generator: k,
            image: d,
            imageClass: l,
            map: a,
            spellData: h
        }
    }
};
$WH.g_createButton = function(n, d, k) {
    var b = "btn btn-site";
    var g = "";
    var f = "";
    var e = "";
    var o = "";
    var h = [];
    var m = [];
    if (!k) {
        k = {}
    }
    if (!k["no-margin"]) {
        m.push("margin-left:5px")
    }
    if (typeof d != "string" || d === "") {
        d = "javascript:;"
    }
    if (k["new-window"]) {
        g = ' target="_blank"'
    }
    if (typeof k.id == "string") {
        f = ' id="' + k.id + '"'
    }
    if (typeof k.size != "undefined") {
        switch (k.size) {
            case "small":
            case "large":
                h.push("btn-" + k.size);
                break
        }
    } else {
        h.push("btn-small")
    }
    if (typeof k["class"] == "string") {
        h.push(k["class"])
    }
    if (typeof k.type == "string") {
        switch (k.type) {
            case "default":
            case "gray":
                b = "btn";
                break;
            default:
                b = "btn btn-" + k.type
        }
    }
    if (k.disabled) {
        h.push("btn-disabled");
        d = "javascript:;"
    }
    if (h.length) {
        b += " " + h.join(" ")
    }
    if (b) {
        b = ' class="' + b + '"'
    }
    if (!(typeof k["float"] != "undefined" && !k["float"])) {
        m.push("float:right")
    }
    if (typeof k.style == "string") {
        m.push(k.style)
    }
    if (m.length) {
        e = ' style="' + m.join(";") + '"'
    }
    var j = '<a href="' + d + '"' + g + f + b + e + ">" + n + "</a>";
    var c = $WH.ce("div");
    c.innerHTML = j;
    var l = c.childNodes[0];
    if (typeof k.click == "function" && !k.disabled) {
        l.onclick = k.click
    }
    if (typeof k.tooltip != "undefined") {
        if (k.tooltip !== false) {
            l.setAttribute("data-whattach", "true")
        }
        if (k.tooltip === false) {
            l.rel = "np"
        } else {
            if (typeof k.tooltip == "string") {
                $WH.Tooltip.simple(l, k.tooltip, null, true)
            } else {
                if (typeof k.tooltip == "object" && k.tooltip["text"]) {
                    $WH.Tooltip.simple(l, k.tooltip["text"], k.tooltip["class"], true)
                }
            }
        }
    }
    return l
};
$WH.g_setLogo = function() {
    var a = $("div.header .header-logo");
    if (typeof g_beta != "undefined" && g_beta) {
        a.addClass("warlords-logo");
        return
    }
    if (a.hasClass("custom-logo")) {
        return
    }
};
if ($WH.isset("$WowheadPower")) {
    $WowheadPower.init()
};