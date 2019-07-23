// import { createImage } from '../helpers.js';
// import '../../styles/components/navbar.scss';
// import logo from '../../images/icons/logo.svg';

// TODO: needs a refactor. Create About and CreateLogo are pretty much identical
class NavBar {
   constructor(parent, index=false) {
      // boolean that determines if navbar is loaded on index page
      this.index = index; 
      // contains the button elements in the navbar
      this.navbarBtns = []
      // gets website html element, needed for setting up scrolling event
      this.website = document.getElementById('site');
      // boolean, true when user scrolls
      this.scrolled = false;
      this.lastScroll = 0;
      this.delta = 5;

      // create nav
      this.self = document.createElement('nav');
      
      this.setup();
      this.setScrolling();

      parent.appendChild(this.self);
      this.setupSmoothScroll();
   }

   setup() {
      console.log(this.index);
      let background = document.createElement('div');
      this.navbar = document.createElement('div');

      // create buttons
      if (this.index) {
         this.createNavButton('dataforme', '#website-cnt');
         this.createNavButton('about', '#about');
      }
      else {
         this.createNavButton('dataforme', '/');
         this.createNavButton('about', '/#about');
      }

      // styles
      this.self.id = 'nav';
      this.navbar.id = 'nav-root';
      this.navbarBtns[0].id = 'nav-logo';
      this.navbarBtns[1].classList.add('nav-sub-item');
      background.id = 'nav-bg';

      // append btns to navbar
      this.navbarBtns.forEach((btn) => {
         this.navbar.appendChild(btn);
      });
      this.self.appendChild(background);
      this.self.appendChild(this.navbar);

      // setup class variables
      this.navbarHeight = this.navbar.scrollHeight;
   }

   // enables smooth scroll on all pages the navbar is loaded.
   // TODO: need to test browser compatibility.
   setupSmoothScroll() {
      let anchorElements = document.querySelectorAll('a[href^="#"]');
      console.log(anchorElements);
      anchorElements.forEach(anchor => {
         anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
               behavior: 'smooth'
            });
         });
      });
   }

   setScrolling() {

      setInterval(function() {
         if (this.scrolled) {
            this.scrollingEvent();
            this.scrolled = false;
         }
      }.bind(this), 250);

      this.website.addEventListener('scroll', function(e) {
         this.scrolled = true;
      }.bind(this));
   }

   scrollingEvent() {
      let curPos = this.website.scrollTop;

      if(Math.abs(this.lastScroll - curPos) <= this.delta)
         return;

      // If they scrolled down and are past the navbar, add class .nav-up.
      if (curPos > this.lastScroll && curPos > this.navbarHeight){
         // Scroll Down
         for (var i = 0, len = this.navbarBtns.length; i < len; i++) {
            this.navbarBtns[i].classList.add('nav-aside');
            this.navbarBtns[i].classList.remove('nav-up');
         }
      } else {
         // Scroll Up
         // check is there incase the user scolls past the documents heigh??
         // apparently possible on a mac
         // if(curPos + window.outerHeight < document.body.scrollHeight ) {
         for (var i = 0, len = this.navbarBtns.length; i < len; i++) {
            this.navbarBtns[i].classList.remove('nav-aside');
            this.navbarBtns[i].classList.add('nav-up');
         }
         // }
      }

      this.lastScroll = curPos;
   }

   createNavButton(text, link) {
      let item = document.createElement('a');
      item.classList.add('nav-item');
      item.innerHTML = text;
      item.href = link;
      
      this.navbarBtns.push(item);
      return item;
   }
}

export { NavBar };
