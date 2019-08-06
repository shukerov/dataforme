import '../../styles/components/instructions.scss';
import WEBSITES from '../constants.js';

// locations and data for the instructions
// TODO: check if this bundles all images
const FB_INS_PATH = '../images/fb-instructions';
const insns = {
  'facebook': [
    {
      image: './1.png',
      ins: 'Click on Settings'
    },
    {
      image: './2.jpg',
      ins: 'do this then'
    },
    {
      image: './3.png',
      ins: 'do this when'
    },
    {
      image: './4.jpg',
      ins: 'do this how'
    }
  ]
}

class insFactory {
  constructor(website, parent) {
    this.parent = parent;

    //TODO: need a check if website is the the websites constants!
    // figure out which instructions to load
    if (website === 'facebook') {
      this.imagesPath = require.context('../../images/fb-instructions', true);
      this.instructions = insns['facebook'];
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
  }

  // TODO: get rid of this function and just call imagesPath when creating slides
  imagePath(name) {
    return this.imagesPath(name, true)
  }

  renderSlide(action) {
    this.slides[this.currentSlide].style.display = 'none';

    if (action == 'prev') {
      this.currentSlide--;
    }
    else if (action == 'next') {
      this.currentSlide++;
    }

    if (this.currentSlide < 0) {
      this.currentSlide = this.maxSlide;
    }
    else if (this.currentSlide > this.maxSlide) {
      this.currentSlide = 0;
    }

    this.slides[this.currentSlide].style.display = 'block';
  }

  createInstructions() {
    let insContainer = document.createElement('div');
    insContainer.classList.add('slideshow-container');

    for (let i = 0; i < this.instructions.length; i++) {
      // create instruction step and add style
      let slide = document.createElement('div');
      slide.classList.add('slide-item');
      this.slides.push(slide);

      // create the image
      let slideImg = new Image();
      let slideText = document.createElement('div');

      slideText.classList.add('slide-text');
      // add image source and instruction text
      slideText.innerHTML = this.instructions[i].ins;
      slideImg.src = this.instructions[i].image;

      slide.appendChild(slideImg);
      slide.appendChild(slideText);
      insContainer.appendChild(slide);
    }

    // slideshow buttons setup TODO: extract in function if too big
    let nextBtn = document.createElement('a');
    let prevBtn = document.createElement('a');
    prevBtn.innerHTML = '&#10094;';
    nextBtn.innerHTML = '&#10095;';
    prevBtn.classList.add('prev-btn');
    nextBtn.classList.add('next-btn');
    prevBtn.onclick = this.renderSlide.bind(this, 'prev');
    nextBtn.onclick = this.renderSlide.bind(this, 'next');
    insContainer.appendChild(prevBtn);
    insContainer.appendChild(nextBtn);

    this.parent.appendChild(insContainer);
    this.renderSlide();
  }
}

export { insFactory };
