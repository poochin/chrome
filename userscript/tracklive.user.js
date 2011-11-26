// ==UserScript==
// @name    NicoNico Live Tracking Script
// @version 1.0.1
// @match   http://live.nicovideo.jp/watch/lv*
// @match   http://live.nicovideo.jp/watch/co*
// @author  poochin
// @updated 2011-11-26
// ==/UserScript==

const trackspan = 30; // second
const foundmessage = "新しいコミュニティ放送が見つかりました。追跡を終了します。\n移動しますか？";

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

    nextliveurl = 'http://live.nicovideo.jp/watch/' + coid;
    xhr = httpref('GET', nextliveurl, null, false);

    html = document.createElement('html');
    html.innerHTML = xhr.responseText;

    liveinfo = new LiveInfo(html);
    if (currentliveinfo.liveid != liveinfo.liveid) {
        if (confirm(foundmessage)) {
            window.location = 'http://live.nicovideo.jp/watch/' + liveinfo.liveid;
        }
    } else {
        setTimeout(trackingNextLive, trackspan * 1000);
    }
}

currentliveinfo = new LiveInfo(document);

setTimeout(trackingNextLive, 0);

