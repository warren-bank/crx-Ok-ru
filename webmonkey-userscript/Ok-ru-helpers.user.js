// ==UserScript==
// @name         Ok.ru Helpers
// @description  List all embedded videos.
// @version      1.0.0
// @include      /^https?:\/\/(?:[^\.\/]*\.)*(?:nfl-video\.com)\/.*$/
// @icon         https://ok.ru/favicon.ico
// @run-at       document-end
// @grant        unsafeWindow
// @homepage     https://github.com/warren-bank/crx-Ok-ru/tree/webmonkey-userscript/helpers
// @supportURL   https://github.com/warren-bank/crx-Ok-ru/issues
// @downloadURL  https://github.com/warren-bank/crx-Ok-ru/raw/webmonkey-userscript/helpers/webmonkey-userscript/Ok-ru-helpers.user.js
// @updateURL    https://github.com/warren-bank/crx-Ok-ru/raw/webmonkey-userscript/helpers/webmonkey-userscript/Ok-ru-helpers.user.js
// @namespace    warren-bank
// @author       Warren Bank
// @copyright    Warren Bank
// ==/UserScript==

// ----------------------------------------------------------------------------- constants

var iframe_regex = new RegExp('[/\\.]ok\\.ru/video(?:embed)?/', 'i')

// ----------------------------------------------------------------------------- process page

var process_page = function() {
  var iframes     = unsafeWindow.document.querySelectorAll('iframe[src]')
  var iframe_urls = []
  var iframe_url

  for (var i=0; i < iframes.length; i++) {
    iframe_url = iframes[i].getAttribute('src')

    if (iframe_regex.test(iframe_url)) {
      iframe_url = resolve_url(iframe_url)
      iframe_urls.push(iframe_url)
    }
  }

  if (iframe_urls.length)
    rewrite_dom(iframe_urls)
}

var resolve_url = function(url) {
  if (url.substring(0, 4).toLowerCase() === 'http')
    return url

  if (url.substring(0, 2) === '//')
    return unsafeWindow.location.protocol + url

  if (url.substring(0, 1) === '/')
    return unsafeWindow.location.protocol + '//' + unsafeWindow.location.host + url

  return unsafeWindow.location.protocol + '//' + unsafeWindow.location.host + unsafeWindow.location.pathname.replace(/[^\/]+$/, '') + url
}

var rewrite_dom = function(iframe_urls) {
  unsafeWindow.document.body.innerHTML = `
<style>
  body {padding: 20px; background-color: #ffffff;}
  body > ul,
  body > ul > li {list-style-type: disc;}
  body > ul > li > a {color: #0000ff; text-decoration: none; font-size: 16px; line-height: 24px;}
</style>

<ul>
  ${iframe_urls.map(url => `<li><a target="_blank" href="${url}">${url}</a></li>`).join("\n  ")}
</ul>
`
}

// ----------------------------------------------------------------------------- bootstrap

process_page()

// -----------------------------------------------------------------------------
