// Style imports:
import '../../styles/components/filePicker.scss';

// JS imports
import { createImage } from '../helpers.js';

// Icon imports TODO: DOES THIS DOUBLE IMPORT?
import iupload from '../../images/report-icons/file-plus_inline.svg';

export class FilePicker {
  constructor(parent) {
    this.self = document.createElement('div');
    this.self.classList.add('filepicker-wrapper');
    this.self.innerHTML = `\
          <label for='file-upload' class='file-upload-field'>\
              <div id='report-upload-icon'></div>
              Drag and drop or pick file here\
          </label>\
          <input id='file-upload' type='file'/>\
          `;
    // get icon from the above html
    let iconContainer = this.self.children[0].children[0];
    iconContainer.innerHTML = iupload;
    // let uploadIcon = createImage(iupload);
    // iconContainer.appendChild(uploadIcon);
    console.log(iconContainer);

    return parent ? (parent.appendChild(this.self)) : (this.self);
  }
}
