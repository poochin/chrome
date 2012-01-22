// ==UserScript==
// @name        Default values
// @match       http://*/*
// @version     1.0.0
// @description フォームの初期値を設定します
// 
// @author      poochin
// @license     MIT
// @updated     2012-01-22
// @updateURL   https://github.com/poochin/chrome/raw/master/userscript/defaultvalues.user.js
// ==/UserScript==

const customvalues = [
    {
        match: /^http:\/\/www\.tumblr\.com\/new\/.*/,
        values: [{selector: '#post_state', value: 1,}],
    },
    {
        match: /^http:\/\/www\.tumblr\.com\/reblog\/.*/,
        values: [{selector: '#post_state', value: 1,}],
    },
];

function replacement() {
    for (var c = 0; c < customvalues.length; ++c) {
        var custom = customvalues[c];
        var match = custom['match'];
        var values = custom['values'];
        if (window.location.href.match(match)) {
            for (var i = 0; i < values.length; ++i) {
                var selector = values[i]['selector'];
                var value = values[i]['value'];
                var objs = window.document.querySelectorAll(selector);
                for (var o = 0; o < objs.length; ++o) {
                    objs[o].value = value;
                }
            }
        }
    }
}

if (window.document.body) {
    replacement();
}
else {
    window.document.addEventListener('DOMContentLoaded', replacement, false);
}
