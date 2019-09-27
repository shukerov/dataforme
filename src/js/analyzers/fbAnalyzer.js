import { BaseAnalyzer } from './baseAnalyzer.js';
// import { CallbackLoop } from '../callbackLoop.js';

class FBAnalyzer extends BaseAnalyzer {
  constructor(file, data, callback) {
    super(callback);
    this.username = 'unknown';
    this.init(file, data);
  }

  init(file, data) {
    this.fs.importBlob(file, () => {
      // TODO: IMPORTANT need to have a backup plan in case loopback fails
      // currently that can happen if file is not found for example.
      // This will make your script fail miserably right now...

      let fns = [
        ['profile_information/profile_information.json', this.getBaseData.bind(this, data)],
        ['about_you/friend_peer_group.json',this.getFriendPeerGroup.bind(this, data)],
        ['posts/your_posts_1.json', this.getPostData.bind(this, data)],
        ['search_history/your_search_history.json', this.getSearchData.bind(this, data)]
      ]

      for(let i = 0; i < fns.length; i++) {
        this.analyzeFile(fns[i][0], fns[i][1]);
      }

      // analyze each message thread
      this.analyzeDir.call(this,
        'messages/inbox', 'message_1.json',
        data.msgStats, this.analyzeMessageThread); 

      this.callbackLoop.initialized();

    });
  }

  getPostData(data, callbackLoop, postInfo) {
    let postInfoJSON = JSON.parse(postInfo);
    data.num_posts = postInfoJSON.length;
    callbackLoop.call();
  }

  getFriendPeerGroup(data, callbackLoop, friendPeerInfo) {
    let friendPeerInfoJSON = JSON.parse(friendPeerInfo);
    data.friend_peer_group = friendPeerInfoJSON.friend_peer_group;
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

  // analyzeMsgThreads(msgData, callback) {
  //   var msgDirs = this.getDirChildren('messages/inbox');

  //   // regular attempt
  //   var numDirs = msgDirs.length;
  //   this.progress = new LoadBar(numDirs);
  //   this.progress.show();

  //   // CARE
  //   let internalCallbackLoop = new CallbackLoop('display messages', callback.call.bind(callback), numDirs);

  //   // loop through msg threads
  //   msgDirs.map((msgDir) => {
  //     var msgThread = msgDir.getChildByName("message_1.json");

  //     // message thread was not found in the given directory
  //     if (!msgThread) {
  //       // CARE
  //       // this.callbackLoop.call();
  //       internalCallbackLoop.call();
  //       this.progress.updatePercentage(); 
  //       return;
  //     }

  //     msgThread.getText(this.analyzeMessageThread.bind(this, msgDir.name, msgData, internalCallbackLoop));
  //   });
  // }

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
    // this.progress.updatePercentage(); 

    // triggers callback once all msgThreads are analyzed
    // if (this.progress.current == this.progress.max) {
    if (callback.callbackLoopCount == 0) {
      // this.progress.hide();
      // this.progress = null;
      // CARE
      callback.call();
    }
  }
}

export { FBAnalyzer };
