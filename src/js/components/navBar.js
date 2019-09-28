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
      for(let i = 0; i < this.navBtns.length; i++) {
        this.navBtns[i].classList.add('nav-hidden');
      }
      // this.logoCont.classList.remove('nav-normal');
      // this.logoCont.classList.remove('nav-expand');
      // this.logoCont.classList.add('nav-hidden');
    } else {
      // Scroll Up
      for(let i = 0; i < this.navBtns.length; i++) {
        this.navBtns[i].classList.remove('nav-hidden');
      }
      // this.logoCont.classList.remove('nav-hidden');
      // this.logoCont.classList.add('nav-normal');
    }

    this.lastScroll = curPos;
  }

  createNavButton(text, link, options) {
    let item = document.createElement('a');
    item.classList.add('nav-item');
    // item.classList.add('nav-link');
    item.innerHTML = text;
    item.href = link;

    if (options) {
      if (options.subitem) item.classList.add('nav-sub-item');
    }
    this.self.appendChild(item);

  }
}

export { NavBar };
