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
    this.data.num_matches = Object.values(matches).reduce((acc, match_count) => {
      acc += match_count;
      return acc;
    }, 0);

    const passes = this.get(['Usage', 'swipes_passes'], allDataJSON);
    this.data.num_passes = Object.values(passes).reduce((acc, pass_count) => {
      acc += pass_count;
      return acc;
    }, 0);

    const likes = this.get(['Usage', 'swipes_likes'], allDataJSON);
    this.data.num_likes = Object.values(likes).reduce((acc, like_count) => {
      acc += like_count;
      return acc;
    }, 0);

    const messages_sent = this.get(['Usage', 'messages_sent'], allDataJSON);
    this.data.num_messages_sent = Object.values(messages_sent).reduce((acc, msg_count) => {
      acc += msg_count;
      return acc;
    }, 0);

    const messages_received = this.get(['Usage', 'messages_received'], allDataJSON);
    this.data.num_messages_received = Object.values(messages_received).reduce((acc, msg_count) => {
      acc += msg_count;
      return acc;
    }, 0);

    cbChain.call();
  }
}

export { TinderAnalyzer };
