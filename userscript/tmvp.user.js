// ==UserScript==
// @name        Tumblr Mosaic Viewer p'Plus
// @match       http://tmv.proto.jp/*
// @version     1.0.0
// @description Tumblr Mosaic Viewer でオフセットオプションが動くようにします
// 
// @author      poochin
// @license     MIT
// @updated     2012-02-04
// @updateURL   https://github.com/poochin/chrome/raw/master/userscript/
// ==/UserScript==

var script = '(function() {\n'
        +'    _pc = ViewManager.prototype.putCell;\n'
        +'    ViewManager.prototype.putCell = function (_img) {\n'
        +'        _pc.apply(this, [_img]);\n'
        +'        _req = this.ILC.ARC.onlyRequest;\n'
        +'        sign = _req.type == "oldest" ? "-" : "+";\n'
        +'        h = ["!", _req.name, "+" + _req.offset].join("/");\n'
        +'        location.hash = h;\n'
        +'        UrlHashManager.beforeHash = location.hash;\n'
        +'    }\n'
        +'})()\n'
        +'\n'
        +'UrlHashManager.refreshPage = function () {\n'
        +'    this.beforeHash = location.hash;\n'
        +'    this.oldCheck();\n'
        +'    var hashObj = this.getHashToObj();\n'
        +'\n'
        +'    if ("!" == hashObj[0]) {\n'
        +'\n'
        +'        hashObj[hashObj.length - 1] == "250px" ? this.setImageSize(250) : this.setImageSize();\n'
        +'        if ("perma_list" == hashObj[1]) {\n'
        +'            if (!hashObj[2]) location.href = CONST.BASE_URL;\n'
        +'            PageManager.setPage(this.decodeSummary(hashObj[2]), "PermaList", hashObj[3]);\n'
        +'        } else {\n'
        +'            var _summary = {};\n'
        +'            _summary.name = hashObj[1];\n'
        +'            _summary.type = undefined;\n'
        +'            for (var i = 0; i < hashObj.length; ++i) {\n'
        +'                h = hashObj[i];\n'
        +'                switch (h[0]) {\n'
        +'                    case "#": _summary.tag = h.slice(1); break;\n'
        +'                    case "+": _summary.offset = parseInt(h.slice(1)); break;\n'
        +'                    case "-": _summary.offset = parseInt(h.slice(1)); _summary.type = "oldest"; break;\n'
        +'                    default: break;\n'
        +'                }\n'
        +'            }\n'
        +'            PageManager.setPage([_summary], "Blog");\n'
        +'        }\n'
        +'    } else {\n'
        +'        PageManager.setPage(cookieManager.dataObj.summary);\n'
        +'    }\n'
        +'}\n'
        +'UrlHashManager.refreshPage();';

function main() {
    elm = window.document.createElement('script');
    elm.innerHTML = script;
    console.log(elm);
    window.document.body.appendChild(elm);
}

if (window.document.body) {
    main()
}
else {
    window.document.addEventListener('DOMContentLoaded', main, false);
}
