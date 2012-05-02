// ==UserScript==
// @name        UserScript Skelton
// @match       http://*/*
// @version     1.0.0
// @description ユーザスクリプトの概要を記入してください
// 
// @author      poochin
// @license     MIT
// @updated     1970-01-01
// @updateURL   https://github.com/poochin/
// ==/UserScript==

function main() {
}

function isExecPage() {
    if (/^https?:\/\/[^\/]+\/.*/.test(location) /* for Opera */) {
        return true;
    }
}

if (window.document.body) {
    if (isExecPage() /* for Opera */) {
        main();
    }
}
else {
    window.document.addEventListener('DOMContentLoaded', main, false);
}

