// JS imports:
import { formatNum, secondsToHms } from '../js/helpers.js';
import { getTopObjects } from '../js/analyzers/analyzerHelpers.js';
import { formatDate, formatPercent } from '../js/analyzers/analyzerHelpers.js';
import { SpotifyAnalyzer } from '../js/analyzers/spotifyAnalyzer.js';
import { NavBar } from '../js/components/navBar.js';
import { FilePicker } from '../js/components/filePicker.js';
import { reportFactory } from '../js/factories/reportFactory.js';
import { insFactory } from '../js/factories/insFactory.js';

// CSS imports:
import '../styles/spotify.scss';
import website_icon from '../images/icons/spotify_inline.svg';

let instructions = new insFactory('spotify', document.getElementById('instructions-container'));
let rRender = new reportFactory('red');
let nBar = new NavBar();
let fPicker = new FilePicker(document.getElementById('filepicker'));
let analyzer = new SpotifyAnalyzer(renderReport);

let websiteIcon = document.getElementById('website-icon');
websiteIcon.innerHTML = website_icon;


let previewBtn = document.getElementById('preview-btn');
previewBtn.onclick = () => {
  renderReport(true);
};

kickStartReport();

function kickStartReport() {
  if (!DEBUG_MODE) {
    fPicker.onUpload((file) => { analyzer.init(file) });
  }
  else {
    renderReport(true);
  }
}

function renderReport(fakeData) {
  //TODO: needs to scroll to report once done
  const data = analyzer.getData(fakeData);
  renderUserReport(data);
  renderStreamingReport(data);
}

function renderStreamingReport(data) {
  let reportItems = [
    {
      icon: 'headphones',
      text: 'Total Playtime: ',
      textBold: secondsToHms(data.streaming_data.ms_played),
      tooltip: 'Total time spent listening to songs.'
    },
    {
      icon: 'skip-forward',
      text: 'Skipped Songs: ',
      textBold: data.streaming_data.skipped_songs,
      tooltip: 'Number of songs you have skipped.'
    },
    {
      icon: 'play',
      text: 'Listened Songs: ',
      textBold: Object.keys(data.streaming_data.songs).length,
      tooltip: 'Number of unique songs you have listened to.'
    }
  ]

  // sort top songs TODO: should probably e in spotifyAnalyzer
  let topSongsList = getTopObjects(data.streaming_data.songs, 25)
  topSongsList = topSongsList.reverse().map((s) => {
    return `${s[1]}  <strong>${s[0]}</strong>`;
  });

  let topArtistsList = getTopObjects(data.streaming_data.artists, 25)
  topArtistsList = topArtistsList.reverse().map((s) => {
    return `${s[1]}  <strong>${s[0]}</strong>`;
  });

  let topSongs = [{
      icon: 'music',
      text: 'Most Played Songs: ',
      type: 'list',
      listData: topSongsList,
      tooltip: 'These are your top played songs for the last year.'
    },
    {
      icon: 'disc',
      text: 'Most Played Artists: ',
      type: 'list',
      listData: topArtistsList,
      tooltip: 'These are your top played artists for the last year.'
    }
  ]

  console.log(data.streaming_data);
  const subreport = rRender.getSubreport('Streaming History Report');
  rRender.add(reportItems, 'icon-list', subreport);
  rRender.add(topSongs, 'list', subreport);
  rRender.getSubreportGraphContainer('graphs-container-streaming', subreport);

  // hourly posts chart
  rRender.addGraph(subreport, {
    type: 'clock',
    title: 'Listens by Hour of Day',
    data: data.streaming_data.time.hourly,
    clock_labels: 'song',
    css_label: 'stream-graph',
    size: 'medium'
  });

  // // daily posts chart
  // let postSentDaily = data.timeStats.weekly.sent;
  // let postReceivedDaily = data.timeStats.weekly.received;
  // // HACK BECAUSE FRAPPE CHARTS ARE BROKEN :(((((
  // postSentDaily.push(0);
  // rRender.addGraph(subreport, {
  //   type: 'axis-mixed',
  //   title: 'Posts by Day of the Week',
  //   data: [postSentDaily, postReceivedDaily, ['Posted', 'Posted by others on Timeline']],
  //   labels: DAYS,
  //   css_label: 'post-graph',
  //   size: 'medium'
  // });

  // // monthly posts chart
  // let postSentMonthly = data.timeStats.monthly.sent;
  // let postReceivedMonthly = data.timeStats.monthly.received;
  // // HACK BECAUSE FRAPPE CHARTS ARE BROKEN :(((((
  // postSentMonthly.push(0);
  // rRender.addGraph(subreport, {
  //   type: 'axis-mixed',
  //   title: 'Posts by Month',
  //   data: [postSentMonthly, postReceivedMonthly, ['Posted', 'Posted by others on Timeline']],
  //   labels: MONTHS,
  //   css_label: 'post-graph',
  //   size: 'medium'
  // });

  // // yearly messagages chart
  // let postSentYearly = Object.keys(data.timeStats.yearly).map((y) => {
  //   return data.timeStats.yearly[y].sent
  // });
  // let postReceivedYearly= Object.keys(data.timeStats.yearly).map((y) => {
  //   return data.timeStats.yearly[y].received
  // });
}

function renderUserReport(data) {
  let reportItems = [
    {
      icon: 'calendar',
      text: 'Date Joined: ',
      textBold: formatDate(data.date_joined),
      tooltip: 'The date that you created a Spotify account'
    },
    {
      icon: 'mail',
      text: 'Email: ',
      textBold: data.email,
      tooltip: 'Your email address.'
    },
    {
      icon: 'cake',
      text: 'Birthday: ',
      textBold: formatDate(data.birthday),
      tooltip: 'Your birthday.'
    },
    {
      icon: 'hexagon',
      text: 'Gender: ',
      textBold: data.gender,
      tooltip: 'Your gender.'
    },
    {
      icon: 'phone-call',
      text: 'Phone: ',
      textBold: data.phone,
      tooltip: 'Your phone number.'
    },
    {
      icon: 'phone-call',
      text: 'Mobile Operator: ',
      textBold: data.mobileOperator,
      tooltip: 'Your phone service provider.'
    },
    {
      icon: 'smartphone',
      text: 'Mobile Brand: ',
      textBold: data.mobileBrand,
      tooltip: 'Your phone type.'
    },
    {
      icon: 'map-pin',
      text: 'Country: ',
      textBold: data.country,
      tooltip: 'The country where your spotify account is registered at.'
    },
    {
      icon: 'map-pin',
      text: 'Postal Code: ',
      textBold: data.postalCode,
      tooltip: 'Your postal code.'
    },
  ];

  const subreport = rRender.getSubreport(data.username);
  rRender.add(reportItems, 'icon-list', subreport);
}
