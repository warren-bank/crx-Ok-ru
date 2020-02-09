### [Ok.ru](https://github.com/warren-bank/crx-Ok-ru)

Transfer embedded video stream from [Ok.ru website](https://ok.ru/) to player on [WebCast-Reloaded](https://github.com/warren-bank/crx-webcast-reloaded) [external website](https://warren-bank.github.io/crx-webcast-reloaded/external_website/index.html).

#### Summary:

Chromium browser extension:
* works on embedded iframes that are hosted at: [`ok.ru/videoembed/*`](https://ok.ru/)

#### Notes:

* on sites containing an embedded _Ok.ru_ iframe
  - depending on your particular browser, the Chromium extension may not be allowed to redirect the parent window
    * in this case, the URL of the parent window needs to be added to a whitelist that allows this action:
      - open: `chrome://settings/content/popups`
      - next to _Allow_, click: `Add`
      - enter the domain for the site hosting the iframe
        * examples:
          - `https://2livewatch.blogspot.com:443`
          - `https://freetvonline.live:443`
          - `http://ufreetv.com:80`

* after the video has been redirected to [WebCast-Reloaded](https://github.com/warren-bank/crx-webcast-reloaded) [external website](https://warren-bank.github.io/crx-webcast-reloaded/external_website/index.html)
  - video streams __will not__ play directly in the browser window
    * lack of permissive CORS HTTP response headers
  - video streams __will__ play directly on Chromecast

#### Legal:

* copyright: [Warren Bank](https://github.com/warren-bank)
* license: [GPL-2.0](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)
