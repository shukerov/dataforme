import bodymovin from '../lottie.min.js';

class NavBar {
  constructor(index=false) {
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
    this.self = document.getElementById('nav');

    this.setup();

    this.setScrolling();

  }

  setup() {
    // TODO: refactor in a function
    let logoContainer = document.getElementById('logo');
    let animationData = {
            container: logoContainer,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            path: './logo-animation.json'
        };

    this.direction = 1;
    this.navState = 'discrete';
    this.logoAnim = bodymovin.loadAnimation(animationData);
    this.logoBtn = document.getElementById('nav-logoo');
    this.logoBtn.onclick= this.logoClickHandler.bind(this);

    this.navbar = document.getElementById('nav');

    // create buttons
    if (!this.index) {
      this.createNavButton('analyze', '#report', {
        subitem: true,
        navbtn: true
      });
    }

    // setup class variables
    this.navbarHeight = this.navbar.scrollHeight;
    this.navBtns = document.getElementsByClassName('nav-item');
  }

  logoClickHandler() {
    if (this.navState == 'discrete') {
      this.logoAnim.setDirection(1);
      this.logoAnim.play();
      this.showNavBtns();
      this.navState = 'open';
    }
    else {
      this.hideNavBtns();
      if(this.index) {
        document.querySelector(this.logoBtn.getAttribute('data-scroll')).scrollIntoView({
          behavior: 'smooth'
        });
      }
      else {
        window.location='/';
      }
    }

  }

  setScrolling() {

    setInterval(function() {
      if (this.scrolled) {
        this.scrollingEvent();
        this.scrolled = false;
      }
    }.bind(this), 250);

    window.addEventListener('scroll', function(e) {
      this.scrolled = true;
    }.bind(this));
  }

  hideNavBtns() {
    if (this.navState == 'open') {
      this.logoAnim.setDirection(-1);
      this.logoAnim.play();
      this.navState = 'discrete';
      for (let i = 0; i < this.navBtns.length; i++) {
        this.navBtns[i].classList.add('nav-discrete');
      }
    }
  }

  showNavBtns() {
    this.navState = 'open';

    for (let i = 0; i < this.navBtns.length; i++) {
      this.navBtns[i].classList.remove('nav-discrete');
    }
  }

  // navScrlUp() {
  //   this.navState = 'discrete';
  //   this.logoAnim.setDirection(-1);
  //   this.logoAnim.play();

  //   for (let i = 0; i < this.navBtns.length; i++) {
  //     this.navBtns[i].classList.add('nav-discrete');
  //   }
  // }

  scrollingEvent() {
    let curPos = pageYOffset;

    if(Math.abs(this.lastScroll - curPos) <= this.delta)
      return;

    // If they scrolled down and are past the navbar, add class .nav-up.
    if (curPos > this.lastScroll && curPos > this.navbarHeight){
      // Scroll Down
      this.hideNavBtns();
    } else {
      // Scroll Up
      this.hideNavBtns();
    }

    this.lastScroll = curPos;
  }

  createNavButton(text, link, options) {
    let item = document.createElement('a');
    item.classList.add('nav-item');
    item.innerHTML = text;
    item.href = link;

    if (options) {
      if (options.subitem) item.classList.add('nav-sub-item');
    }
    item.classList.add('nav-discrete');
    this.self.appendChild(item);
  }
}

export { NavBar };
