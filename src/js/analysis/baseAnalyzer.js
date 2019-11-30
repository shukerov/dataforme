import { InflaterJS } from '../zip-js-modified/inflate.js';
import { Zip } from '../zip-js-modified/zip.js';
import { ZipFS } from '../zip-js-modified/zip-fs.js';
import { CbChain, cbRootChain } from '../cbChain.js';

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

    try {
      let why = document.createElement('div');
      why.innerHTML = file_data.name;
      this.cbChain.progress.add(why);
      const file = this.getJSONFile(file_data.path); 
      file.getText(file_data.func.bind(this, internalCallback)); 
      let why1 = document.createElement('div');
      why1.innerHTML = 'V';
      this.cbChain.progress.add(why1);
    }
    catch(e) {
      // TODO: error prevention bad bad
      console.error(e);
      let why = document.createElement('div');
      why.innerHTML = 'X';
      this.cbChain.progress.add(why);
      internalCallback.call();
    }
  }

  analyzeDir(dirName, filePattern, analyzerFunction) {
    var directories = this.getDirChildren(dirName);
    var numDirs = directories.length;
    // increments callbackloop count
    this.cbChain.setLoopCount();
    let internalCbChain = new CbChain(
      'display messages',
      this.cbChain.call.bind(this.cbChain),
      numDirs);

    // loop through directories
    directories.map((dir) => {
      var file = dir.getChildByName(filePattern);

      // pattern was not found in the given directory
      if (!file) {
        internalCbChain.call();
        // this.progress.updatePercentage(); 
        return;
      }

      file.getText(analyzerFunction.bind(this,
        dir.name,
        internalCbChain));
    });
  }

  // why json in the name..?
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
