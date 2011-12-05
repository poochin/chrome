// ==UserScript==
// @name        NicoNico Live Tracking Script
// @match       http://live.nicovideo.jp/watch/lv*
// @match       http://live.nicovideo.jp/watch/co*
// @version     1.0.5
// @description 閲覧中のニコニコ生放送の番組が終了した際に次の番組を自動追跡します。 終了済みの番組では確認ダイアログを表示します。
// 
// @author      poochin
// @license     MIT
// @updated     2011-12-05
// @updateURL   https://github.com/poochin/chrome/raw/master/userscript/tracklive.user.js
// ==/UserScript==

// ----- [Report] -----
// TODO: Nothong
// -----
// BUGGED: 新着放送の有無を確認するたびに視聴者数が増えるバグを抱えています
// FIXME: 予約ページを見るとタイムシフトのページに飛んでしまう
// -----
// FIXed: 最新の放送枠が放送中ではない場合もある
// ----- [/Report] -----

const trackspan = 30; // second
const foundmessage = "新しいコミュニティ放送が見つかりました。\n移動しますか？";
const url_live = 'http://live.nicovideo.jp/watch/';

const curliveinfo = new LiveInfo(document.documentElement);
const alreadyclosed = isLiveClosed(curliveinfo.liveid);
const isliveowner = isLiveOwner(document.documentElement);

if (isliveowner == false) {
    setTimeout(trackingNextLive, 0); // run ASAP
}


/**
 * LiveInfo class
 */
function LiveInfo(html) {
    this.coid = getCommunityIdFromDocument(html);
    this.liveid = getLiveIdFromDocument(html);
    this.livenum = parseInt(this.liveid.match(/\d+/));
}

// isAlreadyClosed
function isLiveClosed(liveid) {
    base_url = 'http://live.nicovideo.jp/api/getplayerstatus/';
    xhr = httpref('GET', base_url + curliveinfo.liveid, null, false);

    code = xhr.responseXML.querySelector('getplayerstatus > error > code');
    return ((code && code.textContent == 'closed') ? true : false);
}

// isLiveOwner
function isLiveOwner(html) {
    return (html.querySelector('#utility_container') ? true : false);
}

// getLiveIdFromDocument function
function getLiveIdFromDocument(html) {
    link = html.querySelector('head > link[rel="alternate"]');
    url = link.getAttribute('href')
    id = url.match(/lv\d+$/);

    return (id.length ? id[0] : null);
}

// getCommunityIdFromDocument function
function getCommunityIdFromDocument(html) {
    link = html.querySelector('.shosai > a');
    url = link.href;
    id = url.match(/co\d+$/);

    return (id.length ? id[0] : null);
}

// httpref function
function httpref(method, url, data, callback) {
    async = (typeof callback == 'function' ? true : false);
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            async == true &&
                callback(this);
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
    xhr = httpref('GET', url_live + curliveinfo.coid, null, false);
    html = document.createElement('html');
    html.innerHTML = xhr.responseText;

    liveinfo = new LiveInfo(html);
    if (liveinfo.livenum > curliveinfo.livenum) {
        if (!isLiveClosed(liveinfo.liveid)) {
            if (!alreadyclosed || confirm(foundmessage)) {
                window.location = url_live + liveinfo.liveid;
            }
        }
        return;
    }
    setTimeout(trackingNextLive, trackspan * 1000);
}

