// TODO: add comments for each getter. showing where the data is coming from and what it does
import { BaseAnalyzer } from './baseAnalyzer.js';

class FBAnalyzer extends BaseAnalyzer {
  constructor(callback) {
    super(callback);
    this.username = 'unknown';
    this.fakeData = require('../../assets/fake_data/fb_precompiled.json');
    this.data = {
      'name': null,
      'joined': null,
      'brithday': null,
      'relationship_count': null,
      'relationship_status': null,
      'last_profile_update': null,
      'friend_peer_group': null,
      'adStats': {
        'topics': [],
        'interactions': []
      },
      'reactionStats': {
        'reactions': {
          'HAHA': 0,
          'WOW': 0,
          'LIKE': 0,
          'SORRY': 0,
          'ANGER': 0,
          'LOVE': 0
        },
        'timeStats': {
          'yearly': {},
          'hourly': Array(24).fill(0)
        }
      },
      'postStats': {
        'num_posts_sent': null,
        'num_posts_received': null,
        'timeStats': {
          'hourly': {
            'sent': Array(24).fill(0),
            'received': Array(24).fill(0)
          },
          'weekly': {
            'sent': Array(7).fill(0),
            'received': Array(7).fill(0)
          },
          'monthly': {
            'sent': Array(12).fill(0),
            'received': Array(12).fill(0)
          },
          'yearly': {}
        }
      },
      'searchStats': {
        'num_searches': null,
        'searches': {},
        'timeStats': {
          'yearly': {},
          'hourly': Array(24).fill(0)
        }
      },
      'msgStats': {
        'groupChatThreads': [],
        'regThreads': {},
        'numPictures': {'gifs': 0, 'other': 0},
        'days_msged': {
          "sent": 0,
          "received": 0
        },
        'total_words': {
          'sent': 0,
          'received': 0,
        },
        'callStats': {
          'num_calls': {
            'initiated': 0,
            'received': 0
          },
          'total_duration': 9000
        },
        'timeStats': {
          'hourly': {
            'sent': Array(24).fill(0),
            'received': Array(24).fill(0)
          },
          'weekly': {
            'sent': Array(7).fill(0),
            'received': Array(7).fill(0)
          },
          'monthly': {
            'sent': Array(12).fill(0),
            'received': Array(12).fill(0)
          },
          'yearly': {}
        }
      }
    };
  }

  init(file) {
    this.showLoadScreen();

    this.fs.importBlob(file, () => {
      // TODO: IMPORTANT need to have a backup plan in case loopback fails
      // currently that can happen if file is not found for example.
      // This will make your script fail miserably right now...

      let fns = [
        {
          path: 'profile_information/profile_information.json',
          name: 'fetching profile information',
          func: this.getBaseData
        },
        {
          path: 'about_you/friend_peer_group.json',
          name: 'fetching who your friends are',
          func: this.getFriendPeerGroup
        },
        {
          path: 'about_you/face_recognition.json',
          name: 'fetching face data',
          func: this.getFaceRecognitionData
        },
        {
          path: 'profile_information/profile_update_history.json',
          name: 'fetching profile updates data',
          func: this.getProfileUpdateData
        },
        {
          path: 'posts/your_posts_1.json',
          name: 'fetching outgoing post data',
          func: this.getPostDataSent
        },
        {
          path: 'posts/other_people\'s_posts_to_your_timeline.json',
          name: 'fetching incoming post data',
          func: this.getPostDataReceived
        },
        {
          path: 'likes_and_reactions/posts_and_comments.json',
          name: 'fetching reaction data',
          func: this.getReactionData
        },
        {
          path: 'search_history/your_search_history.json',
          name: 'fetching search data',
          func: this.getSearchData
        },
        {
          path: 'ads/ads_interests.json',
          name: 'fetching ad data',
          func: this.getAdData
        },
        {
          path: 'ads/advertisers_you\'ve_interacted_with.json',
          name: 'fetching interaction data',
          func: this.getAdInteractionData
        }
      ];

      // execute functions
      for(let i = 0; i < fns.length; i++) {
        this.analyzeFile(fns[i].path, fns[i].func);
        let why = document.createElement('div');
        why.innerHTML = fns[i].name;
        this.cbChain.progress.add(why);
      }

      // analyze each message thread
      this.analyzeDir.call(this, 'messages/inbox', 'message_1.json',
         this.analyzeMessageThread); 

      this.cbChain.initialized();
    });
  }

  // safely gets the attribute of an object
  get(path, object) {
    return path.reduce((xs, x) =>
      (xs && xs[x]) ? xs[x] : 'not found', object)
  }

  // returns the data object holding all facebook gathered info
  // if the fake data flag is present the fake data is returned
  getData(fakeData) {
    return fakeData ? this.fakeData : this.data;
  }


  getAdInteractionData(cbChain, adInteractionInfo) {
    let adInteractionInfoJSON = JSON.parse(adInteractionInfo);
    let interactions =  {};

    // TODO: use safe get
    adInteractionInfoJSON.history.reduce((acc, interaction) => {
      const date = new Date(interaction.timestamp * 1000);

      if (acc[interaction.action]) {
        acc[interaction.action].push({
          'Ad': interaction.title,
          'Interaction Date': date.toDateString()
        });
      }
      else {
        acc[interaction.action] = [];
      }

      return acc;
    }, interactions);

    this.data.adStats.interactions = interactions;
    cbChain.call();
  }

  getAdData(cbChain, adInfo) {
    let adInfoJSON = JSON.parse(adInfo);
    this.data.adStats.topics = adInfoJSON.topics;
    cbChain.call();
  }

  getPostDataSent(cbChain, postInfo) {
    let postInfoJSON = JSON.parse(postInfo);
    this.data.postStats.num_posts_sent = postInfoJSON.length;

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
    }, this.data.postStats);
    cbChain.call();
  }

  getPostDataReceived(cbChain, postInfo) {
    let postInfoJSON = JSON.parse(postInfo);
    this.data.postStats.num_posts_received = postInfoJSON.wall_posts_sent_to_you.activity_log_data.length;

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
    }, this.data.postStats);
    cbChain.call();
  }

  getProfileUpdateData(cbChain, profileUpdateInfo) {
    let profileUpdateJSON = JSON.parse(profileUpdateInfo);
    this.data.last_profile_update = profileUpdateJSON.profile_updates[0].timestamp * 1000;
    cbChain.call();
  }

  getFriendPeerGroup(cbChain, friendPeerInfo) {
    let friendPeerInfoJSON = JSON.parse(friendPeerInfo);
    this.data.friend_peer_group = friendPeerInfoJSON.friend_peer_group;
    cbChain.call();
  }

  getFaceRecognitionData(cbChain, faceRecInfo) {
    let faceRecInfoJSON = JSON.parse(faceRecInfo);
    this.data.face_example_count = faceRecInfoJSON.facial_data.example_count;
    this.data.my_face = faceRecInfoJSON.facial_data.raw_data;
    cbChain.call();
  }

  getSearchData(cbChain, searchInfo) {
    let searchInfoJSON = JSON.parse(searchInfo);
    this.data.searchStats.num_searches = searchInfoJSON.searches.length;
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
    }, this.data.searchStats);
    cbChain.call();
  }

  getReactionData(cbChain, reactionInfo) {
    let reactionInfoJSON = JSON.parse(reactionInfo);
    this.data.reactionStats.num_reactions = reactionInfoJSON.reactions.length;
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
    }, this.data.reactionStats);
    cbChain.call();
  }

  getBaseData(cbChain, profInfo) {
    let profInfoJSON = JSON.parse(profInfo);
    // NEEDED FOR MESSAGES
    // idk about this being here
    this.username = profInfoJSON.profile.name.full_name;

    this.data.name = this.username;
    this.data.joined = profInfoJSON.profile.registration_timestamp * 1000;
    // TODO: need a way to safely access all these variables
    // a function in the baseAnalyzer that will return unknown if it can't
    // find the given json attribute
    this.data.birthday = new Date(
      profInfoJSON.profile.birthday.year,
      profInfoJSON.profile.birthday.month - 1, // months start at 0
      profInfoJSON.profile.birthday.day
    );

    this.data.relationship_count = profInfoJSON.profile.previous_relationships.length
    this.data.relationship_status = profInfoJSON.profile.relationship.status

    cbChain.call();
  }

  analyzeMessageThread(threadName, callback, msg) {
    let msgData = this.data.msgStats;
    let msgJSON = JSON.parse(msg);
    let participants = msgJSON.participants // all participants in the current chat thread
    let group = true;                       // remains true if the chat is a groupchat

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
