import '../styles/tinder.scss';

// JS imports:
import { formatDate } from '../js/analyzers/analyzerHelpers.js';
import { TinderAnalyzer } from '../js/analyzers/tinderAnalyzer.js';
import { NavBar } from '../js/components/navBar.js';
import { FilePicker } from '../js/components/filePicker.js';
import { reportFactory } from '../js/factories/reportFactory.js';
import { insFactory } from '../js/factories/insFactory.js';

let test = new insFactory('tinder', document.getElementById('instructions-container'));
let rRender = new reportFactory('red');
let nBar = new NavBar();
let fPicker = new FilePicker(rRender.reportContainer);
let analyzer = new TinderAnalyzer(renderReport);

// TODO: refactor as helper
let previewBtn = document.getElementById('nav-preview-item');
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
  renderReportHeading(data);
}

function renderReportHeading(data) {
  let swipeData = [
    {
      icon: 'thumbs-up',
      text: 'Number of Likes: ',
      textBold: data.num_likes,
      tooltip: 'The number of likes(right swipes) you have on Tinder.'
    },
    {
      icon: 'thumbs-down',
      text: 'Number of Passes: ',
      textBold: data.num_passes,
      tooltip: 'The number of passes(left swipes) you have on Tinder.'
    },
    {
      icon: 'heart',
      text: 'Number of Matches: ',
      textBold: data.num_matches,
      tooltip: 'The number of matches you have on Tinder.'
    }
  ]

  let reportItems = [
    {
      icon: 'calendar',
      text: 'Date Joined: ',
      textBold: formatDate(data.date_joined),
      tooltip: 'The date that you created a Tinder account'
    },
    {
      icon: 'map-pin',
      text: 'Location: ',
      textBold: 'here',
      link: `https://www.google.com/maps/search/?api=1&query=${data.pos.lat},${data.pos.lon}`,
      tooltip: `Your location on ${data.pos.at}. NOTE: you need internet connection to view this link.`
    },
    {
      icon: 'image',
      text: 'Number of Pictures: ',
      textBold: data.photo_count,
      tooltip: 'The number of pictures you have on Tinder.'
    },
    {
      icon: 'mail',
      text: 'Email: ',
      textBold: data.email,
      tooltip: 'Your email address.'
    },
    {
      icon: 'phone-call',
      text: 'Phone: ',
      textBold: data.phone,
      tooltip: 'Your phone number.'
    },
    {
      icon: 'book',
      text: 'Education: ',
      textBold: data.education,
      tooltip: 'The education Tinder thinks you have.'
    },
    {
      icon: 'cake',
      text: 'Birthday: ',
      textBold: formatDate(data.birthday),
      tooltip: 'Your birthday.'
    },
    {
      icon: 'send',
      text: 'Number of Messages Sent: ',
      textBold: data.num_messages_sent,
      tooltip: 'The number of messages you have sent on Tinder.'
    },
    {
      icon: 'inbox',
      text: 'Number of Messages Received: ',
      textBold: data.num_messages_received,
      tooltip: 'The number of messages you have received on Tinder.'
    },
  ]

  const subreport = rRender.getSubreport(data.name);
  rRender.add(swipeData, 'big-icon-list', subreport);
  rRender.add(reportItems, 'icon-list', subreport);
}
