import { BaseAnalyzer } from '../js/analysis/baseAnalyzer.js';

class SpotifyAnalyzer extends BaseAnalyzer {

  constructor(callback) {
    super(callback);
    this.username = 'unknown';
    this.fakeData = require('./fake_data.json');
    this.data = { 
      'username': null,
      'gender': null,
      'date_joined': null,
      'email': null,
      'birthday': null,
      'country': null,
      'postalCode': null,
      'phone': null,
      'mobileOperator': null,
      'mobileBrand': null,
      "streaming_data": {
        'ms_played': 0,
        'skipped_songs': {},
        'artists': {},
        'songs': {},
        'time': {
          'hourly': Array(24).fill(0),
          'weekly': Array(7).fill(0),
          'monthly': Array(12).fill(0),
          'yearly': {}
        }
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
    let skippedLimit = 20 * 1000; // the first number represents seconds

    // TODO: use safeget pleaaase
    streamingDataJSON.reduce((acc, song) => {
      acc.ms_played += song.msPlayed / 1000;

      const songKey = `${song.artistName} - ${song.trackName}`;

      // song was skipped
      if (song.msPlayed > skippedLimit) {
        // count song plays

        const listenDate = new Date(`${song.endTime}`);
        const listenYear = listenDate.getFullYear();

        // count time stats
        acc.time.hourly[listenDate.getHours()]++;
        acc.time.weekly[listenDate.getDay()]++;
        acc.time.monthly[listenDate.getMonth()]++;

        if (acc.time.yearly[listenYear]) {
          acc.time.yearly[listenYear]++;
        }
        else {
          acc.time.yearly[listenYear] = 1;
        }

        if (acc.songs[songKey]) {
          acc.songs[songKey] += 1;
        }
        else {
          acc.songs[songKey] = 1;
        }
            
        // count artist plays
        if (acc.artists[song.artistName]) {
          acc.artists[song.artistName] += 1;
        }
        else {
          acc.artists[song.artistName] = 1;
        }
      }
      else {
        if (acc.skipped_songs[songKey]) {
          acc.skipped_songs[songKey] += 1;
        }
        else {
          acc.skipped_songs[songKey] = 1;
        }
      }

      return acc;
    }, this.data.streaming_data);

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

    this.data.country = this.get(['country'], userDataJSON);
    this.data.postalCode = this.get(['postalCode'], userDataJSON);
    this.data.gender = this.get(['gender'], userDataJSON);
    this.data.mobileOperator = this.get(['mobileOperator'], userDataJSON);
    this.data.mobileBrand = this.get(['mobileBrand'], userDataJSON);

    // signal UI that things are ready to render
    cbChain.call();
  }
} 

export { SpotifyAnalyzer };
