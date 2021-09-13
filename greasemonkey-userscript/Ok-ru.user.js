// ==UserScript==
// @name         Ok.ru
// @description  Transfer video stream to player on WebCast-Reloaded external website.
// @version      0.2.2
// @match        *://ok.ru/videoembed/*
// @match        *://*.ok.ru/videoembed/*
// @match        *://href.li/?https://ok.ru/videoembed/*
// @match        *://href.li/?https://www.ok.ru/videoembed/*
// @match        *://ok.ru/video/*
// @match        *://*.ok.ru/video/*
// @match        *://href.li/?https://ok.ru/video/*
// @match        *://href.li/?https://www.ok.ru/video/*
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
  "script_injection_delay_ms":    0,
  "redirect_to_webcast_reloaded": true,
  "force_http":                   true,
  "force_https":                  false
}

var payload = function(){
  const get_referer_url = function() {
    let referer_url
    try {
      referer_url = top.location.href
    }
    catch(e) {
      referer_url = window.location.href
    }
    return referer_url
  }

  const get_webcast_reloaded_url = (hls_url, vtt_url, referer_url) => {
    let encoded_hls_url, encoded_vtt_url, encoded_referer_url, webcast_reloaded_base, webcast_reloaded_url

    encoded_hls_url       = encodeURIComponent(encodeURIComponent(btoa(hls_url)))
    encoded_vtt_url       = vtt_url ? encodeURIComponent(encodeURIComponent(btoa(vtt_url))) : null
    referer_url           = referer_url ? referer_url : get_referer_url()
    encoded_referer_url   = encodeURIComponent(encodeURIComponent(btoa(referer_url)))

    webcast_reloaded_base = {
      "https": "https://warren-bank.github.io/crx-webcast-reloaded/external_website/index.html",
      "http":  "http://webcast-reloaded.surge.sh/index.html"
    }

    webcast_reloaded_base = (window.force_http)
                              ? webcast_reloaded_base.http
                              : (window.force_https)
                                 ? webcast_reloaded_base.https
                                 : (hls_url.toLowerCase().indexOf('http:') === 0)
                                    ? webcast_reloaded_base.http
                                    : webcast_reloaded_base.https

    webcast_reloaded_url  = webcast_reloaded_base + '#/watch/' + encoded_hls_url + (encoded_vtt_url ? ('/subtitle/' + encoded_vtt_url) : '') + '/referer/' + encoded_referer_url
    return webcast_reloaded_url
  }

  const redirect_to_url = function(url) {
    if (!url) return

    try {
      top.location = url
    }
    catch(e) {
      window.location = url
    }
  }

  const process_video_url = (hls_url) => {
    if (!hls_url) return

    // expand ascii-encoded unicode
    while(hls_url.indexOf('\\u') !== -1)
      hls_url = JSON.parse('"' + hls_url + '"')

    // transfer video stream
    if (window.redirect_to_webcast_reloaded)
      redirect_to_url(get_webcast_reloaded_url(hls_url))
  }

  const process_data = (data) => {
    let regex, hls_url

    if (!hls_url) {
      regex = /^.*?\\"hlsMasterPlaylistUrl\\":\\"(http[^"]+)\\".*$/i
      if (regex.test(data))
        hls_url = data.replace(regex, '$1')
    }

    if (!hls_url) {
      regex = /^.*?\\"hlsManifestUrl\\":\\"(http[^"]+)\\".*$/i
      if (regex.test(data))
        hls_url = data.replace(regex, '$1')
    }

    if (hls_url)
      process_video_url(hls_url)
  }

  const process_page = () => {
    const el = document.querySelector('[data-module="VideoEmbed"] > [data-module="OKVideo"][data-options]')
    if (!el) return

    const data = el.getAttribute('data-options')
    if (!data) return

    process_data(data)
  }

  const init = () => {
    const href  = window.location.href
    const regex = new RegExp('ok.ru/video/', 'i')

    if (regex.test(href))
      redirect_to_url(href.replace(regex, 'ok.ru/videoembed/'))
    else
      process_page()
  }

  init()
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
    window.redirect_to_webcast_reloaded = ${user_options['redirect_to_webcast_reloaded']}
    window.force_http                   = ${user_options['force_http']}
    window.force_https                  = ${user_options['force_https']}
  }`
  inject_function(_function)
}

var bootstrap = function(){
  inject_options()
  inject_function(payload)
}

if (user_options['redirect_to_webcast_reloaded']){
  setTimeout(
    bootstrap,
    user_options['script_injection_delay_ms']
  )
}
