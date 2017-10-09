var musicAPI = {};
var cors = 'http://cors-proxy.htmldriven.com/?url='
$(function () {
  async function getTracks(search, page = 1) {
    var data = await $.get(`${cors}http://go.mail.ru/zaycev?q=${search}&page=${page}`)
    data = data.body
    var dom = new DOMParser().parseFromString(data, 'text/html');

    var list = dom.getElementsByClassName('zaycev__block')
    var tracks = [];

    await Promise.all(_.map(list, async (li, i) => {
      var result_title = li.getElementsByClassName('result__title')[0]
      var block_info = li.getElementsByClassName('block-info__left')[0]
      var result__snp = li.getElementsByClassName('result__snp')[0]

      var titleLink = result_title.getElementsByTagName('a')[0];
      var title = titleLink.innerText;
      var trackHref = titleLink.href;

      var artistLink = block_info.getElementsByTagName('a')[0];
      var artist = _.split(artistLink.innerText, ' › ')[1];   
      var artistHref = artistLink.href

      var resultTextArray = _.split(result__snp.innerText.replace(/\s+/g,' ').replace(/^\s+|\s+$/,''), ' ');
      var duration = resultTextArray[1]    
      var size = `${resultTextArray[3]} ${resultTextArray[4]}`
      var bitrate = resultTextArray[6]
      
      var url = await getTrackUrl(trackHref);
      if (!url) {
        return;
      }

      var track = {
        order: i,
        title: title,
        trackHref: trackHref,
        artist: artist,
        duration: duration,
        size: size,
        bitrate: bitrate,
        url: url,
      }

      tracks.push(track)
    }));

    tracks = _.orderBy(tracks, 'order');

    return tracks;
  }

  async function getTrackUrl(href) {
    console.log('asd')
    var pageData = await $.get(`${cors}${href}`)
    pageData = pageData.body
    var page = new DOMParser().parseFromString(pageData, 'text/html');
    var download = page.getElementById('audiotrack-download-link');
    if (download)
      return download.href;
    return null
  }

  musicAPI.getTracks = getTracks;
  musicAPI.getTrackUrl = getTrackUrl;
})




