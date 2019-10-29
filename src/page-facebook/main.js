// Style imports:
import '../styles/facebook.scss';

// JS imports:
import { DAYS, MONTHS } from '../js/constants.js';
import { formatNum, secondsToHms } from '../js/helpers.js';
import { getTopMessagers, getTopSearches, truncateYears, getCurrentDate, getNumDays, formatDate } from '../js/analyzers/analyzerHelpers.js';
import { FBAnalyzer } from '../js/analyzers/fbAnalyzer.js';
import { NavBar } from '../js/components/navBar.js';
import { FilePicker } from '../js/components/filePicker.js';
import { reportFactory } from '../js/factories/reportFactory.js';
import { chartFactory } from '../js/factories/chartFactory.js';
import { insFactory } from '../js/factories/insFactory.js';

// move data crunching to fbAnalyzer
let data = {
  'name': null,
  'joined': null,
  'brithday': null,
  'relationship_count': null,
  'relationship_status': null,
  'last_profile_update': null,
  'friend_peer_group': null,
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

// THIS IS FOR DEBUG MODE ONLY
// if (DEBUG_MODE) {
let fakeData = require('../assets/fake_data/fb_precompiled.json');
// }

// this is instructions loading. Should stay here only temporarily during development
let test = new insFactory('facebook', document.getElementById('instructions-container'));
// test.createInstructions();

let reportContainer = document.getElementById('report');
let nBar = new NavBar();
let fPicker = new FilePicker(reportContainer);
let rRender = new reportFactory();

// TODO: refactor as helper
let previewBtn = document.getElementById('nav-preview-item');
previewBtn.onclick = () => {
  renderFacebookReport(fakeData, report);
};

kickStartReport();

function kickStartReport() {
  if (!DEBUG_MODE) {
    fPicker.onUpload( (file) => {
      new FBAnalyzer(file, data,
            renderFacebookReport.bind(this, data, reportContainer)
        );
    });
  }
  else {
    renderFacebookReport(data, report);
  }
}

function renderFacebookReport(data) {
  //TODO: needs to scroll to report once done
  renderReportHeading(data, reportContainer);

  // renders message report
  let msgReport = renderMsgReportHeading(data.msgStats, reportContainer);
  renderMsgGraphs(data.msgStats, msgReport);

  // renders search report
  let searchReport = renderSearchReportHeading(data.searchStats, reportContainer);
  renderSearchGraphs(data.searchStats, searchReport);

  // renders post report
  let postReport = renderPostReportHeading(data.postStats, reportContainer);
  renderPostGraphs(data.postStats, postReport);

  // renders reaction report
  let reactionReport = renderReactionReportHeading(data.reactionStats, reportContainer);
  renderReactionGraphs(data.reactionStats, reactionReport);
}

function renderReactionReportHeading(data, parent) {

  let reportItems = [
    {
      icon: 'ismile',
      text: 'Num Likes: ',
      textBold: data.reactions.LIKE,
      tooltip: 'The number of Like reactions you have gifted people on Facebook.'
    },
    {
      icon: 'ismile',
      text: 'Num Loves: ',
      textBold: data.reactions.LOVE,
      tooltip: 'The number of Love reactions you have gifted people on Facebook.'
    },
    {
      icon: 'ismile',
      text: 'Num Sorries: ',
      textBold: data.reactions.SORRY,
      tooltip: 'The number of Sorry reactions you have gifted people on Facebook.'
    },
    {
      icon: 'ismile',
      text: 'Num WOWs: ',
      textBold: data.reactions.WOW,
      tooltip: 'The number of WOW reactions you have gifted people on Facebook.'
    },
    {
      icon: 'ismile',
      text: 'Num Angers: ',
      textBold: data.reactions.ANGER,
      tooltip: 'The number of Anger reactions you have gifted people on Facebook.'
    },
    {
      icon: 'ismile',
      text: 'Num HaHas: ',
      textBold: data.reactions.HAHA,
      tooltip: 'The number of HaHa reactions you have gifted people on Facebook.'
    }
  ];
  console.log(data);

  return rRender.renderSubReport('Search Report', reportContainer, reportItems);
}

function renderPostReportHeading(data, parent) {

  let reportItems = [
    {
      icon: 'itext',
      text: 'Number of posts: ',
      textBold: data.num_posts_sent,
      tooltip: 'The number of posts you have made on Facebook. This includes Groups and Pages posts'
    },
    {
      icon: 'itext',
      text: 'Num Posts on your Timeline: ',
      textBold: data.num_posts_received,
      tooltip: 'The number of posts people and entities have made on your Facebook timeline.'
    }
  ];

  return rRender.renderSubReport('Post Report', reportContainer, reportItems);
}

function renderSearchReportHeading(data, parent) {

  let topSearches = getTopSearches(data.searches, 20);
  let reportItems = [
    {
      icon: 'isearch',
      text: 'Num Searches: ',
      textBold: data.num_searches,
      tooltip: 'The number of searches in the Facebook search bar.'
    },
    {
      icon: 'ismile',
      text: 'Top Searches: ',
      textBold: topSearches,
      tooltip: 'What you search for the most.',
      options: {raw: true}
    }
  ];

  return rRender.renderSubReport('Search Report', reportContainer, reportItems);
}

function renderReportHeading(data, parent) {
  // data crunching
  let dateRange = getCurrentDate();
  let dateStart = new Date(data.joined);
  let numDays = getNumDays(dateStart, dateRange);

  let reportItems = [
    {
      icon: 'icalendar',
      text: 'Date Joined: ',
      textBold: dateStart.toDateString(),
      tooltip: 'Date when you started your Facebook account.'
    },
    {
      icon: 'iactivity',
      text: 'Data Range: ',
      textBold: `${numDays} days`,
      tooltip: 'The number of days you have had your Facebook account for.'
    },
    {
      icon: 'iheart',
      text: 'Relationship Count: ',
      textBold: data.relationship_count,
      tooltip: 'Number of Facebook relationships you have had.'
    },
    {
      icon: 'iheart',
      text: 'Relationship Status: ',
      textBold: data.relationship_status,
      tooltip: 'Your Facebook relationship status.'
    },
    {
      icon: 'icake',
      text: 'Yoour Birthday: ',
      textBold: formatDate(data.birthday),
      tooltip: 'This one is pretty self-explanatory. (:'
    },
    {
      icon: 'iuser',
      text: 'Last Profile Update: ',
      textBold: formatDate(data.last_profile_update),
      tooltip: 'Last time you updated your Facebook profile.'
    },
    {
      icon: 'iusers',
      text: 'Friend Peer Group: ',
      textBold: data.friend_peer_group,
      tooltip: 'How Facebook classifies your friends.'
    },
    {
      icon: 'ismile',
      text: 'Face Count: ',
      textBold: data.face_example_count,
      tooltip: 'Number of pictures of your face Facebook has.'
    },
    {
      icon: 'ismile',
      text: 'Face: ',
      textBold: data.my_face,
      tooltip: 'A code representation of your face.',
      options: {raw: true}
    }
  ];

  return rRender.renderSubReport(data.name, reportContainer, reportItems);
}

function renderMsgReportHeading(data, parent) {
  // data crunching
  // TODO pull out of here maybe
  let totMsgSent = 0
  let totMsgReceived = 0
  let numChats = Object.keys(data['regThreads']).length;
  let numGrChats = data['groupChatThreads'].length;

  Object.keys(data.regThreads).forEach((key) => {
    totMsgSent += data.regThreads[key].msgByUser;
  });

  Object.keys(data.regThreads).forEach((key) => {
    totMsgReceived += data.regThreads[key].other;
  });

  let avgWordsPerMsgSent = data.total_words.sent / totMsgSent;
  let avgWordsPerMsgReceived = data.total_words.received / totMsgReceived;
  let avgMsgPerDaySent =  totMsgSent / data.days_msged.sent;
  let avgMsgPerDayReceived = totMsgReceived / data.days_msged.received;
  let avgCallDuration = data.callStats.total_duration / (data.callStats.num_calls.initiated + data.callStats.num_calls.received);

  let msgData = [
    {
      icon: 'isend',
      text: 'Messages sent:',
      textBold:  formatNum(totMsgSent),
      tooltip: 'The total number of messages you have sent on Facebook.'
    },
    {
      icon: 'imsgcir',
      text: 'Sent messages per day',
      textBold: avgMsgPerDaySent.toFixed(2),
      tooltip: 'Average number of messages sent every day.'
    },
    {
      icon: 'imsgcir',
      text: 'Words per message sent',
      textBold: avgWordsPerMsgSent.toFixed(2),
      tooltip: 'The average number of words in your messages.'
    },
    {
      icon: 'iinbox',
      text: 'Messages received:',
      textBold: formatNum(totMsgReceived),
      tooltip: 'The total number of messages you have received on Facebook.'
    },
    {
      icon: 'imsgcir',
      text: 'Received Messages per day',
      textBold: avgMsgPerDayReceived.toFixed(2),
      tooltip: 'Average number of messages received every day.'
    },
    {
      icon: 'imsgcir',
      text: 'Words per message received',
      textBold: avgWordsPerMsgReceived.toFixed(2),
      tooltip: 'The average number of words in messages you have received.'
    },
    {
      icon: 'imsg',
      text: 'People messaged:',
      textBold: numChats,
      tooltip: 'The total number of people you have messaged on Facebook.'
    },
    {
      icon: 'imsgcir',
      text: 'Group chats:',
      textBold: numGrChats,
      tooltip: 'The total number of group chats you have participated in.'
    },
    {
      icon: 'imsg',
        text: 'Calls started:',
        textBold: data.callStats.num_calls.initiated,
        tooltip: 'The total number of calls you have started on Facebook.'
    },
    {
      icon: 'imsg',
        text: 'Calls received:',
        textBold: data.callStats.num_calls.received,
        tooltip: 'The total number of calls you have received on Facebook.'
    },
    {
      icon: 'imsg',
        text: 'Time spent in calls:',
        // textBold: data.callStats.total_duration,
        textBold: secondsToHms(data.callStats.total_duration),
        tooltip: 'The total time you have spent on a Facebook call'
    },
    {
      icon: 'imsg',
        text: 'Call duration:',
        textBold: secondsToHms(avgCallDuration),
        tooltip: 'The average duration of your calls.'
    }
  ];

  return rRender.renderSubReport('Message Report', parent, msgData);
}

function renderSearchGraphs(searchStats, parent) {
  let searchGraphCont = document.createElement('div');
  searchGraphCont.id = 'graphs-container-searches';
  parent.appendChild(searchGraphCont);

  let graphCont = [];
  
  // TODO: this has gotta be temporary solution
  for (let i = 0; i < 2; i++) {
    let gcontainer = document.createElement('div');
    gcontainer.classList.add('graph-wrapper');
    gcontainer.id = `gs${i}`;
    searchGraphCont.appendChild(gcontainer);
    graphCont.push(gcontainer);
  }

  // INTILIZE chartFactory
  const charFac = new chartFactory('blue');
  // console.log(searchStats.timeStats);

  // hourly searches chart
  charFac.getChart({
    type: 'clock',
    parent: graphCont[0],
    data: searchStats.timeStats.hourly,
    title: 'Searches by Hour of Day',
    colorscheme: 'blue',
    name: 'search-chart1',
    clock_labels: 'search',
    size: 'medium'
  });

  // yearly searches chart
  charFac.getChart({
    type: 'bar',
    parent: graphCont[1],
    name: 'search-chart2',
    title: 'Searches by Year',
    labels: Object.keys(searchStats.timeStats.yearly),
    data: Object.values(searchStats.timeStats.yearly),
    size: 'medium'
  });
}

function renderReactionGraphs(reactionStats, parent) {
  let reactionGraphCont = document.createElement('div');
  reactionGraphCont.id = 'graphs-container-reactions';
  parent.appendChild(reactionGraphCont);

  let graphCont = [];
  
  // TODO: this has gotta be temporary solution
  for (let i = 0; i < 2; i++) {
    let gcontainer = document.createElement('div');
    gcontainer.classList.add('graph-wrapper');
    gcontainer.id = `gr${i}`;
    reactionGraphCont.appendChild(gcontainer);
    graphCont.push(gcontainer);
  }

  // INTILIZE chartFactory
  const charFac = new chartFactory('blue');
  // console.log(reactionStats.timeStats);

  // hourly reactions chart
  charFac.getChart({
    type: 'clock',
    parent: graphCont[0],
    data: reactionStats.timeStats.hourly,
    title: 'Reactions by Hour of Day',
    colorscheme: 'blue',
    name: 'reaction-chart1',
    clock_labels: 'reaction',
    size: 'medium'
  });

  // yearly reactions chart
  charFac.getChart({
    type: 'bar',
    parent: graphCont[1],
    name: 'reaction-chart2',
    title: 'Reactions by Year',
    labels: Object.keys(reactionStats.timeStats.yearly),
    data: Object.values(reactionStats.timeStats.yearly),
    size: 'medium'
  });
}

function renderMsgGraphs(msgReportStats, parent) {
  let msgGraphCont = document.createElement('div');
  msgGraphCont.id = 'graphs-container-messages';
  parent.appendChild(msgGraphCont);

  let graphCont = [];
  
  // TODO: this has gotta be temporary solution
  for (let i = 0; i < 7; i++) {
    let gcontainer = document.createElement('div');
    gcontainer.classList.add('graph-wrapper');
    gcontainer.id = `g${i}`;
    msgGraphCont.appendChild(gcontainer);
    graphCont.push(gcontainer);
  }

  // INTILIZE chartFactory
  const charFac = new chartFactory('blue');

  // hoourly messages chart
  charFac.getChart({
    type: 'clock',
    parent: graphCont[0],
    data: msgReportStats.timeStats.hourly.sent,
    title: 'Messages by Hour of Day - Sent',
    colorscheme: 'blue',
    name: 'chart1',
    clock_labels: 'messag',
    size: 'medium'
  });

  charFac.getChart({
    type: 'clock',
    parent: graphCont[1],
    data: msgReportStats.timeStats.hourly.received,
    title: 'Messages by Hour of Day - Received',
    colorscheme: 'blue',
    name: 'chart2',
    clock_labels: 'messag',
    size: 'medium'
  });

  // daily messages chart
  let msgSentDaily = msgReportStats.timeStats.weekly.sent;
  let msgReceivedDaily = msgReportStats.timeStats.weekly.received;
  // HACK BECAUSE FRAPPE CHARTS ARE BROKEN :(((((
  msgSentDaily.push(0);
  charFac.getChart({
    type: 'axis-mixed',
    parent: graphCont[2],
    name: 'chart3',
    title: 'Messages by Day of the Week',
    labels: DAYS,
    data: [msgSentDaily, msgReceivedDaily, ['Sent', 'Received']],
    size: 'medium'
  });

  // monthly messages chart
  let msgSentMonthly = msgReportStats.timeStats.monthly.sent;
  let msgReceivedMonthly = msgReportStats.timeStats.monthly.received;
  // HACK BECAUSE FRAPPE CHARTS ARE BROKEN :(((((
  msgSentMonthly.push(0);
  charFac.getChart({
    type: 'axis-mixed',
    parent: graphCont[3],
    name: 'chart4',
    title: 'Messages by Month',
    labels: MONTHS,
    data: [msgSentMonthly, msgReceivedMonthly, ['Sent', 'Received']],
    size: 'medium'
  });

  // yearly messagages chart
  let msgSentYearly = Object.keys(msgReportStats.timeStats.yearly).map((y) => {
    return msgReportStats.timeStats.yearly[y].sent
  });
  let msgReceivedYearly= Object.keys(msgReportStats.timeStats.yearly).map((y) => {
    return msgReportStats.timeStats.yearly[y].received
  });
  // HACK BECAUSE FRAPPE CHARTS ARE BROKEN :(((((
  msgSentYearly.push(0);

  charFac.getChart({
    type: 'axis-mixed',
    parent: graphCont[4],
    name: 'chart5',
    title: 'Messages by Year',
    labels: Object.keys(msgReportStats.timeStats.yearly),
    data: [msgSentYearly, msgReceivedYearly, ['Sent', 'Received']],
    size: 'medium'
  });

  // this is just having fun. THINK ABOUT HOW DATA NEEDS TO BE STRUCTURED
  // THIS IS NOT FUNCTIONAL?
  let sum = 0;
  let msgCumulative = Object.keys(msgReportStats.timeStats.yearly).reduce((acc, dp) => {
    sum += msgReportStats.timeStats.yearly[dp].sent + msgReportStats.timeStats.yearly[dp].received;
    acc[dp] = sum;
    return acc;
  }, {});

  charFac.getChart({
    type: 'line',
    parent: graphCont[5],
    name: 'chart6',
    title: 'Cumulative Messages over Years',
    data: Object.values(msgCumulative),
    labels: Object.keys(msgCumulative),
    size: 'medium'
  });

  // top messegers chart 
  let topMessagers = getTopMessagers(msgReportStats.regThreads, 15)
  let msgSent = topMessagers.reduce(function(acc, msger) {
    let cnt1 = msgReportStats.regThreads[msger]["msgByUser"];
    acc.push(cnt1);
    return acc;
  }, []);

  let msgReceived = topMessagers.reduce(function(acc, msger) {
    let cnt1 = msgReportStats.regThreads[msger]["other"];
    acc.push(cnt1);
    return acc;
  }, []);

  charFac.getChart({
    type: 'axis-mixed',
    parent: graphCont[6],
    name: 'chart7',
    title: 'Top Messagers',
    labels: topMessagers,
    data: [msgSent, msgReceived, [`${data.name}`, 'Friend']],
    size: 'medium'
  });
}

function renderPostGraphs(postReportStats, parent) {
  let postGraphCont = document.createElement('div');
  postGraphCont.id = 'graphs-container-posts';
  parent.appendChild(postGraphCont);

  let graphCont = [];
  
  // TODO: this has gotta be temporary solution
  for (let i = 0; i < 6; i++) {
    let gcontainer = document.createElement('div');
    gcontainer.classList.add('graph-wrapper');
    gcontainer.id = `pg${i}`;
    postGraphCont.appendChild(gcontainer);
    graphCont.push(gcontainer);
  }

  // INTILIZE chartFactory
  const charFac = new chartFactory('blue');

  // hoourly posts chart
  charFac.getChart({
    type: 'clock',
    parent: graphCont[0],
    data: postReportStats.timeStats.hourly.sent,
    title: 'Posts by Hour of Day - Sent',
    colorscheme: 'blue',
    name: 'post-chart1',
    clock_labels: 'post',
    size: 'medium'
  });

  charFac.getChart({
    type: 'clock',
    parent: graphCont[1],
    data: postReportStats.timeStats.hourly.received,
    title: 'Posts by Hour of Day - Received',
    colorscheme: 'blue',
    name: 'post-chart2',
    clock_labels: 'post',
    size: 'medium'
  });

  // daily posts chart
  let postSentDaily = postReportStats.timeStats.weekly.sent;
  let postReceivedDaily = postReportStats.timeStats.weekly.received;
  // HACK BECAUSE FRAPPE CHARTS ARE BROKEN :(((((
  postSentDaily.push(0);
  charFac.getChart({
    type: 'axis-mixed',
    parent: graphCont[2],
    name: 'post-chart3',
    title: 'Posts by Day of the Week',
    labels: DAYS,
    data: [postSentDaily, postReceivedDaily, ['Posted', 'Posted by others on Timeline']],
    size: 'medium'
  });

  // monthly posts chart
  let postSentMonthly = postReportStats.timeStats.monthly.sent;
  let postReceivedMonthly = postReportStats.timeStats.monthly.received;
  // HACK BECAUSE FRAPPE CHARTS ARE BROKEN :(((((
  postSentMonthly.push(0);
  charFac.getChart({
    type: 'axis-mixed',
    parent: graphCont[3],
    name: 'post-chart4',
    title: 'Posts by Month',
    labels: MONTHS,
    data: [postSentMonthly, postReceivedMonthly, ['Posted', 'Posted by others on Timeline']],
    size: 'medium'
  });

  // yearly messagages chart
  let postSentYearly = Object.keys(postReportStats.timeStats.yearly).map((y) => {
    return postReportStats.timeStats.yearly[y].sent
  });
  let postReceivedYearly= Object.keys(postReportStats.timeStats.yearly).map((y) => {
    return postReportStats.timeStats.yearly[y].received
  });
  // HACK BECAUSE FRAPPE CHARTS ARE BROKEN :(((((
  postSentYearly.push(0);

  charFac.getChart({
    type: 'axis-mixed',
    parent: graphCont[4],
    name: 'post-chart5',
    title: 'Posts by Year',
    labels: Object.keys(postReportStats.timeStats.yearly),
    data: [postSentYearly, postReceivedYearly, ['Posted', 'Posted by others on Timeline']],
    size: 'medium'
  });

  // this is just having fun. THINK ABOUT HOW DATA NEEDS TO BE STRUCTURED
  // THIS IS NOT FUNCTIONAL?
  let sum = 0;
  let postCumulative = Object.keys(postReportStats.timeStats.yearly).reduce((acc, dp) => {
    sum += postReportStats.timeStats.yearly[dp].sent + postReportStats.timeStats.yearly[dp].received;
    acc[dp] = sum;
    return acc;
  }, {});

  charFac.getChart({
    type: 'line',
    parent: graphCont[5],
    name: 'post-chart6',
    title: 'Cumulative Posts over Years',
    data: Object.values(postCumulative),
    labels: Object.keys(postCumulative),
    size: 'medium'
  });

  // top messegers chart 
  // let topMessagers = getTopMessagers(postReportStats.regThreads, 15)
  // let postSent = topMessagers.reduce(function(acc, poster) {
  //   let cnt1 = postReportStats.regThreads[poster]["postByUser"];
  //   acc.push(cnt1);
  //   return acc;
  // }, []);

  // let postReceived = topMessagers.reduce(function(acc, poster) {
  //   let cnt1 = postReportStats.regThreads[poster]["other"];
  //   acc.push(cnt1);
  //   return acc;
  // }, []);

  // charFac.getChart({
  //   type: 'axis-mixed',
  //   parent: graphCont[6],
  //   name: 'post-chart7',
  //   title: 'Top Messagers',
  //   labels: topMessagers,
  //   data: [postSent, postReceived, [`${data.name}`, 'Friend']],
  //   size: 'medium'
  // });
}
