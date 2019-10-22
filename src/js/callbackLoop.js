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
    console.log(`${this.name} chain status: C:${this.callbackLoopCount} | I:${this.populated}`);

    if (this.callbackLoopCount == 0 && this.populated) {
      // DEBUG
      console.log(`${this.name} callback chain exited`);

      this.callback();
    }
  }

  initialized() {
    this.populated = true;
    console.log(`${this.name} was initialized`);
  }
}

// callback root chain
// this is primarily used to update the progress bar
export class cbRootChain extends CallbackLoop {

  constructor(name, finalCallback, numCallbacks) {
    super(name, finalCallback, numCallbacks);
    this.progress = new LoadBar();
    this.progress.show();
  }

  call() {
    this.callbackLoopCount -= 1;
    this.progress.updatePercentage();

    // DEBUG
    console.log(`${this.name} chain status: C:${this.callbackLoopCount} | I:${this.populated}`);

    if (this.callbackLoopCount == 0 && this.populated) {

      // DEBUG
      console.log(`Main callback chain exited`);

      this.callback();
      this.progress.hide();
    }
  }

  initialized() {
    this.progress.setMax(this.callbackLoopCount);
    this.populated = true;

    // DEBUG
    console.log("Main CallBack Chain initialized.");
  }
}
