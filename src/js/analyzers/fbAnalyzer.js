// TODO: add comments for each getter. showing where the data is coming from and what it does
import { BaseAnalyzer } from './baseAnalyzer.js';

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
        ['about_you/face_recognition.json',this.getFaceRecognitionData.bind(this, data)],
        ['profile_information/profile_update_history.json', this.getProfileUpdateData.bind(this, data)],
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

      this.cbChain.initialized();

    });
  }

  getPostData(data, cbChain, postInfo) {
    let postInfoJSON = JSON.parse(postInfo);
    data.num_posts = postInfoJSON.length;
    cbChain.call();
  }

  getProfileUpdateData(data, cbChain, profileUpdateInfo) {
    let profileUpdateJSON = JSON.parse(profileUpdateInfo);
    data.last_profile_update = profileUpdateJSON.profile_updates[0].timestamp * 1000;
    cbChain.call();
  }

  getFriendPeerGroup(data, cbChain, friendPeerInfo) {
    let friendPeerInfoJSON = JSON.parse(friendPeerInfo);
    data.friend_peer_group = friendPeerInfoJSON.friend_peer_group;
    cbChain.call();
  }

  getFaceRecognitionData(data, cbChain, faceRecInfo) {
    let faceRecInfoJSON = JSON.parse(faceRecInfo);
    data.face_example_count = faceRecInfoJSON.facial_data.example_count;
    data.my_face = faceRecInfoJSON.facial_data.raw_data;
    cbChain.call();
  }

  getSearchData(data, cbChain, searchInfo) {
    let searchInfoJSON = JSON.parse(searchInfo);
    data.num_searches = searchInfoJSON.searches.length;
    cbChain.call();
  }

  getBaseData(data, cbChain, profInfo) {
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
      profInfoJSON.profile.birthday.month - 1, // months start at 0
      profInfoJSON.profile.birthday.day
    );

    data.relationship_count = profInfoJSON.profile.previous_relationships.length
    data.relationship_status = profInfoJSON.profile.relationship.status

    cbChain.call();
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

    callback.call();

    if (callback.cbChainCount == 0) {
      callback.call();
    }
  }
}

export { FBAnalyzer };
