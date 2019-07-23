// Style imports:
import '../styles/main.scss';
import '../styles/index.scss';

// Assets:
import facebook from '../images/icons/facebook.svg';
import spotify from '../images/icons/spotify.svg';
import tinder from '../images/icons/tinder.svg';

// JS imports:
import { createImage } from '../js/helpers.js';
import { NavBar } from '../js/components/navBar.js';

renderContent();

function renderContent() {
   let globalContainer = document.getElementById('site');
   let websiteContainer = document.getElementById('website-cnt');
   let aboutContainer = document.getElementById('about');

   new NavBar(globalContainer, true);
   loadWebsites(websiteContainer); // globalContainer);
   loadAbout(aboutContainer);
}

function loadAbout(parent) {
   let textContainer = document.createElement('div');

   // styles
   textContainer.classList.add('about-content-container');

   // website content. Might be wise to store this in a json file?
   // TODO: even better idea just dump it in the html and hide the element.
   textContainer.innerHTML = "\
      <h1>About DataForMe:</h1>\
      <p>\
         <strong>TLDR</strong>: A website that teaches you how to practice\
         your Right of Access, and optionally analyzes your data offline.\
      </p>\
      <p>\
         Since the GDPR was passed in 2016, software providers need to\
         accommodate the 'Right of Access' for their users.\
         What does this mean? It means that <strong>YOU</strong>\
         can get a copy of the data that you generate.\
      </p>\
      <p>\
         The goal of this website is to serve as a wiki of how to download\
         your data from different web service providers. Click on one of the\
         tiles above to learn how to do so.\
      </p>\
      <p>\
         Once you request a copy, you might have to wait up to a\
         few days to receive that copy.\
      </p>\
      <p>\
         Afterwards, you can analyze your data here, and hopefully gain some\
         insight about how you interact with these web services. By now you\
         are probably thinking: 'Why would I ever upload my information to the\
         web?'\
      </p>\
      <p>\
         If you didn't ask yourself that question then you are surfing the web\
         a tad bit carelessly. Anyway rest assured. This website is client side\
         only, this means that it can work offline once you have loaded this\
         page. Your data won't ever leave your computer, and will be analyzed\
         inside your browser. Still don't trust it? Good. Disconnect from the\
         internet when you add your file to be analyzed.\
      </p>\
      <h2>Why I built this:</h2>\
      <p>\
         I am a college student studying abroad, who got genuinely excited about his\
         right of access to data. I also needed a senior project so I can graduate,\
         and this is it! I hope you find this somewhat useful. The code is\
         open-source and you can look through it or contribute here.\
      </p>";

   parent.appendChild(textContainer);

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
