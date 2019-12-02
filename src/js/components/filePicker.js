// TODO: needs to change style once zipfile is uploaded.
// Style imports:
import '../../styles/components/filePicker.scss';

// Icon imports TODO: DOES THIS DOUBLE IMPORT?
import iupload from '../../assets/images/report-icons/file-plus_inline.svg';

export class FilePicker {
  constructor(parent) {
    this.self = document.createElement('div');
    this.self.classList.add('filepicker-wrapper');
    this.self.innerHTML = `\
          <label for='file-upload' id='visual' class='file-upload-field'>\
              <div id='report-upload-icon'></div>\
              <p class='fp-text fp-strong'>Select Files</p>\
              <p class='fp-text'>or Drag and Drop</p>\
          </label>\
          <input id='file-upload' type='file'/>\
          `;

    // get icon from the above html
    this.selfVisual = this.self.children[0];
    let iconContainer = this.selfVisual.children[0];
    iconContainer.innerHTML = iupload;
    parent.appendChild(this.self);

    // eventlisteners for styling
    this.selfVisual.addEventListener('mouseenter', this.fileDragHover, false);
    this.selfVisual.addEventListener('mouseleave', this.fileDragHover, false);
    this.selfVisual.addEventListener('dragover', this.fileDragHover, false);
    this.selfVisual.addEventListener('dragleave', this.fileDragHover, false);
  }

  onUpload(callback) {
    // to attach an action 
    this.input = this.self.children[1];
    let fileSelectHandler = this.getFileSafe.bind(this, callback); 

    this.input.addEventListener('change', fileSelectHandler, false); 
    this.selfVisual.addEventListener('drop', fileSelectHandler, false);
  }

  //TODO: maybe a helper if used elsewhere
  // callback and event
  getFileSafe(callback, e) {
    e.stopPropagation();
    e.preventDefault();

    var files = e.target.files || e.dataTransfer.files;
    // file isn't a zip file.
    // TODO should also check for file size
    // once the limitations of the script are more clear
    if (files.length == 1 && files[0].name.endsWith('.zip')) {
      callback(files[0]);
    }
    else {
      alert('Please upload a zip file');
    }
  }

  // changes style on drag events in the file picker
  fileDragHover(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.target.id == 'visual') {
      if (e.type == 'dragover' || e.type == 'mouseenter') {
        e.target.classList.add('file-upload-field-hover');
      }
      else {
        e.target.classList.remove('file-upload-field-hover');
      }
    }
  }
}
