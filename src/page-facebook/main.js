// JS imports:
import { DAYS, MONTHS } from '../js/constants.js';
import { formatNum, secondsToHms } from '../js/helpers.js';
import { getTopMessagers, getTopSearches, truncateYears, getCurrentDate, getNumDays, formatDate, safeDivide } from '../js/analyzers/analyzerHelpers.js';
import { FBAnalyzer } from '../js/analyzers/fbAnalyzer.js';
import { NavBar } from '../js/components/navBar.js';
import { FilePicker } from '../js/components/filePicker.js';
import { reportFactory } from '../js/factories/reportFactory.js';
import { insFactory } from '../js/factories/insFactory.js';

// CSS imports:
import '../styles/facebook.scss';
import website_icon from '../images/icons/facebook_inline.svg';

// this is instructions loading. Should stay here only temporarily during development
let instructions = new insFactory('facebook', document.getElementById('instructions-container'));
let rRender = new reportFactory('facebook');
let nBar = new NavBar();
let fPicker = new FilePicker(document.getElementById('filepicker'));
let analyzer = new FBAnalyzer(renderReport);
let websiteIcon = document.getElementById('website-icon');
websiteIcon.innerHTML = website_icon;



let previewBtn = document.getElementById('preview-btn');
previewBtn.onclick = () => {
  renderReport(true);
};

kickStartReport();

function kickStartReport() {
  if (!DEBUG_MODE) {
    fPicker.onUpload((file) => { analyzer.init(file) });
  }
  else {
    renderReport(true);
  }
}

function renderReport(fakeData) {
  //TODO: needs to scroll to report once done
  const data = analyzer.getData(fakeData);
  renderReportHeading(data);

  // renders ad report
  let adReport = renderAdReport(data.adStats);

  // renders search report
  let searchReport = renderSearchReport(data.searchStats);

  // renders message report
  let msgReport = renderMsgReport(data.msgStats);

  // renders reaction report
  let reactionReport = renderReactionReport(data.reactionStats);

  // renders post report
  let postReport = renderPostReport(data.postStats);
}

function renderReportHeading(data) {
  // data crunching
  let dateRange = getCurrentDate();
  let dateStart = new Date(data.joined);
  let numDays = getNumDays(dateStart, dateRange);

  let reportItems = [
    {
      icon: 'calendar',
      text: 'Date Joined: ',
      textBold: dateStart.toDateString(),
      tooltip: 'Date when you started your Facebook account.'
    },
    {
      icon: 'activity',
      text: 'Data Range: ',
      textBold: `${numDays} days`,
      tooltip: 'The number of days you have had your Facebook account for.'
    },
    {
      icon: 'heart',
      text: 'Relationship Count: ',
      textBold: data.relationship_count,
      tooltip: 'Number of Facebook relationships you have had.'
    },
    {
      icon: 'heart',
      text: 'Relationship Status: ',
      textBold: data.relationship_status,
      tooltip: 'Your Facebook relationship status.'
    },
    {
      icon: 'cake',
      text: 'Birthday: ',
      textBold: formatDate(data.birthday),
      tooltip: 'This one is pretty self-explanatory. (:'
    },
    {
      icon: 'user',
      text: 'Last Profile Update: ',
      textBold: formatDate(data.last_profile_update),
      tooltip: 'Last time you updated your Facebook profile.'
    },
    {
      icon: 'user',
      text: 'Profile Updates: ',
      textBold: data.number_profile_updates,
      tooltip: 'The number of times you have updated your Facebook profile.'
    },
    {
      icon: 'users',
      text: 'Friend Peer Group: ',
      textBold: data.friend_peer_group,
      tooltip: 'How Facebook classifies your friends.'
    },
    {
      icon: 'smile',
      text: 'Face Count: ',
      textBold: data.face_example_count,
      tooltip: 'Number of pictures of your face Facebook has.'
    }
  ];

  let faceData = [{
      icon: 'smile',
      text: 'Face: ',
      rawData: data.my_face,
      tooltip: 'A code representation of your face.'
    }];

  const subreport = rRender.getSubreport(data.name);
  rRender.add(reportItems, 'icon-list', subreport);
  rRender.add(faceData, 'raw', subreport);
}

function renderMsgReport(data) {
  // data crunching
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

  let avgWordsPerMsgSent = safeDivide(data.total_words.sent, totMsgSent);
  let avgWordsPerMsgReceived = safeDivide(data.total_words.received, totMsgReceived);
  // let avgMsgPerDaySent = safeDivide(totMsgSent, data.days_msged.sent);
  // let avgMsgPerDayReceived = safeDivide(totMsgReceived, data.days_msged.received);
  let avgCallDuration = safeDivide(data.callStats.total_duration, (data.callStats.num_calls.initiated + data.callStats.num_calls.received));

  let msgData = [
    {
      icon: 'send',
      text: 'Messages sent:',
      textBold:  formatNum(totMsgSent),
      tooltip: 'The total number of messages you have sent on Facebook.'
    },
    // {
    //   icon: 'message-circle',
    //   text: 'Sent messages per day',
    //   textBold: avgMsgPerDaySent.toFixed(2),
    //   tooltip: 'Average number of messages sent every day.'
    // },
    {
      icon: 'message-circle',
      text: 'Words per message sent',
      textBold: avgWordsPerMsgSent.toFixed(2),
      tooltip: 'The average number of words in your messages.'
    },
    {
      icon: 'inbox',
      text: 'Messages received:',
      textBold: formatNum(totMsgReceived),
      tooltip: 'The total number of messages you have received on Facebook.'
    },
    // {
    //   icon: 'message-circle',
    //   text: 'Received Messages per day',
    //   textBold: avgMsgPerDayReceived.toFixed(2),
    //   tooltip: 'Average number of messages received every day.'
    // },
    {
      icon: 'message-circle',
      text: 'Words per message received',
      textBold: avgWordsPerMsgReceived.toFixed(2),
      tooltip: 'The average number of words in messages you have received.'
    },
    {
      icon: 'message-square',
      text: 'People messaged:',
      textBold: numChats,
      tooltip: 'The total number of people you have messaged on Facebook.'
    },
    {
      icon: 'message-circle',
      text: 'Group chats:',
      textBold: numGrChats,
      tooltip: 'The total number of group chats you have participated in.'
    },
    {
      icon: 'message-square',
      text: 'Calls started:',
      textBold: data.callStats.num_calls.initiated,
      tooltip: 'The total number of calls you have started on Facebook.'
    },
    {
      icon: 'message-square',
      text: 'Calls received:',
      textBold: data.callStats.num_calls.received,
      tooltip: 'The total number of calls you have received on Facebook.'
    },
    {
      icon: 'message-square',
      text: 'Time spent in calls:',
      textBold: secondsToHms(data.callStats.total_duration),
      tooltip: 'The total time you have spent on a Facebook call'
    },
    {
      icon: 'message-square',
      text: 'Call duration:',
      textBold: secondsToHms(avgCallDuration),
      tooltip: 'The average duration of your calls.'
    }
  ];

  const subreport = rRender.getSubreport('Message Report');
  rRender.add(msgData, 'icon-list', subreport);
  renderMsgGraphs(data, subreport);
}

function renderMsgGraphs(data, subreport) {
  rRender.getSubreportGraphContainer('graphs-container-messages', subreport);

  rRender.addGraph(subreport, {
    type: 'clock',
    title: 'Messages by Hour of Day - Sent',
    data: data.timeStats.hourly.sent,
    css_label: 'msg-graph',
    clock_labels: 'messag',
    size: 'medium'
  });

  rRender.addGraph(subreport, {
    type: 'clock',
    title: 'Messages by Hour of Day - Received',
    data: data.timeStats.hourly.received,
    css_label: 'msg-graph',
    clock_labels: 'messag',
    size: 'medium'
  });

  // daily messages chart
  let msgSentDaily = data.timeStats.weekly.sent;
  let msgReceivedDaily = data.timeStats.weekly.received;
  // HACK BECAUSE FRAPPE CHARTS ARE BROKEN :(((((
  msgSentDaily.push(0);
  rRender.addGraph(subreport, {
    type: 'axis-mixed',
    title: 'Messages by Day of the Week',
    data: [msgSentDaily, msgReceivedDaily, ['Sent', 'Received']],
    labels: DAYS,
    css_label: 'msg-graph',
    size: 'medium'
  });

  // monthly messages chart
  let msgSentMonthly = data.timeStats.monthly.sent;
  let msgReceivedMonthly = data.timeStats.monthly.received;
  // HACK BECAUSE FRAPPE CHARTS ARE BROKEN :(((((
  msgSentMonthly.push(0);
  rRender.addGraph(subreport, {
    type: 'axis-mixed',
    title: 'Messages by Month',
    data: [msgSentMonthly, msgReceivedMonthly, ['Sent', 'Received']],
    labels: MONTHS,
    css_label: 'msg-graph',
    size: 'medium'
  });

  // yearly messagages chart
  let msgSentYearly = Object.keys(data.timeStats.yearly).map((y) => {
    return data.timeStats.yearly[y].sent
  });
  let msgReceivedYearly= Object.keys(data.timeStats.yearly).map((y) => {
    return data.timeStats.yearly[y].received
  });
  // HACK BECAUSE FRAPPE CHARTS ARE BROKEN :(((((
  msgSentYearly.push(0);

  rRender.addGraph(subreport, {
    type: 'axis-mixed',
    title: 'Messages by Year',
    data: [msgSentYearly, msgReceivedYearly, ['Sent', 'Received']],
    labels: Object.keys(data.timeStats.yearly),
    css_label: 'msg-graph',
    size: 'medium'
  });

  // this is just having fun. THINK ABOUT HOW DATA NEEDS TO BE STRUCTURED
  // THIS IS NOT FUNCTIONAL?
  let sum = 0;
  let msgCumulative = Object.keys(data.timeStats.yearly).reduce((acc, dp) => {
    sum += data.timeStats.yearly[dp].sent + data.timeStats.yearly[dp].received;
    acc[dp] = sum;
    return acc;
  }, {});

  rRender.addGraph(subreport, {
    type: 'line',
    title: 'Cumulative Messages over Years',
    data: Object.values(msgCumulative),
    labels: Object.keys(msgCumulative),
    css_label: 'msg-graph',
    size: 'medium'
  });

  // top messegers chart 
  let topMessagers = getTopMessagers(data.regThreads, 15)
  let msgSent = topMessagers.reduce(function(acc, msger) {
    let cnt1 = data.regThreads[msger]["msgByUser"];
    acc.push(cnt1);
    return acc;
  }, []);

  let msgReceived = topMessagers.reduce(function(acc, msger) {
    let cnt1 = data.regThreads[msger]["other"];
    acc.push(cnt1);
    return acc;
  }, []);

  // get top messagers names
  let topMessagersNames = topMessagers.reduce((acc, thread) => {
    acc.push(data.regThreads[thread].messager);
    return acc;
  }, []);

  rRender.addGraph(subreport, {
    type: 'axis-mixed',
    title: 'Top Messagers',
    data: [msgSent, msgReceived, [`${data.name}`, 'Friend']],
    labels: topMessagersNames,
    css_label: 'msg-graph',
    size: 'medium'
  });
}


function renderSearchReport(data, parent) {

  let searchData = [
    {
      icon: 'search',
      text: 'Num Searches: ',
      textBold: data.num_searches,
      tooltip: 'The number of searches in the Facebook search bar.'
    }
  ];

  const subreport = rRender.getSubreport('Search Report');
  rRender.add(searchData, 'icon-list', subreport);
  
  // render graphs
  rRender.getSubreportGraphContainer('graphs-container-searches', subreport);

  let topSearches = getTopSearches(data.searches, 20);
  rRender.addGraph(subreport, {
    type: 'bar',
    title: 'Top Searches',
    data: Object.values(topSearches),
    labels: Object.keys(topSearches),
    css_label: 'search-graph',
    size: 'medium'
  });

  // hourly searches chart
  rRender.addGraph(subreport, {
    type: 'clock',
    data: data.timeStats.hourly,
    title: 'Searches by Hour of Day',
    clock_labels: 'search',
    css_label: 'search-graph',
    size: 'medium'
  });

  // yearly searches chart
  rRender.addGraph(subreport, {
    type: 'bar',
    title: 'Searches by Year',
    data: Object.values(data.timeStats.yearly),
    labels: Object.keys(data.timeStats.yearly),
    css_label: 'search-graph',
    size: 'medium'
  });
}


function renderPostReport(data, parent) {

  let postData = [
    {
      icon: 'file-text',
      text: 'Number of posts: ',
      textBold: data.num_posts_sent,
      tooltip: 'The number of posts you have made on Facebook. This includes Groups and Pages posts'
    },
    {
      icon: 'file-text',
      text: 'Num Posts on your Timeline: ',
      textBold: data.num_posts_received,
      tooltip: 'The number of posts people and entities have made on your Facebook timeline.'
    }
  ];

  const subreport = rRender.getSubreport('Post Report');
  rRender.add(postData, 'icon-list', subreport);
  renderPostGraphs(data, subreport);
}


function renderPostGraphs(data, subreport) {
  rRender.getSubreportGraphContainer('graphs-container-posts', subreport);

  // hourly posts chart
  rRender.addGraph(subreport, {
    type: 'clock',
    title: 'Posts by Hour of Day - Sent',
    data: data.timeStats.hourly.sent,
    clock_labels: 'post',
    css_label: 'post-graph',
    size: 'medium'
  });

  rRender.addGraph(subreport, {
    type: 'clock',
    data: data.timeStats.hourly.received,
    title: 'Posts by Hour of Day - Received',
    clock_labels: 'post',
    css_label: 'post-graph',
    size: 'medium'
  });

  // daily posts chart
  let postSentDaily = data.timeStats.weekly.sent;
  let postReceivedDaily = data.timeStats.weekly.received;
  // HACK BECAUSE FRAPPE CHARTS ARE BROKEN :(((((
  postSentDaily.push(0);
  rRender.addGraph(subreport, {
    type: 'axis-mixed',
    title: 'Posts by Day of the Week',
    data: [postSentDaily, postReceivedDaily, ['Posted', 'Posted by others on Timeline']],
    labels: DAYS,
    css_label: 'post-graph',
    size: 'medium'
  });

  // monthly posts chart
  let postSentMonthly = data.timeStats.monthly.sent;
  let postReceivedMonthly = data.timeStats.monthly.received;
  // HACK BECAUSE FRAPPE CHARTS ARE BROKEN :(((((
  postSentMonthly.push(0);
  rRender.addGraph(subreport, {
    type: 'axis-mixed',
    title: 'Posts by Month',
    data: [postSentMonthly, postReceivedMonthly, ['Posted', 'Posted by others on Timeline']],
    labels: MONTHS,
    css_label: 'post-graph',
    size: 'medium'
  });

  // yearly messagages chart
  let postSentYearly = Object.keys(data.timeStats.yearly).map((y) => {
    return data.timeStats.yearly[y].sent
  });
  let postReceivedYearly= Object.keys(data.timeStats.yearly).map((y) => {
    return data.timeStats.yearly[y].received
  });
  // HACK BECAUSE FRAPPE CHARTS ARE BROKEN :(((((
  postSentYearly.push(0);
  rRender.addGraph(subreport, {
    type: 'axis-mixed',
    title: 'Posts by Year',
    labels: Object.keys(data.timeStats.yearly),
    data: [postSentYearly, postReceivedYearly, ['Posted', 'Posted by others on Timeline']],
    css_label: 'post-graph',
    size: 'medium'
  });

  // this is just having fun. THINK ABOUT HOW DATA NEEDS TO BE STRUCTURED
  // THIS IS NOT FUNCTIONAL?
  let sum = 0;
  let postCumulative = Object.keys(data.timeStats.yearly).reduce((acc, dp) => {
    sum += data.timeStats.yearly[dp].sent + data.timeStats.yearly[dp].received;
    acc[dp] = sum;
    return acc;
  }, {});

  rRender.addGraph(subreport, {
    type: 'line',
    data: Object.values(postCumulative),
    title: 'Cumulative Posts over Years',
    labels: Object.keys(postCumulative),
    css_label: 'post-graph',
    size: 'medium'
  });
}


function renderReactionReport(data) {

  let reactionData = [
    {
      icon: 'thumbs-up-fa',
      text: 'Num Likes: ',
      textBold: data.reactions.LIKE,
      tooltip: 'The number of Like reactions you have gifted people on Facebook.'
    },
    {
      icon: 'heart-solid-fa',
      textBold: data.reactions.LOVE,
      tooltip: 'The number of Love reactions you have gifted people on Facebook.'
    },
    {
      icon: 'cry-fa',
      text: 'Num Sorries: ',
      textBold: data.reactions.SORRY,
      tooltip: 'The number of Sorry reactions you have gifted people on Facebook.'
    },
    {
      icon: 'smile-fa',
      text: 'Num WOWs: ',
      textBold: data.reactions.WOW,
      tooltip: 'The number of WOW reactions you have gifted people on Facebook.'
    },
    {
      icon: 'angry-fa',
      text: 'Num Angers: ',
      textBold: data.reactions.ANGER,
      tooltip: 'The number of Anger reactions you have gifted people on Facebook.'
    },
    {
      icon: 'laugh-fa',
      textBold: data.reactions.HAHA,
      tooltip: 'The number of HaHa reactions you have gifted people on Facebook.'
    }
  ];

  const subreport = rRender.getSubreport('Reaction Report');
  rRender.add(reactionData, 'big-icon-list', subreport);
  
  // render graphs
  rRender.getSubreportGraphContainer('graphs-container-reactions', subreport);

  // hourly reactions chart
  rRender.addGraph(subreport, {
    type: 'clock',
    data: data.timeStats.hourly,
    title: 'Reactions by Hour of Day',
    clock_labels: 'reaction',
    css_label: 'reaction-graph',
    size: 'medium'
  });

  // yearly reactions chart
  rRender.addGraph(subreport, {
    type: 'bar',
    title: 'Reactions by Year',
    labels: Object.keys(data.timeStats.yearly),
    data: Object.values(data.timeStats.yearly),
    css_label: 'reaction-graph',
    size: 'medium'
  });
}

function renderAdReport(data) {
  let reportItems = [
    {
      icon: 'target',
      text: 'Ad Interests Num: ',
      textBold: data.topics.length,
      tooltip: 'How many interests you have according to Facebook.'
    }
  ]

  let adInterests = [{
      icon: 'shopping-bag',
      text: 'Ad Interests: ',
      type: 'list',
      listData: data.topics,
      tooltip: 'What Facebook thinks you are interested in.'
    }
  ]

  let adInteractions = {
      icon: 'mouse-pointer',
      text: 'Ad Interactions: ',
      listData: data.interactions,
      tooltip: 'Ads you have interacted with on Facebook'
  };

  const subreport = rRender.getSubreport('Ad Report');
  rRender.add(reportItems, 'icon-list', subreport);
  rRender.add(adInterests, 'list', subreport);
  rRender.add(adInteractions, 'list-headings', subreport);
}
