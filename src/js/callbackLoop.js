import { LoadBar } from './components/loadBar.js';

export class CallbackLoop {
  constructor(name, finalCallback, numCallbacks) {
    this.name = name;
    this.populated = false;
    this.callbackLoopCount = 0;

    if (numCallbacks) {
      this.callbackLoopCount = numCallbacks;
      this.populated = true;
    }

    this.callback = finalCallback

    // DEBUG
    console.log(`Init ${this.name}: 
       callback cnt: ${this.callbackLoopCount},
       callback fn: ${this.callback.toString()}
    `);
  }

  setLoopCount(n=1) {
    if (n > 1) {
      this.callbackLoopCount = n
    }
    else {
      this.callbackLoopCount += 1;
    }
    // DEBUG
    console.log(`${this.name}: callback cnt is now ${this.callbackLoopCount}`);
  }

  call() {
    this.callbackLoopCount -= 1;
    // DEBUG
    console.log(`${this.name}: ${this.callbackLoopCount} till MAGIC`);
    console.log(`${this.populated}`);

    if (this.callbackLoopCount == 0 && this.populated) {
      // DEBUG
      console.log(`${this.name}: **MAGIC HAPPENED**`);

      this.callback();
    }
  }

  initialized() {
    this.populated = true;
    console.log("mkay");
  }
}

// callback root chain
// this is primarily used to update the progress bar
export class cbRootChain extends CallbackLoop {

  constructor(name, finalCallback, numCallbacks) {
    super(name, finalCallback, numCallbacks);
    this.progress = new LoadBar(5);
    this.progress.show();
  }

  updateProgress() {
    if (this.populated) {
      this.progress.updatePercentage();
    }
    else {
      this.progress.text.innerHTML = 'carrots';
    }
  }

  call() {
    this.callbackLoopCount -= 1;
    this.updateProgress();
    // DEBUG
    console.log(`${this.name}: ${this.callbackLoopCount} till MAGIC`);
    console.log(`${this.populated}`);

    if (this.callbackLoopCount == 0 && this.populated) {
      // DEBUG
      console.log(`${this.name}: **MAGIC HAPPENED**`);

      this.callback();
      this.progress.hide();
    }
  }
}
