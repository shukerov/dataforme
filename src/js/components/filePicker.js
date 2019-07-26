// TODO: needs to change style once zipfile is uploaded.
// Style imports:
import '../../styles/components/filePicker.scss';

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
    parent.appendChild(this.self);
    // return parent ? (parent.appendChild(this.self)) : (this.self);
  }

  onUpload(callback) {
    // to attach an action 
    this.input = this.self.children[1];
    this.input.onchange = this.getFileSafe.bind(this, callback); 
  }

  getFileSafe(callback) {
    // file isn't a zip file. TODO should also check for file size
    // once the limitations of the script are more clear
    if (this.input.files[0].name.endsWith('.zip')) {
      callback(this.input.files[0]);
    }
    else {
      alert('Please upload a zip file');
    }
  }
}
