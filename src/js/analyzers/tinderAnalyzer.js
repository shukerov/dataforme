import { BaseAnalyzer } from './baseAnalyzer.js';
import { sum } from './analyzerHelpers.js';

class TinderAnalyzer extends BaseAnalyzer {

  constructor(callback) {
    super(callback);
    this.username = 'unknown';
    this.fakeData = require('../../assets/fake_data/tinder_precompiled.json');
    // TODO: add missing items so that stuff doesn't break? It wont really but good practice
    this.data = { 
      'name': null,
      'num_likes': null,
      'num_passes': null,
      'num_matches': null,
      'messages': {
        "Messages": []
      }
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
    this.getUserData(allDataJSON);
    this.getMatchData(allDataJSON);  
    this.getUsageData(allDataJSON);  
    this.getMessageData(allDataJSON);  
    
    // signal UI that things are ready to render
    cbChain.call();
  }

  getUserData(allDataJSON) {
    const username = this.get(['User', 'full_name'], allDataJSON);
    this.username = username;

    this.data.name = this.username;
    this.data.date_joined = this.get(['User', 'create_date'], allDataJSON);
    this.data.email = this.get(['User', 'email'], allDataJSON);
    this.data.birthday = this.get(['User', 'birth_date'], allDataJSON);
    this.data.education = this.get(['User', 'education'], allDataJSON);
    this.data.phone = this.get(['User', 'phone_id'], allDataJSON);
    //TODO: this is not fully safe. each item in the pos object needs to be safely accessed...
    this.data.pos = this.get(['User', 'pos'], allDataJSON);
    this.data.photo_count = this.get(['Photos', 'length'], allDataJSON);
  }

  getMatchData(allDataJSON) {
    // general
    const age_min = this.get(['User', 'age_filter_min'], allDataJSON);
    this.data.age_min = age_min;

    const age_max = this.get(['User', 'age_filter_max'], allDataJSON);
    this.data.age_max = age_max;

    // swipes
    const matches = this.get(['Usage', 'matches'], allDataJSON);
    this.data.num_matches = sum(Object.values(matches));

    const passes = this.get(['Usage', 'swipes_passes'], allDataJSON);
    this.data.num_passes = sum(Object.values(passes));

    const likes = this.get(['Usage', 'swipes_likes'], allDataJSON);
    this.data.num_likes = sum(Object.values(likes));

    // messages
    const messages_sent = this.get(['Usage', 'messages_sent'], allDataJSON);
    this.data.num_messages_sent = sum(Object.values(messages_sent));

    const messages_received = this.get(['Usage', 'messages_received'], allDataJSON);
    this.data.num_messages_received = sum(Object.values(messages_received));
  }

  getUsageData(allDataJSON) {
    const app_opens = this.get(['Usage', 'app_opens'], allDataJSON);
    this.data.app_opens = sum(Object.values(app_opens));

    const app_opens_by_date = Object.keys(app_opens).reduce((acc, date_key) => {
      const date = new Date(date_key);
      const year = date.getFullYear();

      if (acc[year]) {
        acc[year].dataPoints[date.valueOf() / 1000] = app_opens[date_key];
      }
      else {
        acc[year] = {
          dataPoints: {}
        };
        acc[year].dataPoints[date.valueOf() / 1000] = app_opens[date_key];
      }

      return acc;
    }, {});

    this.data.app_opens_by_date = app_opens_by_date;
  }

  getMessageData(allDataJSON) {
    const messages = this.get(['Messages'], allDataJSON);

    this.data.messages.Messages = messages.map((thread) => {
      let result = {
        "Match ID": null,
        "First Message": null,
        "Date Messaged": null,
        "Total Messages": 0
      };

      result['Match ID'] = thread.match_id;
      result['Total Messages'] = thread.messages.length;

      if (result['Total Messages'] > 0) {
        result['First Message'] = thread.messages[0].message;
        result['Date Messaged'] = thread.messages[0].sent_date;
      }
      else {
        result['First Message'] = 'You never sent one :(';
        result['Date Messaged'] = 'Never :(';
      }

      return result;
    });
  }
}

export { TinderAnalyzer };
