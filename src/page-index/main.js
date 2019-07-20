//TODO: use babel instead?
// import { Chart } from 'frappe-charts'; why doesn this work??
// TODO: import all from directory?
import facebook from '../images/icons/facebook.svg';
import spotify from '../images/icons/spotify.svg';
import tinder from '../images/icons/tinder.svg';
import '../styles/index.scss';
import '../styles/main.scss';

renderContent();

function renderContent() {
   loadWebsites();
   // renderIcons()
}

function loadWebsites() {
   let globalContainer = document.getElementById('site');
   let routes = {
      'facebook': facebook,
      'spotify': spotify,
      'tinder': tinder
   };

   Object.keys(routes).forEach((key) => {
      let link = createLink(key);
      let icon = createIcon(routes[key], key);

      let imgContainer = document.createElement('div');
      imgContainer.appendChild(icon);
      link.appendChild(imgContainer);
      globalContainer.appendChild(link);
   });
}

function createLink(to) {
   let linkWrap = document.createElement('a');

   linkWrap.classList.add('website-item');
   linkWrap.id = to;
   linkWrap.href = `./${to}.html`;

   return linkWrap;
}

function createIcon(iconName) {
   var img = new Image();
   img.src = iconName;
   return img;
}
