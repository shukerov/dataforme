// Style imports:
import './index.scss';

// Assets:
import facebook from '../../assets/images/logos/facebook_inline.svg';
import spotify from '../../assets/images/logos/spotify_inline.svg';
import tinder from '../../assets/images/logos/tinder_inline.svg';

// JS imports:
import { NavBar } from '../../js/components/navBar.js';
import { isMobile, consoleMessage } from '../../js/helpers.js'
import bodymovin from '../../js/lottie.min.js';

// print a console log friendly message
consoleMessage();
renderContent();
playIndexAnimations();

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

function playIndexAnimations() {
    let animationContainer = document.getElementById('lottie-index-animation');
    let animationData = {
            container: animationContainer,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: './multi-tasking.json'
        };

    bodymovin.loadAnimation(animationData);
}

if (isMobile) {
  // get the viewport height and multiply it by 1% to get a value for a vh unit
  const vh = window.innerHeight * 0.01;
  // set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
