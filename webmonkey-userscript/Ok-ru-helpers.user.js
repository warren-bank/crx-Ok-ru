// ==UserScript==
// @name         Ok.ru Helpers
// @description  List all embedded videos.
// @version      1.1.0
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
  var hostname      = unsafeWindow.location.hostname.toLowerCase()
  var iframes       = unsafeWindow.document.querySelectorAll('iframe[src]')
  var iframe_urls   = []
  var iframe_titles = []
  var iframe_url, iframe_title

  for (var i=0; i < iframes.length; i++) {
    iframe_url = iframes[i].getAttribute('src')

    if (iframe_regex.test(iframe_url)) {
      iframe_url = resolve_url(iframe_url)
      iframe_urls.push(iframe_url)

      iframe_title = null
      try {
        if (hostname.endsWith('nfl-video.com')) {
          iframe_title = iframes[i].parentElement.previousElementSibling.querySelector('[title], strong')
          iframe_title = iframe_title.hasAttribute('title') ? iframe_title.getAttribute('title') : iframe_title.textContent
          iframe_title = iframe_title.trim()
        }
      }
      catch(e) {
        iframe_title = null
      }
      iframe_titles.push(iframe_title)
    }
  }

  if (iframe_urls.length)
    rewrite_dom(iframe_urls, iframe_titles)
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

var rewrite_dom = function(iframe_urls, iframe_titles) {
  unsafeWindow.document.body.innerHTML = `
<style>
  body {padding: 20px; background-color: #ffffff;}
  body > ul,
  body > ul > li {list-style-type: disc;}
  body > ul > li > a {color: #0000ff; text-decoration: none; font-size: 16px; line-height: 24px;}
</style>

<ul>
  ${iframe_urls.map((url, index) => `<li><a target="_blank" href="${url}">${url}</a>${iframe_titles[index] ? `<div>${iframe_titles[index]}</div>` : ''}</li>`).join("\n  ")}
</ul>
`
}

// ----------------------------------------------------------------------------- bootstrap

process_page()

// -----------------------------------------------------------------------------
