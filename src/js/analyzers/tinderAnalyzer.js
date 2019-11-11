import { BaseAnalyzer } from './baseAnalyzer.js';

class TinderAnalyzer extends BaseAnalyzer {

  constructor(callback) {
    super(callback);
    this.username = 'unknown';
    this.fakeData = require('../../assets/fake_data/tinder_precompiled.json');
    this.data = { 
      'name': null,
      'num_likes': null,
      'num_passes': null,
      'num_matches': null,
    };
  }

  init(file) {
    this.showLoadScreen();

    this.fs.importBlob(file, () => { 
    });
  }
}

export { TinderAnalyzer };
