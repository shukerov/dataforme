import { InflaterJS } from '../zip-js-modified/inflate.js';
import { Zip } from '../zip-js-modified/zip.js';
import { ZipFS } from '../zip-js-modified/zip-fs.js';
import { CbChain, cbRootChain } from './cbChain.js';

class BaseAnalyzer {
  constructor(callback) {
    this.callback = null;
    this.zip = new Zip(window);
    this.fs = new ZipFS(window.zip);
    this.cbChain = new cbRootChain(callback.name, callback);

    // need to end up in the global object for things to work
    this.inflate = new InflaterJS(window);
    this.fs = window.zip.fs.FS();
  }

  showLoadScreen() {
    this.cbChain.progress.show();
  }

  // input
  // accepts a js object in the form of
  // {
  //   path: <path to file to be analyzed in zip>,
  //   name: <user message to be displayed>,
  //   func: <function to be executed>
  // }
  analyzeFile(file_data) {

    this.cbChain.setLoopCount(); // increment the callbackloop count
    const internalCallback = new CbChain(`${file_data.func.name}`, this.cbChain.call.bind(this.cbChain), 1);

    // TODO: fix up the mess below
    try {
      // add process name
      this.cbChain.progress.addFilename(file_data.name);

      const file = this.getJSONFile(file_data.path); 
      file.getText(file_data.func.bind(this, internalCallback)); 

      // process was successfuly started
      this.cbChain.progress.addFilenameStatus(true);
    }
    catch(e) {
      // TODO: error prevention bad bad
      console.error(e);
      this.cbChain.progress.addFilenameStatus(false);
      internalCallback.call();
    }
  }

  // TODO: this function name makes 0 sense.
  getJSONFile(path) {
    var pathSplit = path.split('/');
    var curDir = this.fs.root;

    for (var i = 0, len = pathSplit.length; i < len; i++) {
      curDir = curDir.getChildByName(pathSplit[i]);
      if (!curDir) {
        throw `Directory ${pathSplit[i]} doesn't exists in path ${path}`;
      }
    }

    return curDir;
  }

  getDirChildren(path) {
    var pathSplit = path.split('/');
    var curDir = this.fs.root;

    for (var i = 0, len = pathSplit.length; i < len; i++) {
      curDir = curDir.getChildByName(pathSplit[i]);
      if (!curDir) {
        throw `Directory ${pathSplit[i]} doesn't exists in path ${path}`;
      }
    }

    return curDir.children
  }

  // safely gets the attribute of an object
  // TODO: in debug mode it should report to console what wasn't found...
  get(path, object) {
    return path.reduce((xs, x) =>
      (xs && xs[x]) ? xs[x] : 'not found', object)
  }

  // returns the data object holding all facebook gathered info
  // if the fake data flag is present the fake data is returned
  getData(fakeData) {
    return fakeData ? this.fakeData : this.data;
  }
}

export { BaseAnalyzer };
