import { createImage } from '../helpers.js';
import '../../styles/components/navbar.scss';
import logo from '../../images/icons/logo.svg';

class NavBar {
   constructor(parent) {
      this.that = 0;
      this.self = document.createElement('nav');
      
      this.setup();

      parent.appendChild(this.self);
   }

   setup() {
      let background = document.createElement('div');
      let root = document.createElement('ul');

      // all for logo
      let logoItem = this.createLogo();
      // let aboutItem = createNavItem();
      // set up link 

      // styles
      this.self.id = 'nav';
      root.id = 'nav-root';
      background.id = 'nav-bg';

      // add to self
      root.appendChild(logoItem);
      this.self.appendChild(background);
      this.self.appendChild(root);
   }

   createNavItem() {
      let item = document.createElement('li');
      item.classList.add('nav-item');
      return item;
   }

   createLogo() {
      let logoItem = this.createNavItem();
      let logoCont = document.createElement('a');
      let logoImage = createImage(logo);

      logoCont.href = '/';
      logoCont.id = 'nav-logo';

      logoItem.appendChild(logoImage);
      logoCont.appendChild(logoItem);
      // logoItem.appendChild(logoCont);

      return logoCont;
   }

   // show() {
      
   // }
}

export { NavBar };
