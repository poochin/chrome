// ==UserScript==
// @name  NicoNico Live Tracking Script
// @match http://live.nicovideo.jp/watch/lv*
// @match http://live.nicovideo.jp/watch/co*
// @author      poochin
// @version     1.0.3
// @updated     2011-11-26
// @updateURL   https://github.com/poochin/chrome/raw/master/userscript/tracklive.user.js
// @description 閲覧中にニコニコ生放送の番組が終了した際に次の番組を自動追跡します。 終了済みの番組では確認ダイアログを表示します。
// ==/UserScript==

const trackspan = 30; // second
const foundmessage = "新しいコミュニティ放送が見つかりました。\n移動しますか？";
const url_getplayerstatus = 'http://live.nicovideo.jp/api/getplayerstatus/';

currentliveinfo = new LiveInfo(document);

xhr = httpref('GET', url_getplayerstatus + currentliveinfo.liveid, null, false);
const isclosed = (xhr.responseXML.querySelector('getplayerstatus>error>code') ? true : false);
delete xhr;

setTimeout(trackingNextLive, 0); // run ASAP


/**
 * LiveInfo class
 */
function LiveInfo(document) {
    this.coid = getCommunityIdFromDocument(document);
    this.liveid = getLiveIdFromDocument(document);
    return this;
}

// getLiveIdFromDocument function
function getLiveIdFromDocument(document) {
    link = document.querySelector('head > link[rel="alternate"]');
    url = link.getAttribute('href')
    id = url.match(/lv\d+$/);
    if (id.length) {
        return id[0];
    }
    return null
}

// getCommunityIdFromDocument function
function getCommunityIdFromDocument(document) {
    link = document.querySelector('.shosai > a');
    url = link.href;
    id = url.match(/co\d+$/);
    if (id.length) {
        return id[0];
    }
    return null;
}

// httpref function
function httpref(method, url, data, callback) {
    async = (typeof callback == 'function' ? true : false);
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (async) {
                callback(this);
            }
        }
    }
    xhr.open(method, url, async);
    xhr.send(data);
    return xhr;
}

// trackingNextLive function
function trackingNextLive() {
    coid = currentliveinfo.coid;

    xhr = httpref('GET', url_getplayerstatus + coid, null, false);
    idelem = xhr.responseXML.querySelector('getplayerstatus>stream>id');
    liveid = (idelem == null ? false : idelem.firstChild.data);

    if (liveid && currentliveinfo.liveid != liveid) {
        nexturl = 'http://live.nicovideo.jp/watch/' + liveid;
        if (!isclosed) {
            window.location = nexturl;
        }
        else if (confirm(foundmessage)) {
            window.location = nexturl;
        }
    } else {
        setTimeout(trackingNextLive, trackspan * 1000);
    }
}

