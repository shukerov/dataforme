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
      'number_profile_updates': null,
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
        this.analyzeFile(fns[i]);
      }

      // analyze each message thread
      this.analyzeDir.call(this, 'messages/inbox', 'message_1.json',
         this.analyzeMessageThread); 

      this.cbChain.initialized();
    });
  }

  getAdInteractionData(cbChain, adInteractionInfo) {
    let adInteractionInfoJSON = JSON.parse(adInteractionInfo);
    let interactions =  {};

    // extract data
    const ad_history = this.get(['history'], adInteractionInfoJSON);

    if (ad_history != 'not found') {
      ad_history.reduce((acc, interaction) => {
        const action = this.get(['action'], interaction);
        const title = this.get(['title'], interaction);
        const timestamp = this.get(['timestamp'], interaction);

        if (timestamp == 'not found' || action == 'not found' ||
            title == 'not found'
        ) return acc;

        const date = new Date(timestamp * 1000);

        if (acc[action]) {
          acc[action].push({
            'Ad': title,
            'Interaction Date': date.toDateString()
          });
        }
        else {
          acc[action] = [];
        }

        return acc;
      }, interactions);
    }

    this.data.adStats.interactions = interactions;
    cbChain.call();
  }


  getAdData(cbChain, adInfo) {
    let adInfoJSON = JSON.parse(adInfo);

    // extract data
    const ad_interests = this.get(['topics'], adInfoJSON);
    if (ad_interests != 'not found') {
      this.data.adStats.topics = ad_interests;
    }

    cbChain.call();
  }


  getPostDataSent(cbChain, postInfo) {
    let postInfoJSON = JSON.parse(postInfo);

    // extract data
    this.data.postStats.num_posts_sent = this.get(['length'], postInfoJSON);

    postInfoJSON.reduce((acc, post) => {
      const post_date = this.get(['timestamp'], post);

      // no post_date found :(
      if (post_date == 'not found') {
        return acc;
      }

      let d = new Date(post_date * 1000);
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

    // extract data
    const received_posts = this.get(['wall_posts_sent_to_you', 'activity_log_data'], postInfoJSON);

    if (received_posts != 'not found') {
      this.data.postStats.num_posts_received = received_posts.length;

      received_posts.reduce((acc, post) => {
        const post_date = this.get(['timestamp'], post);

        // no post_date found :(
        if (post_date == 'not found') {
          return acc;
        }

        let d = new Date(post_date * 1000);
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
    }

    cbChain.call();
  }


  getProfileUpdateData(cbChain, profileUpdateInfo) {
    let profileUpdateJSON = JSON.parse(profileUpdateInfo);

    // extract data
    const profile_updates = this.get(['profile_updates'], profileUpdateJSON);

    if (profile_updates != 'not found' && profile_updates.length > 0) {
      this.data.last_profile_update = profile_updates[0].timestamp * 1000;
      this.data.number_profile_updates = profile_updates.length;
    }
    else {
      this.data.last_profile_update = 'not found';
      this.data.number_profile_updates = 'not found';
    }
    cbChain.call();
  }


  getFriendPeerGroup(cbChain, friendPeerInfo) {
    let friendPeerInfoJSON = JSON.parse(friendPeerInfo);

    // extract data
    const friend_peer_group = this.get(['friend_peer_group'], friendPeerInfoJSON);
    this.data.friend_peer_group = friend_peer_group;

    cbChain.call();
  }


  getFaceRecognitionData(cbChain, faceRecInfo) {
    let faceRecInfoJSON = JSON.parse(faceRecInfo);

    // extract data
    const facial_data = this.get(['facial_data'], faceRecInfoJSON);
    this.data.face_example_count = this.get(['example_count'], facial_data);
    this.data.my_face = this.get(['raw_data'], facial_data);

    cbChain.call();
  }


  getSearchData(cbChain, searchInfo) {
    let searchInfoJSON = JSON.parse(searchInfo);

    // extract data
    const searches = this.get(['searches'], searchInfoJSON);
    this.data.searchStats.num_searches = searches.length;

    if (searches != 'not found') {
      searches.reduce(function(acc, search) {
        // skip empty searches
        if (!search.data || !search.data[0]) {
          return acc;
        }

        // gets all of the searches you made with a count next to them
        const search_text = this.get(['text'], search.data[0]);
        let search_key = search_text.toLowerCase();
        if (search_key == 'not found') return acc;

        if (acc.searches[search_key]) {
          acc.searches[search_key] += 1;
        }
        else {
          acc.searches[search_key] = 1;
        }

        // gets time statistics
        const timestamp = this.get(['timestamp'], search);
        if (timestamp == 'not found') return acc;

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
      }.bind(this), this.data.searchStats);
    }
    cbChain.call();
  }


  getReactionData(cbChain, reactionInfo) {
    let reactionInfoJSON = JSON.parse(reactionInfo);

    // extract data
    const reactions = this.get(['reactions'], reactionInfoJSON);
    this.data.reactionStats.num_reactions = this.get(['length'], reactions);

    if (reactions != 'not found') {
      reactions.reduce(function(acc, reaction) {
        // skip empty reactions
        if (!reaction.data || !reaction.data[0]) {
          return acc;
        }

        // gets all of the count for every type of reaction the user made
        let reaction_key = this.get(['reaction', 'reaction'], reaction.data[0]);
        if (reaction_key == 'not found') return acc;

        if (acc.reactions[reaction_key]) {
          acc.reactions[reaction_key] += 1;
        }
        else {
          acc.reactions[reaction_key] = 1;
        }

        // gets time statistics
        const timestamp = this.get(['timestamp'], reaction);
        if (timestamp == 'not found') return acc;

        let d = new Date(timestamp * 1000);
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
      }.bind(this), this.data.reactionStats);
    }
    cbChain.call();
  }


  getBaseData(cbChain, profInfo) {
    let profInfoJSON = JSON.parse(profInfo);
    
    // extracting data
    const username = this.get(['profile', 'name', 'full_name'], profInfoJSON);
    this.username = username;
    this.data.name = this.username;

    const joined_date = this.get(['profile', 'registration_timestamp'], profInfoJSON);
    this.data.joined = joined_date * 1000;

    const birthday = this.get(['profile', 'birthday'], profInfoJSON);
    if (birthday != 'not found' && birthday.year && birthday.month && birthday.day) {
      this.data.birthday = new Date(
        birthday.year,
        birthday.month - 1, // months start at 0
        birthday.day
      );
    }
    else {
      this.data.brithday = 'not found';
    }

    const previous_relationships = this.get(['profile', 'previous_relationships'], profInfoJSON);
    const relationship_status = this.get(['profile', 'relationship', 'status'], profInfoJSON);
    this.data.relationship_count = previous_relationships.length;
    this.data.relationship_status = relationship_status;

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
