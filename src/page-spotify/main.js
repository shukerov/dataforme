// JS imports:
import { formatNum, secondsToHms } from '../js/helpers.js';
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
      tooltip: 'Number of songs you have skipped'
    }
  ]
  const subreport = rRender.getSubreport('Streaming History Report');
  rRender.add(reportItems, 'icon-list', subreport);
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
      icon: 'phone-call',
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
