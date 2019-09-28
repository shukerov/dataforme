// Style imports:
import '../styles/index.scss';

// Assets:
import facebook from '../images/icons/facebook_inline.svg';
import spotify from '../images/icons/spotify_inline.svg';
import tinder from '../images/icons/tinder_inline.svg';

// JS imports:
import { NavBar } from '../js/components/navBar.js';

renderContent();

function renderContent() {
  let globalContainer = document.getElementById('site');
  let websiteContainer = document.getElementById('website-cnt');
  let aboutContainer = document.getElementById('about');

  new NavBar(true);
  loadWebsites(websiteContainer); // globalContainer);
}

function loadWebsites(globalContainer) {
  let routes = {
    'facebook': facebook,
    'spotify': spotify,
    'tinder': tinder
  };

  Object.keys(routes).forEach((key) => {
    let link = createLink(key);

    let iconContainer = document.createElement('div');
    iconContainer.innerHTML = routes[key];
    link.appendChild(iconContainer);
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
