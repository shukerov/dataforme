// JS imports:
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
let step3Card = document.getElementById('step-3');
let fPicker = new FilePicker(step3Card);
// let analyzer = new TinderAnalyzer(renderReport);

let websiteIcon = document.getElementById('website-icon');
websiteIcon.innerHTML = website_icon;

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
}
