import { BaseAnalyzer } from './baseAnalyzer.js';
import { LoadBar } from '../components/loadBar.js';
import { CallbackLoop } from '../callbackLoop.js';

class FBAnalyzer extends BaseAnalyzer {
  constructor(file, data, callback) {
    super();
    this.username = 'Stoyan Shukerov';
    this.callbackLoop = new CallbackLoop('fbMainCallbackLoop', callback);
    this.progress = null;
    this.init(file, data);
  }

  init(file, data) {
    this.fs.importBlob(file, () => {
      // depends on how many files we are opening
      this.callbackLoop.setLoopCount(4); // defaults to 1

      // TODO: IMPORTANT need to have a backup plan in case loopback fails
      // currently that can happen if file is not found for example.
      // This will make your script fail miserably right now...

      // get profiledata
      let profInfoCallbackLoop = new CallbackLoop('fbProfileInfLoop',
        this.callbackLoop.call.bind(this.callbackLoop),
        1);
      let profileInfoFile = this.getJSONFile('profile_information/profile_information.json');
      profileInfoFile.getText(this.getBaseData.bind(this, data, profInfoCallbackLoop));

      // get search file data
      let searchCallbackLoop = new CallbackLoop('fbSearchLoop',
        this.callbackLoop.call.bind(this.callbackLoop),
        1);
      let searchHistFile = this.getJSONFile('search_history/your_search_history.json');
      searchHistFile.getText(this.getSearchData.bind(this, data, searchCallbackLoop));

      // get posts file data
      let postCallbackLoop = new CallbackLoop('fbPostLoop',
        this.callbackLoop.call.bind(this.callbackLoop),
        1);
      let postsFile = this.getJSONFile('posts/your_posts_1.json');
      postsFile.getText(this.getPostData.bind(this, data, postCallbackLoop));

      let msgCallbackLoop = new CallbackLoop('fbMsgLoop',
        this.callbackLoop.call.bind(this.callbackLoop),
        1);
      this.analyzeMsgThreads(data.msgStats, msgCallbackLoop);
      // let postsFile = this.getJSONFile('posts/your_posts_1.json');
      // postsFile.getText(this.getPostData.bind(this, data, postCallbackLoop));
    });
  }

  getPostData(data, callbackLoop, postInfo) {
    let postInfoJSON = JSON.parse(postInfo);
    data.num_posts = postInfoJSON.length;
    callbackLoop.call();
  }

  getSearchData(data, callbackLoop, searchInfo) {
    let searchInfoJSON = JSON.parse(searchInfo);
    data.num_searches = searchInfoJSON.searches.length;
    callbackLoop.call();
  }

  getBaseData(data, callbackLoop, profInfo) {
    let profInfoJSON = JSON.parse(profInfo);
    // NEEDED FOR MESSAGES
    // idk about this being here
    this.username = profInfoJSON.profile.name.full_name;

    data.name = this.username;
    data.joined = profInfoJSON.profile.registration_timestamp * 1000;
    // TODO: need a way to safely access all these variables
    // a function in the baseAnalyzer that will return unknown if it can't
    // find the given json attribute
    data.birthday = new Date(
      profInfoJSON.profile.birthday.year,
      profInfoJSON.profile.birthday.month,
      profInfoJSON.profile.birthday.day
    );

    // YUP
    callbackLoop.call();
  }

  analyzeMsgThreads(msgData, callback) {
    var msgDirs = this.getDirChildren('messages/inbox');

    // regular attempt
    var numDirs = msgDirs.length;
    this.progress = new LoadBar(numDirs);
    this.progress.show();

    // CARE
    let internalCallbackLoop = new CallbackLoop('display messages', callback.call.bind(callback), numDirs);

    // loop through msg threads
    msgDirs.map((msgDir) => {
      var msgThread = msgDir.getChildByName("message_1.json");

      // message thread was not found in the given directory
      if (!msgThread) {
        // CARE
        // this.callbackLoop.call();
        internalCallbackLoop.call();
        this.progress.updatePercentage(); 
        return;
      }

      msgThread.getText(this.analyzeMessageThread.bind(this, msgDir.name, msgData, internalCallbackLoop));
    });
  }

  analyzeMessageThread(threadName, msgData, callback, msg) {
    // console.log(msg);
    let msgJSON = JSON.parse(msg);
    let participants = msgJSON.participants // all participants in the current chat thread
    let group = true;                         // remains true if the chat is a groupchat

    if (participants && participants.length > 2) {
      msgData.groupChatThreads.push(threadName);
    }
    else if(participants) {
      let participantStat = {
        'dirName': threadName,
        'msgByUser': 0,
        'other': 0
      };
      msgData.regThreads[participants[0].name] = participantStat; 
      group = false;
    }

    if (msgJSON.messages && msgJSON.messages.length > 1) {
      // pull this function out and make sure you can reuse it in individual thread analysis
      msgJSON.messages.reduce(function(acc, msg) {
        if (!group) {
          if (msg.sender_name == this.username) {
            acc.regThreads[participants[0].name].msgByUser++; 
          }
          else
          {
            acc.regThreads[participants[0].name].other++; 
          }
        }

        if (msg.sender_name == this.username) {
          let d = new Date(msg.timestamp_ms);
          let y = d.getFullYear(); // message years
          acc.timeStats.hourly.sent[d.getHours()]++;
          acc.timeStats.weekly.sent[d.getDay()]++;
          acc.timeStats.monthly.sent[d.getMonth()]++;
          if (acc.timeStats.yearly[y]) {
            acc.timeStats.yearly[y].sent++;
          }
          else {
            acc.timeStats.yearly[y] = {
              'sent': 0,
              'received': 0
            }
          }
        }
        else if (msg.sender_name == participants[0].name) {
          let d = new Date(msg.timestamp_ms);
          let y = d.getFullYear(); // message years
          acc.timeStats.hourly.received[d.getHours()]++;
          acc.timeStats.weekly.received[d.getDay()]++;
          acc.timeStats.monthly.received[d.getMonth()]++;
          if (acc.timeStats.yearly[y]) {
            acc.timeStats.yearly[y].received++;
          }
          else {
            acc.timeStats.yearly[y] = {
              'sent': 0,
              'received': 0
            }
          }
        }

        return acc;
      }.bind(this), msgData);
    }

    // progress bar
    // CARE
    // this.callbackLoop.call();
    callback.call();
    this.progress.updatePercentage(); 

    // triggers callback once all msgThreads are analyzed
    if (this.progress.current == this.progress.max) {
      this.progress.hide();
      this.progress = null;
      // CARE
      callback.call();
    }
  }
}

export { FBAnalyzer };
