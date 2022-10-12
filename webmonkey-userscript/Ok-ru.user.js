// ==UserScript==
// @name         Ok.ru
// @description  Watch videos in external player.
// @version      1.0.0
// @include      /^https?:\/\/(?:href\.li\/\?https?:\/\/)?(?:[^\.\/]*\.)*ok\.ru\/video(?:embed)?\/.*$/
// @icon         https://ok.ru/favicon.ico
// @run-at       document-end
// @grant        unsafeWindow
// @homepage     https://github.com/warren-bank/crx-Ok-ru/tree/webmonkey-userscript/es5
// @supportURL   https://github.com/warren-bank/crx-Ok-ru/issues
// @downloadURL  https://github.com/warren-bank/crx-Ok-ru/raw/webmonkey-userscript/es5/webmonkey-userscript/Ok-ru.user.js
// @updateURL    https://github.com/warren-bank/crx-Ok-ru/raw/webmonkey-userscript/es5/webmonkey-userscript/Ok-ru.user.js
// @namespace    warren-bank
// @author       Warren Bank
// @copyright    Warren Bank
// ==/UserScript==

// ----------------------------------------------------------------------------- constants

var user_options = {
  "common": {
    "redirect_embedded_iframes":    false
  },
  "webmonkey": {
    "post_intent_redirect_to_url":  "about:blank"
  },
  "greasemonkey": {
    "redirect_to_webcast_reloaded": true,
    "force_http":                   true,
    "force_https":                  false
  }
}

// ----------------------------------------------------------------------------- URL links to tools on Webcast Reloaded website

var get_webcast_reloaded_url = function(video_url, vtt_url, referer_url, force_http, force_https) {
  force_http  = (typeof force_http  === 'boolean') ? force_http  : user_options.greasemonkey.force_http
  force_https = (typeof force_https === 'boolean') ? force_https : user_options.greasemonkey.force_https

  var encoded_video_url, encoded_vtt_url, encoded_referer_url, webcast_reloaded_base, webcast_reloaded_url

  encoded_video_url     = encodeURIComponent(encodeURIComponent(btoa(video_url)))
  encoded_vtt_url       = vtt_url ? encodeURIComponent(encodeURIComponent(btoa(vtt_url))) : null
  referer_url           = referer_url ? referer_url : unsafeWindow.location.href
  encoded_referer_url   = encodeURIComponent(encodeURIComponent(btoa(referer_url)))

  webcast_reloaded_base = {
    "https": "https://warren-bank.github.io/crx-webcast-reloaded/external_website/index.html",
    "http":  "http://webcast-reloaded.surge.sh/index.html"
  }

  webcast_reloaded_base = (force_http)
                            ? webcast_reloaded_base.http
                            : (force_https)
                               ? webcast_reloaded_base.https
                               : (video_url.toLowerCase().indexOf('http:') === 0)
                                  ? webcast_reloaded_base.http
                                  : webcast_reloaded_base.https

  webcast_reloaded_url  = webcast_reloaded_base + '#/watch/' + encoded_video_url + (encoded_vtt_url ? ('/subtitle/' + encoded_vtt_url) : '') + '/referer/' + encoded_referer_url
  return webcast_reloaded_url
}

// ----------------------------------------------------------------------------- URL redirect

var redirect_to_url = function(url) {
  if (!url) return

  if (typeof GM_loadUrl === 'function') {
    if (typeof GM_resolveUrl === 'function')
      url = GM_resolveUrl(url, unsafeWindow.location.href) || url

    GM_loadUrl(url, 'Referer', unsafeWindow.location.href)
  }
  else {
    try {
      unsafeWindow.top.location = url
    }
    catch(e) {
      unsafeWindow.window.location = url
    }
  }
}

var process_webmonkey_post_intent_redirect_to_url = function() {
  var url = null

  if (typeof user_options.webmonkey.post_intent_redirect_to_url === 'string')
    url = user_options.webmonkey.post_intent_redirect_to_url

  if (typeof user_options.webmonkey.post_intent_redirect_to_url === 'function')
    url = user_options.webmonkey.post_intent_redirect_to_url()

  if (typeof url === 'string')
    redirect_to_url(url)
}

var process_video_url = function(video_url, video_type, vtt_url, referer_url) {
  if (!video_url)
    return

  if (!referer_url)
    referer_url = unsafeWindow.location.href

  if (typeof GM_startIntent === 'function') {
    // running in Android-WebMonkey: open Intent chooser

    var args = [
      /* action = */ 'android.intent.action.VIEW',
      /* data   = */ video_url,
      /* type   = */ video_type
    ]

    // extras:
    if (vtt_url) {
      args.push('textUrl')
      args.push(vtt_url)
    }
    if (referer_url) {
      args.push('referUrl')
      args.push(referer_url)
    }

    GM_startIntent.apply(this, args)
    process_webmonkey_post_intent_redirect_to_url()
    return true
  }
  else if (user_options.greasemonkey.redirect_to_webcast_reloaded) {
    // running in standard web browser: redirect URL to top-level tool on Webcast Reloaded website

    redirect_to_url(get_webcast_reloaded_url(video_url, vtt_url, referer_url))
    return true
  }
  else {
    return false
  }
}

var process_hls_url = function(hls_url, vtt_url, referer_url) {
  process_video_url(/* video_url= */ hls_url, /* video_type= */ 'application/x-mpegurl', vtt_url, referer_url)
}

var process_dash_url = function(dash_url, vtt_url, referer_url) {
  process_video_url(/* video_url= */ dash_url, /* video_type= */ 'application/dash+xml', vtt_url, referer_url)
}

var process_mp4_url = function(mp4_url, vtt_url, referer_url) {
  process_video_url(/* video_url= */ mp4_url, /* video_type= */ 'video/mp4', vtt_url, referer_url)
}

// ----------------------------------------------------------------------------- process page

var process_page = function() {
  var el = document.querySelector('[data-module="VideoEmbed"] > [data-module="OKVideo"][data-options]')
  if (!el) return

  var data = el.getAttribute('data-options')
  if (!data) return

  process_data(data)
}

var process_data = function(data) {
  var regex, hls_url

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
    preprocess_hls_url(hls_url)
}

var preprocess_hls_url = function(hls_url) {
  if (!hls_url) return

  // expand ascii-encoded unicode
  while(hls_url.indexOf('\\u') !== -1)
    hls_url = JSON.parse('"' + hls_url + '"')

  // transfer video stream
  process_hls_url(hls_url)
}

// ----------------------------------------------------------------------------- bootstrap

var should_init = function() {
  var is_top = (unsafeWindow.window === unsafeWindow.top)

  return is_top || user_options.common.redirect_embedded_iframes
}

var init = function() {
  var href  = unsafeWindow.location.href
  var regex = new RegExp('(ok\\.ru)/video/', 'i')

  if (regex.test(href))
    redirect_to_url(href.replace(regex, '$1/videoembed/'))
  else
    process_page()
}

if (should_init())
  init()

// -----------------------------------------------------------------------------
