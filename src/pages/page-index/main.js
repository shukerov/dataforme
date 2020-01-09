// Style imports:
import './index.scss';

// Assets:
import facebook from '../../assets/images/logos/facebook_inline.svg';
import spotify from '../../assets/images/logos/spotify_inline.svg';
import tinder from '../../assets/images/logos/tinder_inline.svg';

// JS imports:
import { NavBar } from '../../js/components/navBar.js';

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

// the functions below make the sure that 100vh is taken by the index page on mobile
// TODO: this should only be ran on mobile devices...
// TODO: it should be placed in a helper function
function setViewPortHeightVar() {
  // set the viewport height and multiply it by 1% to get a value for a vh unit
  let vh = window.innerHeight * 0.01;
  // set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setViewPortHeightVar();
window.addEventListener('resize', () => {
  setViewPortHeightVar();
});
