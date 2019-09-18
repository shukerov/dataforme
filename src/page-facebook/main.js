// Style imports:
import '../styles/main.scss';
import '../styles/facebook.scss';

// JS imports:
import { DAYS, MONTHS } from '../js/constants.js';
import { formatNum } from '../js/helpers.js';
import { getTopMessagers, truncateYears, getCurrentDate, getNumDays, formatDate } from '../js/analyzers/analyzerHelpers.js';
import { FBAnalyzer } from '../js/analyzers/fbAnalyzer.js';
import { NavBar } from '../js/components/navBar.js';
import { FilePicker } from '../js/components/filePicker.js';
import { reportFactory } from '../js/factories/reportFactory.js';
import { chartFactory } from '../js/factories/chartFactory.js';
import { insFactory } from '../js/factories/insFactory.js';

let data = {
  'name': 'unknown',
  'joined': null,
  'brithday': 'unknown',
  'num_posts': 'unknown',
  'num_searches': 'unknown',
  'friend_peer_group': 'unknown',
  'msgStats': {
    'groupChatThreads': [],
    'regThreads': {},
    'numPictures': {'gifs': 0, 'other': 0},
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
if (DEBUG_MODE) {
  data = require('../data/fb_precompiled.json');
}

// this is instructions loading. Should stay here only temporarily during development
let test = new insFactory('facebook', document.getElementById('instructions-container'));
// test.createInstructions();

let reportContainer = document.getElementById('report');
let nBar = new NavBar(document.getElementById('site'));
let fPicker = new FilePicker(reportContainer);
let rRender = new reportFactory();

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
  renderReportHeading(data, reportContainer);

  // renders message report
  let msgReport = renderMsgReportHeading(data.msgStats, reportContainer);
  renderMsgGraphs(data.msgStats, msgReport);
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
      icon: 'itext',
      text: 'Num Posts: ',
      textBold: data.num_posts,
      tooltip: 'The number of posts on your Facebook timeline.'
    },
    {
      icon: 'isearch',
      text: 'Num Searches: ',
      textBold: data.num_searches,
      tooltip: 'The number of searches in the Facebook search bar.'
    },
    {
      icon: 'icake',
      text: 'Birthday: ',
      textBold: formatDate(data.birthday),
      tooltip: 'This one is pretty self explanatory. (:'
    },
    {
      icon: 'iuser',
      text: 'Last Profile Update: ',
      textBold: 'test',
      tooltip: 'Last time you updated your Facebook profile.'
    },
    {
      icon: 'iusers',
      text: 'Friend Peer Group: ',
      textBold: data.friend_peer_group,
      tooltip: 'How Facebook classifies your friends.'
    }
  ]
  rRender.renderSubReport(data.name, reportContainer, reportItems);
}

function renderMsgReportHeading(data, parent) {
  // data crunching
  // TODO pull out of here maybe
  let totMsgSent = 0
  let numChats = Object.keys(data['regThreads']).length;
  let numGrChats = data['groupChatThreads'].length;
  let totMsgReceived = 0

  Object.keys(data.regThreads).forEach((key) => {
    totMsgSent += data.regThreads[key].msgByUser;
  });

  Object.keys(data.regThreads).forEach((key) => {
    totMsgReceived += data.regThreads[key].other;
  });

  let msgData = [
    {
      icon: 'isend',
      text: 'Messages sent:',
      textBold:  formatNum(totMsgSent),
      tooltip: 'The total number of messages you have sent on Facebook.'
    },
    {
      icon: 'iinbox',
      text: 'Messages received:',
      textBold: formatNum(totMsgReceived),
      tooltip: 'The total number of messages you have received on Facebook.'
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
    }
  ];

  return rRender.renderSubReport('Message Report', parent, msgData);
}

function renderMsgGraphs(msgReportStats, parent) {
  let msgGraphCont = document.createElement('div');
  msgGraphCont.id = 'graphs-container';
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

  // INTIALIZE chartFactory
  const charFac = new chartFactory('blue');

  // hoourly messages chart
  charFac.getChart({
    type: 'clock',
    parent: graphCont[0],
    data: msgReportStats.timeStats.hourly.sent,
    title: 'Messages by Hour of Day - Sent',
    colorscheme: 'blue',
    name: 'chart1',
    size: 'medium'
  });

  charFac.getChart({
    type: 'clock',
    parent: graphCont[1],
    data: msgReportStats.timeStats.hourly.received,
    title: 'Messages by Hour of Day - Received',
    colorscheme: 'blue',
    name: 'chart2',
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
    labels: truncateYears(Object.keys(msgReportStats.timeStats.yearly)),
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
