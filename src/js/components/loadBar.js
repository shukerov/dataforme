import '../../styles/components/loadBar.scss';

class LoadBar {
  constructor(max = null) {
    this.current = 0; // current value of the progress
    this.max = max;   // maximum value that the progress can reach

    // the html elements
    this.text = document.createElement('p');
    this.progress = document.createElement('div');

    this.text.innerHTML = 'Initializing...';
    this.text.className = 'progress-text';
    this.progress.className = 'progress';

    this.progress.appendChild(this.text);
  }

  // updates progress bar
  updatePercentage() {
    if (this.max == null) {
      this.text.innerHTML = 'Initializing...';
    }
    else
    {
      this.current++;
      this.text.innerHTML = this.toPercent() ;
    }
  }

  // returns current progress as a string
  toPercent() {
    return `${Math.round(this.current / this.max * 100)}%`;
  }

  // add random things
  add(text) {
    this.progress.appendChild(text);
  }

  // show progress bar
  show() {
    document.body.appendChild(this.progress);
  }

  // hides progresss bar
  hide() {
    document.body.removeChild(this.progress);
  }

  // set maximum value the loadbar can reach
  setMax(max) {
    this.max = max;
  }
}

export { LoadBar };
