import { createImage } from '../helpers.js';
import '../../styles/components/navbar.scss';
import logo from '../../images/icons/logo.svg';

// TODO: needs a refactor. Create About and CreateLogo are pretty much identical
class NavBar {
   constructor(parent, index=false) {
      this.that = 0;
      this.self = document.createElement('nav');
      this.index = index;
      
      this.setup();

      parent.appendChild(this.self);
   }

   setup() {
      let background = document.createElement('div');
      let root = document.createElement('div');

      // all for logo
      let logoItem = this.createLogo();
      let aboutItem = this.createAbout();

      // styles
      this.self.id = 'nav';
      root.id = 'nav-root';
      background.id = 'nav-bg';

      // add to self
      root.appendChild(logoItem);
      root.appendChild(aboutItem);
      this.self.appendChild(background);
      this.self.appendChild(root);
   }

   createNavItem(innerHTML, href, scrlToDivId) {
      let item = document.createElement('a');
      item.classList.add('nav-item');
      item.innerHTML = innerHTML;
      // item.href = href;

      // item.addEventListener('click', () => {
      //    // let scrollTo = document.getElementById(scrlToDivId).scrollHeight;
      //    window.scrollTo({top: 50, behavior: 'smooth'});
      // });

      return item;
   }

   createAbout() {
      let itemCont = this.createNavItem('about', '/#about', 'about');
      if (this.index)
      {
         itemCont.addEventListener('click', () => {
            let scrollTo = document.getElementById('about').scrollHeight;
            window.scrollTo({top: scrollTo, behavior: 'smooth'});
         });
      }
      else {
         itemCont.href = '/#about';
      }
      // let itemCont = document.createElement('a');

      // let aboutItem = this.createNavItem();
         
      // itemCont.classList.add('nav-item');
      itemCont.classList.add('nav-sub-item');
      // itemCont.innerHTML = 'about';
      // itemCont.href = '/#about';

      // itemCont.appendChild(aboutItem);
      return itemCont;
   }

   createLogo() {
      // let logoItem = this.createNavItem();
      let logoCont = this.createNavItem('dataforme', '/#', 'site');
      if (this.index)
      {
         logoCont.addEventListener('click', () => {
            window.scrollTo({top: 0, behavior: 'smooth'});
         });
      }
      else {
         logoCont.href = '/#';
      }
      // let logoCont = document.createElement('a');
      // let logoImage = createImage(logo);

      // logoCont.classList.add('nav-item');
      // logoCont.innerHTML = 'dataforme';
      // logoCont.href = '/#';
      logoCont.id = 'nav-logo';

      return logoCont;
   }

   // show() {
      
   // }
}

export { NavBar };
