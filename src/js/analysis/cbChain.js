import { LoadBar } from '../components/loadBar.js';

export class CbChain {
  constructor(name, finalCallback, numCallbacks) {
    this.name = name;
    this.populated = false;
    this.cbChainCount = 0;

    if (numCallbacks) {
      this.cbChainCount = numCallbacks;
      this.populated = true;
    }

    this.callback = finalCallback

    // DEBUG
    // console.log(`Init ${this.name}: 
    //    callback cnt: ${this.cbChainCount},
    //    callback fn: ${this.callback.toString()}
    // `);
  }

  setLoopCount(n=1) {
    if (n > 1) {
      this.cbChainCount = n
    }
    else {
      this.cbChainCount += 1;
    }

    // DEBUG
    // console.log(`${this.name}: callback cnt is now ${this.cbChainCount}`);
  }

  call() {
    this.cbChainCount -= 1;
    // DEBUG
    // console.log(`${this.name} chain status: C:${this.cbChainCount} | I:${this.populated}`);

    if (this.cbChainCount == 0 && this.populated) {
      // DEBUG
      // console.log(`${this.name} callback chain exited`);

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
export class cbRootChain extends CbChain {

  constructor(name, finalCallback, numCallbacks) {
    super(name, finalCallback, numCallbacks);
    this.progress = new LoadBar();
  }

  call() {
    this.cbChainCount -= 1;
    this.progress.updatePercentage();

    // DEBUG
    // console.log(`${this.name} chain status: C:${this.cbChainCount} | I:${this.populated}`);

    if (this.cbChainCount == 0 && this.populated) {

      // DEBUG
      // console.log(`Main callback chain exited`);

      this.callback();
      this.progress.hide();
    }
  }

  initialized() {
    this.progress.setMax(this.cbChainCount);
    this.populated = true;

    // DEBUG
    // console.log("Main CallBack Chain initialized.");
  }
}
