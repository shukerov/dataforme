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
        ['posts/your_posts_1.json', this.getPostDataSent.bind(this, data)],
        ['posts/other_people\'s_posts_to_your_timeline.json', this.getPostDataReceived.bind(this, data)],
        ['likes_and_reactions/posts_and_comments.json', this.getReactionData.bind(this, data)],
        ['search_history/your_search_history.json', this.getSearchData.bind(this, data)],
        ['ads/ads_interests.json', this.getAdData.bind(this, data)]
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

  // safely gets the attribute of an object
  get(path, object) {
    return path.reduce((xs, x) =>
      (xs && xs[x]) ? xs[x] : 'not found', object)
  }

  getAdData(data, cbChain, adInfo) {
    let adInfoJSON = JSON.parse(adInfo);
    data.adStats.topics = adInfoJSON.topics;
    cbChain.call();
  }

  getPostDataSent(data, cbChain, postInfo) {
    let postInfoJSON = JSON.parse(postInfo);
    data.postStats.num_posts_sent = postInfoJSON.length;

    postInfoJSON.reduce((acc, post) => {
      let d = new Date(post.timestamp * 1000);
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
      return acc;
    }, data.postStats);
    cbChain.call();
  }

  getPostDataReceived(data, cbChain, postInfo) {
    let postInfoJSON = JSON.parse(postInfo);
    data.postStats.num_posts_received = postInfoJSON.wall_posts_sent_to_you.activity_log_data.length;

    // TODO: very bad big NONO 
    postInfoJSON.wall_posts_sent_to_you.activity_log_data.reduce((acc, post) => {
      let d = new Date(post.timestamp * 1000);
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

      return acc;
    }, data.postStats);
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
    data.searchStats.num_searches = searchInfoJSON.searches.length;
    searchInfoJSON.searches.reduce(function(acc, search) {
      // skip empty searches
      if (!search.data) {
        return acc;
      }

      // TODO: use this.get
      // gets all of the searches you made with a count next to them
      let search_key = search.data[0].text.toLowerCase();
      if (acc.searches[search_key]) {
        acc.searches[search_key] += 1;
      }
      else {
        acc.searches[search_key] = 1;
      }

      // gets time statistics
      let d = new Date(search.timestamp * 1000);
      let y = d.getFullYear();

      // hourly stats
      acc.timeStats.hourly[d.getHours()]++;

      // yearly stats
      if (acc.timeStats.yearly[y]) {
        acc.timeStats.yearly[y] += 1;
      }
      else {
        acc.timeStats.yearly[y] = 1;
      }

      return acc;
    }, data.searchStats);
    cbChain.call();
  }

  getReactionData(data, cbChain, reactionInfo) {
    let reactionInfoJSON = JSON.parse(reactionInfo);
    data.reactionStats.num_reactions = reactionInfoJSON.reactions.length;
    reactionInfoJSON.reactions.reduce(function(acc, reaction) {
      // skip empty reactions
      if (!reaction.data) {
        return acc;
      }

      // TODO: use this.get
      // gets all of the reactions you made with a count next to them
      let reaction_key = reaction.data[0].reaction.reaction //TODO: BADBADBABDA
      if (acc.reactions[reaction_key]) {
        acc.reactions[reaction_key] += 1;
      }
      else {
        acc.reactions[reaction_key] = 1;
      }

      // gets time statistics
      let d = new Date(reaction.timestamp * 1000);
      let y = d.getFullYear();

      // hourly stats
      acc.timeStats.hourly[d.getHours()]++;

      // yearly stats
      if (acc.timeStats.yearly[y]) {
        acc.timeStats.yearly[y] += 1;
      }
      else {
        acc.timeStats.yearly[y] = 1;
      }

      return acc;
    }, data.reactionStats);
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
    let msgJSON = JSON.parse(msg);
    let participants = msgJSON.participants // all participants in the current chat thread
    let group = true;                         // remains true if the chat is a groupchat
    // let longestCallTest = 0;

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
      let curDay = null;
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

        // initalize the day (0-6) that a message was sent
        if (!curDay) {
          const firstDate = new Date(msg.timestamp_ms);
          curDay = firstDate.getDay();
        }


        if (msg.sender_name == this.username && msg.content) {
          // get time statistics
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

          // get msg statistics
          if (msg.content && msg.type != 'Call') {
            acc.total_words.sent += msg.content.split(' ').length;

            // gets number of days that messages happened
            // TODO: very broken would double count days as it is...
            // TODO: counts wrong since people can message a week apart from each other, you need to compare years and months too...
            if (d.getDay() != curDay) {
              acc.days_msged.sent += 1;
              curDay = d.getDay();
            }
          }
          // get call statistics
          else if (msg.type == 'Call' && msg.call_duration > 0 && msg.call_duration < 18000) {
            // if (msg.call_duration > longestCallTest) {longestCallTest = msg.call_duration;};
            acc.callStats.num_calls.initiated += 1;
            acc.callStats.total_duration += msg.call_duration;
          }
        }
        else if (msg.sender_name == participants[0].name && msg.content) {
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

          // get msg statistics
          if (msg.content && msg.type != 'Call') {
            acc.total_words.received += msg.content.split(' ').length;

            // gets number of days that messages happened
            if (d.getDay() != curDay) {
              acc.days_msged.received += 1;
              curDay = d.getDay();
            }
          }
          // get call statistics
          // NOTE: skipping calls longer than 5h cause Facebook data has some problems
          else if (msg.type == 'Call' && msg.call_duration > 0 && msg.call_duration < 18000) {
            acc.callStats.num_calls.received += 1;
            acc.callStats.total_duration += msg.call_duration;
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
