// JS imports:
import { NavBar } from '../js/components/navBar.js';
import { FilePicker } from '../js/components/filePicker.js';
import { reportFactory } from '../js/factories/reportFactory.js';
import { insFactory } from '../js/factories/insFactory.js';
import { InstagramAnalyzer } from './instagramAnalyzer.js';

// CSS imports:
import './instagram.scss';
import website_icon from '../assets/images/icons/instagram_inline.svg';

let instructions = new insFactory('instagram', document.getElementById('instructions-container'));
let rRender = new reportFactory('instagram');
let nBar = new NavBar();
let fPicker = new FilePicker(document.getElementById('filepicker'));
let analyzer = new InstagramAnalyzer(renderReport);

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
  // const data = analyzer.getData(fakeData);
  // renderUserReport(data);
}

function renderUserReport(data) {
  // let reportItems = [
  //   {
  //     icon: 'calendar',
  //     text: 'Date Joined: ',
  //     textBold: formatDate(data.date_joined),
  //     tooltip: 'The date that you created a Tinder account'
  //   }
  // ]

  // const subreport = rRender.getSubreport(data.name);
  // rRender.add(reportItems, 'icon-list', subreport);
}
