import '../../styles/components/loadBar.scss';

class LoadBar {
   constructor(current, max) {
      this.current = current; // current value of the progress
      this.max = max;         // maximum value that the progress can reach

      // the html elements
      this.text = document.createElement('p');
      this.progress = document.createElement('div');

      this.text.innerHTML = this.toPercent();
      this.text.className = 'progress-text';
      this.progress.className = 'progress';

      this.progress.appendChild(this.text);
   }

   // updates progress bar
   updatePercentage(val) {
      this.current = val;
      this.text.innerHTML = this.toPercent() ;
   }

   // returns current progress as a string
   toPercent() {
      return `${Math.round(this.current / this.max * 100)}%`;
   }

   // show progress bar
   show() {
      document.body.appendChild(this.progress);
   }

   // hides progresss bar
   hide() {
      document.body.removeChild(this.progress);
   }
}

export { LoadBar };
