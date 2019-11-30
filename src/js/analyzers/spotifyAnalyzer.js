import { BaseAnalyzer } from './baseAnalyzer.js';
import { sum } from './analyzerHelpers.js';

class SpotifyAnalyzer extends BaseAnalyzer {

  constructor(callback) {
    super(callback);
    this.username = 'unknown';
    this.fakeData = require('../../page-spotify/spotify_precompiled.json');
    this.data = { 
      'username': null,
      'date_joined': null,
      'email': null,
      'birthday': null,
      "streaming_data": {
        'ms_played': 0,
        'skipped_songs': 0
      }
    };
  }

  init(file) {
    this.showLoadScreen();

    this.fs.importBlob(file, () => { 

      let fns = [
        {
          path: 'MyData/Userdata.json',
          name: 'fetching user data',
          func: this.getUserData
        }
      ]

      // contains all files in the my data directory
      let files = this.getDirChildren('MyData');

      // get all streaming history files
      files.reduce((acc, f) => {

        if (f.name.includes("StreamingHistory")) {
          let fn = {
            path: 'MyData/' + f.name,
            name: 'fetching streaming history',
            func: this.getStreamingData
          };

          acc.push(fn);
        }
        return acc;
      }, fns);


      // execute functions
      for(let i = 0; i < fns.length; i++) {
        this.analyzeFile(fns[i]);
      }

      this.cbChain.initialized();
    });
  }

  getStreamingData(cbChain, streamingData) {
    let streamingDataJSON = JSON.parse(streamingData);
    let skippedLimit = 20;

    let streamingStats = {
      ms_played: 0,
      skipped_songs: 0
    };

    streamingDataJSON.reduce((acc, song) => {
      acc.ms_played += song.msPlayed;

      if (song.msPlayed > skippedLimit * 1000) {

      }
      else {
        acc.skipped_songs += 1;
      }

      return acc;
    }, streamingStats);

    this.data.streaming_data.ms_played += streamingStats.ms_played / 1000;
    this.data.streaming_data.skipped_songs += streamingStats.skipped_songs;
    // signal UI that things are ready to render
    cbChain.call();
  }

  getUserData(cbChain, userData) {
    let userDataJSON = JSON.parse(userData);

    // extracting data
    this.username = this.get(['username'], userDataJSON);
    this.data.username = this.username;
    this.data.date_joined = this.get(['creationTime'], userDataJSON);
    this.data.email = this.get(['email'], userDataJSON);
    this.data.birthday = this.get(['birthdate'], userDataJSON);
    this.data.phone = this.get(['mobileNumber'], userDataJSON);

    // signal UI that things are ready to render
    cbChain.call();
  }
} 

export { SpotifyAnalyzer };
