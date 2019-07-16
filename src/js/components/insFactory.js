import '../../styles/components/instructions.scss';
import WEBSITES from '../constants.js';

// locations and data for the instructions
const FB_INS_PATH = '../images/fb-instructions';
const insns = {
   'facebook': [
      {
         image: './1.jpg',
         ins: 'do this now'
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
         this.images = require.context('../../images/fb-instructions', true);
         this.instructions = insns['facebook'];
      }
      // TODO: add other websites as you go

      this.instructions.map((ins) => {
         ins.image = this.imagePath(ins.image);
         return ins;
      });
   }

   imagePath(name) {
      return this.images(name, true)
   }

   createInstructions() {
      var insContainer = document.createElement('div');
      insContainer.classList.add = 'insns';

      for (var i = 0; i < this.instructions.length; i++) {
         // create instruction step and add style
         var step = document.createElement('div');
         step.className = 'ins-step';

         // create the image
         var img = new Image();
         var ins = document.createElement('p');
         
         // add image source and instruction text
         ins.innerHTML = this.instructions[i].ins;
         img.src = this.instructions[i].image;

         step.appendChild(img);
         step.appendChild(ins);
         insContainer.appendChild(step);
      }

      this.parent.appendChild(insContainer);
   }
}

export { insFactory };
