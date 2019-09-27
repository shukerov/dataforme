import { InflaterJS } from '../zip-js-modified/inflate.js';
import { Zip } from '../zip-js-modified/zip.js';
import { ZipFS } from '../zip-js-modified/zip-fs.js';
import { CallbackLoop, cbRootChain } from '../callbackLoop.js';

class BaseAnalyzer {
  constructor(callback) {
    this.callback = null;
    this.zip = new Zip(window);
    this.fs = new ZipFS(window.zip);
    this.callbackLoop = new cbRootChain(callback.name, callback);

    // need to end up in the global object for things to work
    this.inflate = new InflaterJS(window);
    // TODO: do you need the deflator too?

    this.fs = window.zip.fs.FS();
  }

  analyzeFile(fileName, analyzerFunction) {

  // addToChain(funcName, fileName) {
    this.callbackLoop.setLoopCount(); // increment the callbackloop count
    const internalCallback = new CallbackLoop(`${analyzerFunction.name}`, this.callbackLoop.call.bind(this.callbackLoop), 1);
    const file = this.getJSONFile(fileName); 
    file.getText(analyzerFunction.bind(this, internalCallback)); 
  }

  analyzeDir(dirName, filePattern, msgData, analyzerFunction) {
    var directories = this.getDirChildren(dirName);
    var numDirs = directories.length;
    // increments callbackloop count
    this.callbackLoop.setLoopCount();
    let internalCallbackLoop = new CallbackLoop(
      'display messages',
      this.callbackLoop.call.bind(this.callbackLoop),
      numDirs);

    // loop through directories
    directories.map((dir) => {
      var file = dir.getChildByName(filePattern);

      // pattern was not found in the given directory
      if (!file) {
        internalCallbackLoop.call();
        // this.progress.updatePercentage(); 
        return;
      }

      file.getText(analyzerFunction.bind(this,
        dir.name,
        msgData,
        internalCallbackLoop));
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
}

export { BaseAnalyzer };
