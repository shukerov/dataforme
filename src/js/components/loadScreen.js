import '../../assets/styles/components/loadScreen.scss';
import iconSuccess from '../../assets/images/components/check.svg';
import iconFailure from '../../assets/images/components/x.svg';
import bodymovin from '../lottie.min.js';

class LoadScreen {
  constructor(max = null) {
    this.current = 0; // current value of the progress
    this.max = max;   // maximum value that the progress can reach

    
    // Create html elements
    this.buildLoadScreen();

    // set loadScreen Status
    this.setStatus('init');

    // setup animation
    const animationData = {
            container: this.progressDelight,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: './hourglass-animation.json'
        };

    // starts animation
    bodymovin.loadAnimation(animationData);
  }

  // builds the loadScreen html elements and adds styles
  buildLoadScreen() {
    // covers entire screen
    this.progressOverlay = document.createElement('div');

    // modal containing progress bar components
    this.progress = document.createElement('div');

    // container containing loading animation
    this.progressDelight = document.createElement('div');

    // bar showing progress
    this.progressBar = document.createElement('div');
    this.progressBarInner = document.createElement('div');

    // shows the current status (switches b/w analysis and initializing)
    this.progressStatus = document.createElement('p');

    // shows which files were found and which werent
    this.progressFiles = document.createElement('div');
    
    // Add style to html elements
    this.progressOverlay.className = 'progress-overlay';
    this.progress.className = 'progress-modal';
    this.progressDelight.className = 'progress-animation';
    this.progressFiles.className = 'progress-files';
    this.progressBar.className = 'progress-bar';
    this.progressBarInner.className = 'progress-bar-inner';


    // append children
    this.progress.appendChild(this.progressDelight);
    this.progressBar.appendChild(this.progressBarInner);
    this.progress.appendChild(this.progressBar);
    this.progress.appendChild(this.progressStatus);
    this.progress.appendChild(this.progressFiles);
    this.progressOverlay.appendChild(this.progress);
  }

  // updates progress bar
  updateProgress() {
    // the maximum value of the progress bar needs to be set
    if (this.max) {
      this.current++;
      this.progressBarInner.style.width = `${Math.round(this.current / this.max * 100)}%`;
    }
  }

  setStatus(status) {
    if (status == 'init') {
      this.progressStatus.innerHTML = 'Initializing';
    }
    else {
      this.progressStatus.innerHTML = 'Analysing';
    }
  }

  // add filename fetched from zipfile
  addFilename(fileName) {
    const fileNameContainer = document.createElement('div');
    fileNameContainer.innerHTML = fileName;
    this.progressFiles.appendChild(fileNameContainer);
  }

  // add success or failure icon to filename
  addFilenameStatus(status) {
    const icon = new Image();
    icon.src = status ? iconSuccess : iconFailure;
    this.progressFiles.appendChild(icon);
  }

  // shows progress bar
  show() {
    // prevent scrolling when loadScreen is showing.
    document.body.style.overflow = 'hidden';
    document.body.appendChild(this.progressOverlay);
  }

  // hides progresss bar
  hide() {
    // enable scrolling when loadScreen is hidden.
    document.body.style.overflow = '';
    document.body.removeChild(this.progressOverlay);
  }

  // set maximum value the loadbar can reach
  setMax(max) {
    this.max = max;
  }
}

export { LoadScreen };
