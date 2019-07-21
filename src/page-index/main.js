//TODO: use babel instead?
// import { Chart } from 'frappe-charts'; why doesn this work??
// TODO: import all from directory?
import facebook from '../images/icons/facebook.svg';
import spotify from '../images/icons/spotify.svg';
import tinder from '../images/icons/tinder.svg';
import { createImage, scrollManager } from '../js/helpers.js';
import { NavBar } from '../js/components/navBar.js';
import '../styles/index.scss';
import '../styles/main.scss';

renderContent();
let smng = new scrollManager();
smng.setScrolling();

function renderContent() {
   let globalContainer = document.getElementById('site');
   let websiteContainer = document.getElementById('website-cnt');
   let aboutContainer = document.getElementById('about');

   new NavBar(globalContainer, true);
   // loadWebsites(globalContainer);
   loadWebsites(websiteContainer); // globalContainer);
   loadAbout(aboutContainer);
   // renderIcons()
}

function loadAbout(parent) {
   // parent.scrollIntoView({behavior: 'smooth'});
   let aboutParagraph = document.createElement('p');
   aboutParagraph.innerHTML = 'A website I build for myself.';

   parent.appendChild(aboutParagraph);
}

function loadWebsites(globalContainer) {
   let routes = {
      'facebook': facebook,
      'spotify': spotify,
      'tinder': tinder
   };

   Object.keys(routes).forEach((key) => {
      let link = createLink(key);
      let icon = createImage(routes[key]);

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
