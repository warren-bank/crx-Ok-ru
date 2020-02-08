// ==UserScript==
// @name         FreeTvOnline
// @description  Transfer video stream to player on WebCast-Reloaded external website.
// @version      0.1.0
// @match        *://ok.ru/*
// @icon         https://ok.ru/favicon.ico
// @run-at       document-idle
// @homepage     https://github.com/warren-bank/crx-Ok-ru
// @supportURL   https://github.com/warren-bank/crx-Ok-ru/issues
// @downloadURL  https://github.com/warren-bank/crx-Ok-ru/raw/greasemonkey-userscript/greasemonkey-userscript/Ok-ru.user.js
// @updateURL    https://github.com/warren-bank/crx-Ok-ru/raw/greasemonkey-userscript/greasemonkey-userscript/Ok-ru.user.js
// @namespace    warren-bank
// @author       Warren Bank
// @copyright    Warren Bank
// ==/UserScript==

// https://www.chromium.org/developers/design-documents/user-scripts

var payload = function(){
  const process_video_url = (hls_url) => {
    let encoded_hls_url, webcast_reloaded_base, webcast_reloaded_url

    encoded_hls_url       = encodeURIComponent(encodeURIComponent(btoa(hls_url)))
    webcast_reloaded_base = {
      "https": "https://warren-bank.github.io/crx-webcast-reloaded/external_website/index.html#/watch/",
      "http":  "http://gitcdn.link/cdn/warren-bank/crx-webcast-reloaded/gh-pages/external_website/index.html#/watch/"
    }
    webcast_reloaded_base = (hls_url.toLowerCase().indexOf('https:') === 0)
                              ? webcast_reloaded_base.https
                              : webcast_reloaded_base.http
    webcast_reloaded_url  = webcast_reloaded_base + encoded_hls_url

    top.location = webcast_reloaded_url
  }

  const process_data = (data) => {
    const regex = /^.*?\\"hlsMasterPlaylistUrl\\":\\"(http[^"]+)\\".*$/i
    if (!regex.test(data)) return
    const hls_url = data.replace(regex, '$1')
    process_video_url(hls_url)
  }

  const process_page = () => {
    const el = document.querySelector('[data-module="VideoEmbed"] > [data-module="OKVideo"][data-options]')
    if (!el) return

    const data = el.getAttribute('data-options')
    if (!data) return

    process_data(data)
  }

  process_page()
}

var inject_payload = function(){
  var inline, script, head

  inline = document.createTextNode(
    '(' + payload.toString() + ')()'
  )

  script = document.createElement('script')
  script.appendChild(inline)

  head = document.getElementsByTagName('head')[0]
  head.appendChild(script)
}

if (document.readyState === 'complete'){
  inject_payload()
}
else {
  document.onreadystatechange = function(){
    if (document.readyState === 'complete'){
      inject_payload()
    }
  }
}
