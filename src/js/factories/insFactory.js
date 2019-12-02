import '../../styles/components/instructions.scss';
import { WEBSITES } from '../constants.js';

// Import assets
import ileft from '../../assets/images/components/chevron-left.svg';
import iright from '../../assets/images/components/chevron-right.svg';

class insFactory {
  constructor(website, parent) {
    // TODO: do you really need this?
    this.parent = parent;
    // contains all the instructions
    this.insContainer = document.createElement('div');
    this.insContainer.classList.add('instruction-wrapper');

    //TODO: need a check if website is the the websites constants!
    // figure out which instructions to load
    let ins_context = null;
    if (!WEBSITES.includes(website)) {
      throw `Please add '${website}' to WEBSITES constant in /src/js/constants.js`
    }

    if (website === 'facebook') {
      ins_context = require.context('../../page-facebook/instructions', true);
    }
    else if (website === 'tinder') {
      ins_context = require.context('../../page-tinder/instructions', true);
    }
    else if (website === 'spotify') {
      ins_context = require.context('../../page-spotify/instructions', true);
    }

    this.instructions = ins_context('./instructions.json');
    this.instructions.map((ins) => {
      ins.image = ins_context(ins.image, true);
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
    nextBtnSym.classList.add('ins-btn-image');
    prevBtnSym.classList.add('ins-btn-image');
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
