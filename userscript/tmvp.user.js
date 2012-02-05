// ==UserScript==
// @name        Tumblr Mosaic Viewer p'Plus
// @match       http://tmv.proto.jp/*
// @version     1.0.0
// @description Tumblr Mosaic Viewer でオフセットオプションが動くようにします
// 
// @author      poochin
// @license     MIT
// @updated     2012-02-04
// @updateURL   https://github.com/poochin/chrome/raw/master/userscript/tmvp.user.js
// ==/UserScript==

var script = function () {
    _pc = ViewManager.prototype.putCell;
    ViewManager.prototype.putCell = function (_img) {
        _pc.apply(this, [_img]);
        _req = this.ILC.ARC.onlyRequest;
        sign = (_req.type == "oldest" ? "-" : "+");
        offset = (_req.type == "oldest" ? _req.oldestStart : _req.offset);
        h = ["!", _req.name, sign + offset].join("/");
        if (location.hash == UrlHashManager.beforeHash) {
            location.hash = h;
            UrlHashManager.beforeHash = location.hash;
        }
    }
    UrlHashManager.refreshPage = function () {
        this.beforeHash = location.hash;
        this.oldCheck();
        var hashObj = this.getHashToObj();
    
        if ("!" == hashObj[0]) {
            hashObj[hashObj.length - 1] == "250px" ? this.setImageSize(250) : this.setImageSize();
            if ("perma_list" == hashObj[1]) {
                if (!hashObj[2]) location.href = CONST.BASE_URL;
                PageManager.setPage(this.decodeSummary(hashObj[2]), "PermaList", hashObj[3]);
            } else {
                var _summary = {};
                _summary.name = hashObj[1];
                _summary.type = undefined;
                for (var i = 0; i < hashObj.length; ++i) {
                    h = hashObj[i];
                    switch (h[0]) {
                        case "#": _summary.tag = h.slice(1); break;
                        case "+": _summary.offset = parseInt(h.slice(1)); break;
                        case "-": _summary.offset = parseInt(h.slice(1)); _summary.type = "oldest"; break;
                        default: break;
                    }
                    switch (h) {
                        case "oldest": _summary.type = "oldest"; break;
                        default: break;
                    }
                }
                PageManager.setPage([_summary], "Blog");
            }
        } else {
            PageManager.setPage(cookieManager.dataObj.summary);
        }
    }
    UrlHashManager.refreshPage();
};

function main() {
    elm = window.document.createElement('script');
    elm.innerHTML = '(' + script.toString() + ')()';
    console.log(elm);
    window.document.body.appendChild(elm);
}

if (window.document.body) {
    main()
}
else {
    window.document.addEventListener('DOMContentLoaded', main, false);
}
