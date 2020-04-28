// ==UserScript==
// @name         Ok.ru
// @description  Transfer video stream to player on WebCast-Reloaded external website.
// @version      0.2.0
// @match        *://ok.ru/videoembed/*
// @match        *://*.ok.ru/videoembed/*
// @match        *://href.li/?https://ok.ru/videoembed/*
// @match        *://href.li/?https://www.ok.ru/videoembed/*
// @icon         https://ok.ru/favicon.ico
// @run-at       document-idle
// @homepage     https://github.com/warren-bank/crx-Ok-ru/tree/greasemonkey-userscript
// @supportURL   https://github.com/warren-bank/crx-Ok-ru/issues
// @downloadURL  https://github.com/warren-bank/crx-Ok-ru/raw/greasemonkey-userscript/greasemonkey-userscript/Ok-ru.user.js
// @updateURL    https://github.com/warren-bank/crx-Ok-ru/raw/greasemonkey-userscript/greasemonkey-userscript/Ok-ru.user.js
// @namespace    warren-bank
// @author       Warren Bank
// @copyright    Warren Bank
// ==/UserScript==

// https://www.chromium.org/developers/design-documents/user-scripts

var user_options = {
  "script_injection_delay_ms":   0,
  "open_in_webcast_reloaded":    false,
  "open_in_exoairplayer_sender": true
}

var payload = function(){
  const get_referer = () => {
    let url = ''
    try {
      url = top.location.href
    }
    catch(e){
      url = window.location.href
    }
    return url
  }

  const redirect_url = (url) => {
    try {
      top.location = url
    }
    catch(e){
      window.location = url
    }
  }

  const process_video_url = (hls_url) => {
    let encoded_hls_url, webcast_reloaded_base, webcast_reloaded_url
    let encoded_referer_url, exoairplayer_base, exoairplayer_url

    encoded_hls_url       = encodeURIComponent(encodeURIComponent(btoa(hls_url)))
    webcast_reloaded_base = {
      "https": "https://warren-bank.github.io/crx-webcast-reloaded/external_website/index.html",
      "http":  "http://webcast-reloaded.surge.sh/index.html"
    }
    webcast_reloaded_base = (hls_url.toLowerCase().indexOf('https:') === 0)
                              ? webcast_reloaded_base.https
                              : webcast_reloaded_base.http
    webcast_reloaded_url  = webcast_reloaded_base + '#/watch/' + encoded_hls_url

    encoded_referer_url   = encodeURIComponent(encodeURIComponent(btoa(get_referer())))
    exoairplayer_base     = 'http://webcast-reloaded.surge.sh/airplay_sender.html'
    exoairplayer_url      = exoairplayer_base  + '#/watch/' + encoded_hls_url + '/referer/' + encoded_referer_url

    if (window.open_in_webcast_reloaded && webcast_reloaded_url) {
      redirect_url(webcast_reloaded_url)
      return
    }

    if (window.open_in_exoairplayer_sender && exoairplayer_url) {
      redirect_url(exoairplayer_url)
      return
    }
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

var get_hash_code = function(str){
  var hash, i, char
  hash = 0
  if (str.length == 0) {
    return hash
  }
  for (i = 0; i < str.length; i++) {
    char = str.charCodeAt(i)
    hash = ((hash<<5)-hash)+char
    hash = hash & hash  // Convert to 32bit integer
  }
  return Math.abs(hash)
}

var inject_function = function(_function){
  var inline, script, head

  inline = _function.toString()
  inline = '(' + inline + ')()' + '; //# sourceURL=crx_extension.' + get_hash_code(inline)
  inline = document.createTextNode(inline)

  script = document.createElement('script')
  script.appendChild(inline)

  head = document.head
  head.appendChild(script)
}

var inject_options = function(){
  var _function = `function(){
    window.open_in_webcast_reloaded    = ${user_options['open_in_webcast_reloaded']}
    window.open_in_exoairplayer_sender = ${user_options['open_in_exoairplayer_sender']}
  }`
  inject_function(_function)
}

var inject_options_then_function = function(_function){
  inject_options()
  inject_function(_function)
}

if (user_options['open_in_webcast_reloaded'] || user_options['open_in_exoairplayer_sender']){
  setTimeout(
    function(){
      inject_options_then_function(payload)
    },
    user_options['script_injection_delay_ms']
  )
}
