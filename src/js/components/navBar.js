// import { createImage } from '../helpers.js';
// import logo from '../../images/icons/logo.svg';
import '../../styles/components/navbar.scss';

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
    // let background = document.createElement('div');
    this.navbar = document.createElement('div');

    // create buttons
    if (this.index) {
      this.logoRootUrl = this.createNavButton('dataforme', '#website-cnt');
      this.logoRootUrl.classList.remove('nav-item');
      this.createNavButton('about', '#about', {
        subitem: true,
        navbtn: true
      });
    }
    else {
      this.logoRootUrl = this.createNavButton('dataforme', '/');
      this.logoRootUrl.classList.remove('nav-item');
      this.createNavButton('about', '/#about', {
        subitem: true,
        navbtn: true
      });
      this.createNavButton('analyze', '#report', {
        subitem: true,
        navbtn: true
      });
    }

    // styles
    this.self.id = 'nav';
    this.navbar.id = 'nav-root';
    this.logoCont = document.createElement('div');
    this.logoCont.id = 'nav-logo';

    // add menu button
    this.menuBtn = document.createElement('div');
    this.menuBtn.innerHTML = '.xyz';
    this.menuBtn.id = 'btn-logo';
    this.menuBtn.role = 'button';
    this.menuBtn.addEventListener('click', function() {
      for(let i = 0; i < this.navbarBtns.length; i++) {
        this.navbarBtns[i].classList.remove('nav-hidden');
        this.navbarBtns[i].classList.remove('nav-normal');
        this.navbarBtns[i].classList.add('nav-expand');
      } 
      this.logoCont.classList.add('nav-expand');
    }.bind(this));

    this.logoCont.appendChild(this.logoRootUrl);
    this.logoCont.appendChild(this.menuBtn);
    this.navbar.appendChild(this.logoCont);
    
    this.logoCont.classList.add('nav-normal');

    // append btns to navbar
    this.navbarBtns.forEach((btn) => {
      btn.classList.add('nav-hidden');
      this.navbar.appendChild(btn);
    });
    this.self.appendChild(this.navbar);

    // setup class variables
    this.navbarHeight = this.navbar.scrollHeight;
  }

  // enables smooth scroll on all pages the navbar is loaded.
  // TODO: need to test browser compatibility.
  setupSmoothScroll() {
    let anchorElements = document.querySelectorAll('a[href^="#"]');
    // console.log(anchorElements);
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
      // for (var i = 0, len = this.navbarBtns.length; i < len; i++) {
      //   this.navbarBtns[i].classList.add('nav-aside');
      //   this.navbarBtns[i].classList.remove('nav-up');
      // }
      this.navbarBtns.forEach((btn) => {
        btn.classList.add('nav-hidden');
      });
      this.logoCont.classList.remove('nav-normal');
      this.logoCont.classList.remove('nav-expand');
      this.logoCont.classList.add('nav-hidden');
      // this.self.classList.remove('nav-up');
    } else {
      // Scroll Up
      // check is there incase the user scolls past the documents heigh??
      // apparently possible on a mac
      // if(curPos + window.outerHeight < document.body.scrollHeight ) {
      // for (var i = 0, len = this.navbarBtns.length; i < len; i++) {
      //   this.navbarBtns[i].classList.remove('nav-aside');
      //   this.navbarBtns[i].classList.add('nav-up');
      // }
      // }
      this.logoCont.classList.remove('nav-hidden');
      this.logoCont.classList.add('nav-normal');
      // this.logoCont.classList.remove('nav-half-aside');
      // this.self.classList.add('nav-up');
    }

    this.lastScroll = curPos;
  }

  createNavButton(text, link, options) {
    let item = document.createElement('a');
    item.classList.add('nav-item');
    item.classList.add('nav-link');
    item.innerHTML = text;
    item.href = link;

    if (options) {
      if (options.subitem) item.classList.add('nav-sub-item');
      if (options.navbtn) this.navbarBtns.push(item);
    }

    return item;
  }
}

export { NavBar };
