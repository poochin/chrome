// ==UserScript==
// @name        Tumblr Mosaic Viewer p'Plus
// @match       http://tmv.proto.jp/*
// @version     1.0.1
// @description Tumblr Mosaic Viewer でオフセットオプションが動くようにします
// 
// @author      poochin
// @license     MIT
// @updated     2012-02-04
// @updateURL   https://github.com/poochin/chrome/raw/master/userscript/tmvp.user.js
// ==/UserScript==

var script = function () {
    /* ApiReadRequest に関数をかませて oldestStart 初期化に対応します */
    var _ar = ApiReadRequest;
    ApiReadRequest = function(_Summary, _ApiReadController) {
        if (_Summary.oldestStart) {
            this.getNextOldestFirst = this.getNextOldest;
        }
        _ar.apply(this, [_Summary, _ApiReadController]);
        this.oldestStart = _Summary.oldestStart || 0;
    };
    ApiReadRequest.prototype = _ar.prototype;
    /* ハッシュにおけるオフセット値の入力に対応します */
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
                        case "-": _summary.oldestStart = parseInt(h.slice(1)); _summary.type = "oldest"; break;
                        default: break;
                    }
                    switch (h) {
                        case "oldest": /* fall threw */
                        case "random": /* fall trhew */
                        case "around": _summary.type = h; break;
                        default: break;
                    }
                }
                PageManager.setPage([_summary], "Blog");
            }
        } else {
            PageManager.setPage(cookieManager.dataObj.summary);
        }
    };
    /* オフセット値を監視します */
    function buildOffset() {
        var VM = CONST.MOS_ELEM.VM;
        var req = VM.ILC.ARC.onlyRequest;
        var sign = (req.type == "oldest" ? "-" : "+"),
            offset = (req.type == "oldest" ? req.oldestStart : req.offset),
            lencache = (VM.ILC.imagesList.length + VM.ILC.ARC.objectList.length);
        offset -= parseInt(sign + "1") * lencache;
        return sign + offset;
    };
    UrlHashManager.observeArcOffset = function() {
        var blankspan = 100;
        var VM = CONST.MOS_ELEM.VM;
        if (VM.ILC.ARC.onlyRequest && location.hash == UrlHashManager.beforeHash) {
            var hashObj = UrlHashManager.getHashToObj();
            var req = CONST.MOS_ELEM.VM.ILC.ARC.onlyRequest;
            var offset = buildOffset();
            if ((req.type == "newest" || req.type == "oldest") && hashObj.indexOf(offset) == -1) {
                h = ["!", req.name, offset].join("/");
                location.hash = h;
                UrlHashManager.beforeHash = location.hash;
                blankspan = 400;
            }
        }
        setTimeout(arguments.callee, blankspan);
    };
    /* 先に refreshPage 呼び出さないとハッシュが上書きされてしまいます */
    UrlHashManager.refreshPage();
    UrlHashManager.observeArcOffset();
};

function main() {
    elm = window.document.createElement("script");
    elm.innerHTML = "(" + script.toString() + ")()";
    /* console.log(elm); */
    window.document.body.appendChild(elm);
}

if (window.document.body) {
    main()
}
else {
    window.document.addEventListener("DOMContentLoaded", main, false);
}
