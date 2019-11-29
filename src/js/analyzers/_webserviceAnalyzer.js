import { BaseAnalyzer } from './baseAnalyzer.js';
import { sum } from './analyzerHelpers.js';

class WebserviceAnalyzer extends BaseAnalyzer {

  constructor(callback) {
    super(callback);
    this.username = 'unknown';
    this.fakeData = require('../../assets/fake_data/webservice_precompiled.json');
    this.data = { 
      'sructure': null,
      'your': null,
      'data': null,
      'here': null,
    };
  }

  init(file) {
    this.showLoadScreen();

    this.fs.importBlob(file, () => { 
      let fns = [
        {
          path: '<path_to_the_json_file_in_zip>.json',
          name: 'displayed during data analysis load screen',
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
      // WRITE FUNCTIONS HERE

      // signal UI that things are ready to render
      cbChain.call();
    }
} 

export { WebserviceAnalyzer };
