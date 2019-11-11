import '../../styles/components/instructions.scss';
import WEBSITES from '../constants.js';

// Import assets
import ileft from '../../images/components/chevron-left.svg';
import iright from '../../images/components/chevron-right.svg';

// locations and data for the instructions
const insns = {
  'facebook': [
    {
      image: './step1-web.jpg',
      ins: "Open your browser of choice, and enter 'facebook.com' in the address bar."
    },
    {
      image: './step2-web.jpg',
      ins: 'Click in the upper right corner, and open settings.'
    },
    {
      image: './step3-web.jpg',
      ins: "Click on 'Your Facebook information' in the side bar menu."
    },
    {
      image: './step4-web.jpg',
      ins: "Click on 'View' under the 'Download your information' tab."
    },
    {
      image: './step5-web.jpg',
      ins: "1. Select JSON for data format.<br> 2. Select media quality (recommended low if you want a small filesize).<br> 3. Finally click 'Create File'."
    },
    {
      image: './step6-web.jpg',
      ins: "In a couple of hours check your Facebook notifications, and save your file. Store it somewhere safe."
    }
  ],
  'tinder': [ 
    {
      image: './step1-web.jpg',
      ins: "Open your browser of choice, and enter 'tinder.com' in the address bar."
    }
  ]
}

class insFactory {
  constructor(website, parent) {
    // TODO: do you really need this?
    this.parent = parent;
    // contains all the instructions
    this.insContainer = document.createElement('div');
    this.insContainer.classList.add('instruction-wrapper');

    //TODO: need a check if website is the the websites constants!
    // figure out which instructions to load
    if (website === 'facebook') {
      this.imagesPath = require.context('../../images/fb-instructions', true);
      this.instructions = insns['facebook'];
    }
    else if (website === 'tinder') {
      this.imagesPath = require.context('../../images/tinder-instructions', true);
      this.instructions = insns['tinder'];
    }

    // sets the correct path for each image
    this.instructions.map((ins) => {
      ins.image = this.imagePath(ins.image);
      return ins;
    });

    // current slide
    this.currentSlide = 0;
    this.maxSlide = this.instructions.length - 1;
    this.slides = [];
    this.dots = [];
    this.createInstructions();
    this.createDots();

    // makes the first instruction visible
    this.renderSlide(0);
    parent.appendChild(this.insContainer);
  }

  // TODO: get rid of this function and just call imagesPath when creating slides
  imagePath(name) {
    return this.imagesPath(name, true)
  }

  renderSlide(action) {
    this.slides[this.currentSlide].style.display = 'none';
    this.dots[this.currentSlide].classList.remove('slide-dot-active');

    if (action == 'prev') {
      this.currentSlide--;
    }
    else if (action == 'next') {
      this.currentSlide++;
    }
    else if (!isNaN(action) && action <= this.maxSlide && action >= 0) {
      this.currentSlide = action;
      this.slides[this.currentSlide].style.display = 'block';
      this.dots[this.currentSlide].classList.add('slide-dot-active');
      return;
    }
    else {
      throw `Action '${action}' unknown. Could not render slide`;
    }

    if (this.currentSlide < 0) {
      this.currentSlide = this.maxSlide;
    }
    else if (this.currentSlide > this.maxSlide) {
      this.currentSlide = 0;
    }

    this.slides[this.currentSlide].style.display = 'block';
    this.dots[this.currentSlide].classList.add('slide-dot-active');
  }

  createInstructions() {
    let insWrapper = document.createElement('div');
    insWrapper.classList.add('slideshow-wrapper');
    let cardContainer = document.createElement('div');
    cardContainer.classList.add('slide-card-container');

    for (let i = 0; i < this.instructions.length; i++) {
      // create instruction step and add style
      let slide = document.createElement('div');
      slide.classList.add('slide-card');
      this.slides.push(slide);

      // create the image
      let slideImg = new Image();
      let slideText = this.createInstructionsText(i);
      slideImg.src = this.instructions[i].image;

      slide.appendChild(slideImg);
      slide.appendChild(slideText);
      cardContainer.appendChild(slide);
    }

    let buttons = this.createSliderButtons();
    insWrapper.appendChild(buttons[0]);
    insWrapper.appendChild(cardContainer);
    insWrapper.appendChild(buttons[1]);
    this.insContainer.appendChild(insWrapper);
  }

  createInstructionsText(insNum) {
    let textContainer = document.createElement('div');
    textContainer.classList.add('slide-card-text');

    let insStepIndicator = document.createElement('div');
    insStepIndicator.classList.add('step-indicator');
    insStepIndicator.innerHTML = `Step ${insNum+1}/${this.instructions.length}`;

    let insText = document.createElement('p');
    insText.innerHTML = this.instructions[insNum].ins;

    textContainer.appendChild(insStepIndicator);
    textContainer.appendChild(insText);
    return textContainer;
  }

  // creates the buttons for next and previous buttons
  createSliderButtons() {
    let nextBtn = document.createElement('a');
    let prevBtn = document.createElement('a');
    let prevBtnSym = new Image();
    let nextBtnSym = new Image();
    prevBtnSym.src = ileft;
    nextBtnSym.src = iright;
    prevBtn.appendChild(prevBtnSym);
    nextBtn.appendChild(nextBtnSym);
    prevBtn.classList.add('prev-btn');
    nextBtn.classList.add('next-btn');
    prevBtn.onclick = this.renderSlide.bind(this, 'prev');
    nextBtn.onclick = this.renderSlide.bind(this, 'next');

    // arrow left and right should switch between slides
    document.addEventListener('keydown', this.arrowKeyHandler.bind(this));

    return [prevBtn, nextBtn];
  }

  arrowKeyHandler(event) {
    // set true if the event was handled
    let eventHandled = false;

    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }

    switch(event.key) {
      case 'ArrowLeft':
        this.renderSlide.call(this, 'prev');
        eventHandled = true;
        break;
      case 'ArrowRight':
        this.renderSlide.call(this, 'next');
        eventHandled = true;
        break;
      default:
        return;
    }

    // Cancel the default action to avoid it being handled twice
    if (eventHandled) {
      event.preventDefault();
    }
  }

  createDots() {
    let dotContainer = document.createElement('div');
    dotContainer.classList.add('dot-container');

    for(let i = 0; i < this.instructions.length; i++) {
      let dot = document.createElement('span');
      dot.classList.add('slide-dot');
      dot.onclick = this.renderSlide.bind(this, i);
      
      this.dots.push(dot);
      dotContainer.appendChild(dot);
    }
    
    // add to the instructions container
    this.insContainer.appendChild(dotContainer);
  }
}

export { insFactory };
