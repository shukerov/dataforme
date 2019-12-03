import { BaseAnalyzer } from '../js/analysis/baseAnalyzer.js';

class WebserviceAnalyzer extends BaseAnalyzer {

  constructor(callback) {
    super(callback);
    this.username = 'unknown';
    this.fakeData = require('./fake_data.json');
    this.data = { 
      // define your data here
    };
  }

  init(file) {
    this.showLoadScreen();

    this.fs.importBlob(file, () => { 
      let fns = [
        {
          path: '<path_to_the_json_file_in_zip>.json',
          name: 'displayed during data analysis load screen',
          func: this.getData
        },
        {
          path: '<path_to_another_json_file_in_zip>.json',
          name: 'displayed during data analysis load screen',
          func: this.getOtherData
        }
      ]

      // execute functions
      for(let i = 0; i < fns.length; i++) {
        this.analyzeFile(fns[i]);
      }

      this.cbChain.initialized();
    });
  }

    getData(cbChain, data) {
      let dataJSON = JSON.parse(data);

      // extracting data
      // WRITE FUNCTIONS HERE

      // signal UI that things are ready to render
      cbChain.call();
    }

    getOtherData(cbChain, data) {
      let dataJSON = JSON.parse(data);

      // extracting data
      // WRITE FUNCTIONS HERE

      // signal UI that things are ready to render
      cbChain.call();
    }
} 

export { WebserviceAnalyzer };
