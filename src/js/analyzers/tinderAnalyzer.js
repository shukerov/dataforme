import { BaseAnalyzer } from './baseAnalyzer.js';
import { sum } from './analyzerHelpers.js';

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
      let fns = [
        {
          path: 'data.json',
          name: 'fetching tinder information',
          func: this.getAllData
        }
      ]

      // execute functions
      for(let i = 0; i < fns.length; i++) {
        this.analyzeFile(fns[i]);
      }

      this.cbChain.initialized();
    });
  }

  getAllData(cbChain, allData) {
    let allDataJSON = JSON.parse(allData);
    // extracting data
    const username = this.get(['User', 'full_name'], allDataJSON);
    this.username = username;
    this.data.name = this.username;
    this.data.date_joined = this.get(['User', 'create_date'], allDataJSON);

    // THIS IS PART OF MATCH REPORT
    // TODO: this can all be one sum function ahhheemmm
    const matches = this.get(['Usage', 'matches'], allDataJSON);
    this.data.num_matches = sum(Object.values(matches));

    const passes = this.get(['Usage', 'swipes_passes'], allDataJSON);
    this.data.num_passes = sum(Object.values(passes));

    const likes = this.get(['Usage', 'swipes_likes'], allDataJSON);
    this.data.num_likes = sum(Object.values(likes));

    const messages_sent = this.get(['Usage', 'messages_sent'], allDataJSON);
    this.data.num_messages_sent = sum(Object.values(messages_sent));

    const messages_received = this.get(['Usage', 'messages_received'], allDataJSON);
    this.data.num_messages_received = sum(Object.values(messages_received));

    cbChain.call();
  }
}

export { TinderAnalyzer };
