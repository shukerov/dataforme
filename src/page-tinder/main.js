import '../styles/tinder.scss';

// JS imports:
import { TinderAnalyzer } from '../js/analyzers/tinderAnalyzer.js';
import { NavBar } from '../js/components/navBar.js';
import { FilePicker } from '../js/components/filePicker.js';
import { reportFactory } from '../js/factories/reportFactory.js';
import { insFactory } from '../js/factories/insFactory.js';

let test = new insFactory('tinder', document.getElementById('instructions-container'));
let rRender = new reportFactory('red');
let nBar = new NavBar();
let fPicker = new FilePicker(rRender.reportContainer);
let analyzer = new TinderAnalyzer(renderFacebookReport);
