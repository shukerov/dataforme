// Style imports:
import '../../assets/styles/components/filePicker.scss';
import iupload from '../../assets/images/report-icons/file-plus_inline.svg';

export class FilePicker {
  constructor(parent) {
    this.self = document.createElement('div');
    this.self.classList.add('filepicker-wrapper');

    this.label = document.createElement('label');
    this.label.htmlFor = 'file-upload';
    this.label.id = 'visual';
    this.label.classList.add('file-upload-field');

    this.input = document.createElement('input');
    this.input.type = 'file';
    this.input.id = 'file-upload';

    this.iconContainer = document.createElement('div');
    this.iconContainer.innerHTML = iupload;
    this.iconContainer.classList.add('fpicker-upload-icon');

    this.textBig = document.createElement('p');
    this.textBig.innerHTML = 'Select Files';
    this.textBig.classList.add('fp-text', 'fp-strong');

    this.textSmall = document.createElement('p');
    this.textSmall.innerHTML = 'or Drag and Drop';
    this.textBig.classList.add('fp-text');


    // append things
    this.label.appendChild(this.iconContainer);
    this.label.appendChild(this.textBig);
    this.label.appendChild(this.textSmall);
    this.self.appendChild(this.label);
    this.self.appendChild(this.input);
    parent.appendChild(this.self);

    // eventlisteners for styling
    this.label.addEventListener('mouseenter', this.fileDragHover, false);
    this.label.addEventListener('mouseleave', this.fileDragHover, false);
    this.label.addEventListener('dragover', this.fileDragHover, false);
    this.label.addEventListener('dragleave', this.fileDragHover, false);
  }

  onUpload(callback) {
    // to attach an action 
    let fileSelectHandler = this.getFileSafe.bind(this, callback); 

    this.input.addEventListener('change', fileSelectHandler, false); 
    this.label.addEventListener('drop', fileSelectHandler, false);
  }

  // callback and event
  getFileSafe(callback, e) {
    e.stopPropagation();
    e.preventDefault();

    const maxFileSize = 4 * 1024 * 1024 * 1024;
    let files = e.target.files || e.dataTransfer.files;

    if (files.length == 1 && !files[0].name.endsWith('.zip')) {
      alert('Please upload a zip file');
    }
    else if (files.length == 1 && files[0].size > maxFileSize) {
      alert('Your file is too big. Delete some media and try again.');
    }
    else {
      this.textBig.innerHTML = files[0].name;
      this.textSmall.innerHTML = `${files[0].size} bytes`;
      callback(files[0]);
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
