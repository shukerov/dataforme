// JS imports:
import { DAYS, MONTHS } from '../../js/constants.js';
import { formatNum, secondsToHms } from '../../js/helpers.js';
import { getTopObjects } from '../../js/analysis/analyzerHelpers.js';
import { formatDate, formatPercent } from '../../js/analysis/analyzerHelpers.js';
import { NavBar } from '../../js/components/navBar.js';
import { FilePicker } from '../../js/components/filePicker.js';
import { reportFactory } from '../../js/factories/reportFactory.js';
import { insFactory } from '../../js/factories/insFactory.js';
import { SpotifyAnalyzer } from './spotifyAnalyzer.js';

// CSS imports:
import './spotify.scss';
import website_icon from '../../assets/images/logos/spotify_inline.svg';

let instructions = new insFactory('spotify', document.getElementById('instructions-container'));
let rRender = new reportFactory('spotify');
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
  const data = analyzer.getData(fakeData);
  renderUserReport(data);
  renderStreamingReport(data);

  // scrolls down to the report
  rRender.reportContainer.scrollIntoView();
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
      textBold: Object.keys(data.streaming_data.skipped_songs).length,
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
  let topSongsList = getTopObjects(data.streaming_data.songs, 25).reverse();
  let topArtistsList = getTopObjects(data.streaming_data.artists, 25).reverse();
  let skippedSongsList = getTopObjects(data.streaming_data.skipped_songs, 25).reverse();


  let tablesData = [{
      icon: 'music',
      text: 'Most Played Songs',
      type: 'table',
      tableHeadings: ['Song', 'Plays'],
      tableData: topSongsList,
      tooltip: 'These are your top played songs for the last year.'
    },
    {
      icon: 'disc',
      text: 'Most Played Artists: ',
      type: 'table',
      tableHeadings: ['Artist', 'Plays'],
      tableData: topArtistsList,
      tooltip: 'These are your top played artists for the last year.'
    },
    {
      icon: 'skip-forward',
      text: 'Most Skipped Songs: ',
      type: 'table',
      tableHeadings: ['Song', 'Skips'],
      tableData: skippedSongsList,
      tooltip: 'These are the songs you skipped the most for the last year.'
    }
  ]

  const subreport = rRender.getSubreport('Streaming History Report');
  rRender.add(reportItems, 'icon-list', subreport);
  // rRender.add(topSongs, 'list', subreport);
  rRender.add(tablesData, 'table', subreport);
  rRender.getSubreportGraphContainer('graphs-container-streaming', subreport);

  // hourly posts chart
  rRender.addGraph(subreport, {
    type: 'clock',
    title: 'Listens by Hour of Day',
    data: data.streaming_data.time.hourly,
    clock_labels: ['listens', 'listened'],
    css_label: 'stream-graph',
    size: 'medium'
  });

  // daily songs chart
  rRender.addGraph(subreport, {
    type: 'bar',
    title: 'Song Listens by Day of the Week',
    data: data.streaming_data.time.weekly,
    labels: DAYS,
    css_label: 'stream-graph',
    size: 'medium'
  });

  // monthly songs chart
  rRender.addGraph(subreport, {
    type: 'bar',
    title: 'Song Listens by Month',
    data: data.streaming_data.time.monthly,
    labels: MONTHS,
    css_label: 'stream-graph',
    size: 'medium'
  });

  // cumulative monthly listens
  // rRender.addGraph(subreport, {
  //   type: 'bar',
  //   title: 'Cumulative Listens by Month',
  //   data: data.streaming_data.time.monthly,
  //   labels: MONTHS,
  //   css_label: 'stream-graph',
  //   size: 'medium'
  // });

  // stream heatmap graph
  Object.keys(data.streaming_data.time.heatmap).forEach((year) => {

    // calculate the year
    data.streaming_data.time.heatmap[year].start = new Date(year, 0, 1)
    data.streaming_data.time.heatmap[year].end = new Date(year, 11, 31)

    rRender.addGraph(subreport, {
      type: 'heatmap',
      data: data.streaming_data.time.heatmap[year],
      title: `Streaming ${year}`,
      css_label: 'stream-graph',
      size: 'huge'
    });
  });

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
