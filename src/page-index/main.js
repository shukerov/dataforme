//TODO: use babel instead?
// import { Chart } from 'frappe-charts'; why doesn this work??
import { Chart } from 'frappe-charts/dist/frappe-charts.min.esm';
// TODO: import all from directory?
import facebook from '../images/icons/facebook.svg';
import spotify from '../images/icons/spotify.svg';
import '../styles/main.scss';

renderContent();

function renderContent() {
   renderIcons()
}

function renderIcons() {
   var iconDock = document.getElementById('icon-dock');
   var websites = [facebook, spotify];
   var routes = {
      'facebook': facebook,
      'spotify': spotify
   };

   Object.keys(routes).forEach((key) => {
      var icon = createIcon(routes[key], key);
      iconDock.appendChild(icon);
   });
}

function createIcon(iconName, link) {
   var linkWrap = document.createElement('a');
   var img = new Image();
   
   linkWrap.href = `./${link}.html`;
   linkWrap.className = 'index-icon';
   img.src = iconName;

   linkWrap.appendChild(img);

   return linkWrap;
}
