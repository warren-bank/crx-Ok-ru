### [Ok.ru](https://github.com/warren-bank/crx-Ok-ru/tree/webmonkey-userscript/es5)

[Userscript](https://github.com/warren-bank/crx-Ok-ru/raw/webmonkey-userscript/es5/webmonkey-userscript/Ok-ru.user.js) for [Ok.ru](https://ok.ru/) to run in both:
* the [WebMonkey](https://github.com/warren-bank/Android-WebMonkey) application for Android
* the [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) web browser extension for Chrome/Chromium

Its purpose is to:
* redirect embedded videos to an external player

#### Notes:

- the userscript will not execute in embedded _Ok.ru_ iframe(s) when:
  * running the userscript in _WebMonkey_
  * running the userscript in _Tampermonkey_ with the option `common.redirect_embedded_iframes` disabled
    - this option is disabled by default
- when the userscript will not execute in embedded _Ok.ru_ iframe(s)
  * the _Ok.ru_ video player needs to be loaded into the top window
  * this can either be done:
    - automatically, by using an additional [userscript helper](https://github.com/warren-bank/crx-Ok-ru/tree/webmonkey-userscript/helpers)
    - manually, by clicking the "Open in..." button in the _Ok.ru_ video player
- when running the userscript in _Tampermonkey_
  * on sites containing embedded _Ok.ru_ iframe(s)
    - when the option `common.redirect_embedded_iframes` is enabled
      * depending on your particular browser, the Chromium extension may not be allowed to redirect the parent window
      * in this case, the URL of the parent window needs to be added to a whitelist that allows this action:
        - open: `chrome://settings/content/popups`
        - next to _Allow_, click: `Add`
        - enter the domain for the site hosting the iframe
          * examples:
            - `https://nfl-video.com:443`
            - `https://2livewatch.blogspot.com:443`
            - `https://freetvonline.live:443`
            - `http://ufreetv.com:80`
  * after the video has been redirected to [WebCast-Reloaded](https://github.com/warren-bank/crx-webcast-reloaded) [external website](https://warren-bank.github.io/crx-webcast-reloaded/external_website/index.html)
    - video streams __will not__ play directly in the browser window
      * lack of permissive CORS HTTP response headers
    - video streams __will__ play directly on Chromecast and [ExoAirPlayer](https://github.com/warren-bank/Android-ExoPlayer-AirPlay-Receiver)

#### Legal:

* copyright: [Warren Bank](https://github.com/warren-bank)
* license: [GPL-2.0](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)
