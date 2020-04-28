### [Ok.ru](https://github.com/warren-bank/crx-Ok-ru)

Transfer embedded video stream from [Ok.ru website](https://ok.ru/) to either:
* an HTML5 video player on the [WebCast-Reloaded](https://github.com/warren-bank/crx-webcast-reloaded) [external website](https://warren-bank.github.io/crx-webcast-reloaded/external_website/index.html)
* an instance of [ExoAirPlayer](https://github.com/warren-bank/Android-ExoPlayer-AirPlay-Receiver/releases)

#### Summary:

[Greasemonkey userscript](https://github.com/warren-bank/crx-Ok-ru/raw/greasemonkey-userscript/greasemonkey-userscript/Ok-ru.user.js):
* works on embedded iframes that are hosted at: [`ok.ru/videoembed/*`](https://ok.ru/)

#### Notes:

* video streams __will not__ play directly in the browser window
  - lack of permissive CORS HTTP response headers
* video streams __will__ play directly on Chromecast and ExoAirPlayer

#### Legal:

* copyright: [Warren Bank](https://github.com/warren-bank)
* license: [GPL-2.0](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)
