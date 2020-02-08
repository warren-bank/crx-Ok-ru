// https://freetvonline.live/category/us-news-live-streams/

{
  const channels = [...document.querySelectorAll('.article-container > article > .featured-image > a[href][title]')]
  const data     = channels.map(el => [el.href, el.title]).sort((a,b) => {
    const at = a[1]
    const bt = b[1]
    return (at < bt)
      ? -1
      : (at == bt)
          ? 0
          : 1
  })

  let $md     = ''
  let $html   = ''
  let $import = ''
  let i

  for (i=0; i<data.length; i++) {
    let href = data[i][0]
    let name = data[i][1]

    $md     += `  * [${name}](${href})\n`
    $html   += `                <li><a href="${href}">${name}</a>\n`
    $import += `            <DT><A HREF="${href}">${name}</A>\n`
  }

  const hr = "\n----------------------------------------\n"

  console.log(`${hr}${$md}${hr}${$html}${hr}${$import}${hr}`)
}
