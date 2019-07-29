// Style imports:
import '../styles/main.scss';
import '../styles/facebook.scss';

// JS imports:
import { DAYS, MONTHS, MS_IN_DAY } from '../js/constants.js';
import { formatNum } from '../js/helpers.js';
import { chartFactory } from '../js/helpers.js';
import { FBAnalyzer } from '../js/analyzers/fbAnalyzer.js';
import { NavBar } from '../js/components/navBar.js';
import { FilePicker } from '../js/components/filePicker.js';
import { reportRenderer } from '../js/components/reportRender.js';
// import { insFactory } from '../js/components/insFactory.js';

var data = {
  'name': 'unknown',
  'joined': null,
  'brithday': 'unknown',
  'num_posts': 'unknown',
  'num_searches': 'unknown',
  'msgStats': {
    'groupChatThreads': [],
    'regThreads': {},
    'numPictures': {'gifs': 0, 'other': 0},
    'timeStats': {
      'hourly': {
        'sent': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'received': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      'weekly': {
        'sent': [0, 0, 0, 0, 0, 0, 0],
        'received': [0, 0, 0, 0, 0, 0, 0]
      },
      'monthly': {
        'sent': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'received': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      'yearly': {}
    }
  }
};
// average words per message
// average sent number of messages per day (on days that you did message)
// average received -"-
// total calls that you have initiated
// total calls that you have received
// total call time
// average call time

// THIS IS FOR DEBUG MODE ONLY
if (DEBUG_MODE) {
  data = require('../data/fb_precompiled.json');
}

var reportContainer = document.getElementById('report');

let nBar = new NavBar(document.getElementById('site'));
let fPicker = new FilePicker(reportContainer);
let rRender = new reportRenderer();

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

function renderFacebookReport(data, report) {
  renderReportHeading(data, reportContainer);
  displayAggMsgReport(data.msgStats);
}

function renderReportHeading(data, parent) {
  // data crunching
  // TODO: helper
  let dateRange = new Date(Date.now());
  let dateStart = new Date(data.joined);
  // TODO: helper
  let numDays = Math.round((dateRange - dateStart) / MS_IN_DAY);

  let reportItems = [
    {
      icon: 'icalendar',
      text: 'Date Joined: ',
      textBold: dateStart.toDateString()
    },
    {
      icon: 'itext',
      text: 'Num Posts: ',
      textBold: data.num_posts
    },
    {
      icon: 'isearch',
      text: 'Num Searches: ',
      textBold: data.num_searches,
    },
    {
      icon: 'icake',
      text: 'Birthday: ',
      textBold: new Date(data.birthday).toDateString()
    },
    {
      icon: 'iuser',
      text: 'Last Profile Update: ',
      textBold: 'test'
    },
    {
      icon: 'iusers',
      text: 'Family members: ',
      textBold: 'whatev'
    },
    {
      icon: 'iusers',
      text: 'Friend Peer Group: ',
      textBold: 'whatev1'
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
      textBold:  formatNum(totMsgSent)
    },
    {
      icon: 'iinbox',
      text: 'Messages received:',
      textBold: formatNum(totMsgReceived)
    },
    {
      icon: 'imsg',
      text: 'People messaged:',
      textBold: numChats
    },
    {
      icon: 'imsgcir',
      text: 'Group chats:',
      textBold: numGrChats
    }
  ];

  return rRender.renderSubReport('Message Report', parent, msgData);
}

function truncateYears(years) {
  let yearsTruncated = years.map((year) => {
    return year.slice(-2);
  });

  return yearsTruncated;
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

  // let chartHourlySent = 
  charFac.getChart({
    type: 'clock',
    parent: graphCont[0],
    data: msgReportStats.timeStats.hourly.sent,
    title: 'Messages by Hour of Day - Sent',
    colorscheme: 'blue',
    name: 'chart1',
    size: 'medium'
  });
  // let chartHourly = 
  charFac.getChart({
    type: 'clock',
    parent: graphCont[1],
    data: msgReportStats.timeStats.hourly.received,
    title: 'Messages by Hour of Day - Received',
    colorscheme: 'blue',
    name: 'chart2',
    size: 'medium'
  });

  // improved other graphs
  let msgSentDaily = msgReportStats.timeStats.weekly.sent;
  let msgReceivedDaily = msgReportStats.timeStats.weekly.received;
  // HACK BECAUSE FRAPPE CHARTS ARE BROKEN :(((((
  msgSentDaily.push(0);
  // let chartWeekly = 
  charFac.getChart({
    type: 'axis-mixed',
    parent: graphCont[2],
    name: 'chart3',
    title: 'Messages by Day of the Week',
    labels: DAYS,
    data: [msgSentDaily, msgReceivedDaily, ['Sent', 'Received']],
    size: 'medium'
  });

  let msgSentMonthly = msgReportStats.timeStats.monthly.sent;
  let msgReceivedMonthly = msgReportStats.timeStats.monthly.received;
  // HACK BECAUSE FRAPPE CHARTS ARE BROKEN :(((((
  msgSentMonthly.push(0);
  // let chartMonthly = 
  charFac.getChart({
    type: 'axis-mixed',
    parent: graphCont[3],
    name: 'chart4',
    title: 'Messages by Month',
    labels: MONTHS,
    data: [msgSentMonthly, msgReceivedMonthly, ['Sent', 'Received']],
    size: 'medium'
  });

  let msgSentYearly = Object.keys(msgReportStats.timeStats.yearly).map((y) => {
    return msgReportStats.timeStats.yearly[y].sent
  });
  let msgReceivedYearly= Object.keys(msgReportStats.timeStats.yearly).map((y) => {
    return msgReportStats.timeStats.yearly[y].received
  });
  // HACK BECAUSE FRAPPE CHARTS ARE BROKEN :(((((
  msgSentYearly.push(0);
  // let chartYearly = 
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

  // let chartYearlyCum = 
  charFac.getChart({
    type: 'line',
    parent: graphCont[5],
    name: 'chart6',
    title: 'Cumulative Messages over Years',
    data: Object.values(msgCumulative),
    labels: Object.keys(msgCumulative),
    size: 'medium'
  });

  // make a graph for top messaged people
  let topMessagers = newTopMessagers(msgReportStats.regThreads, 15).map((t) => { return t[1]; });
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

  // let chartTopMessegers = 
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

function displayAggMsgReport(msgReportStats) {
  // RENDERS HEADING
  let msgReport = renderMsgReportHeading(msgReportStats, reportContainer);
  renderMsgGraphs(msgReportStats, msgReport);
  // var msgGraphCont = document.createElement('div');
  // msgGraphCont.id = 'graphs-container';
  // reportContainer.appendChild(msgGraphCont);

  // var graphCont = [];
  

  // // TODO: this has gotta be temporary solution
  // for (var i = 0; i < 7; i++) {
  //   var gcontainer = document.createElement('div');
  //   gcontainer.classList.add('graph-wrapper');
  //   gcontainer.id = `g${i}`;
  //   msgGraphCont.appendChild(gcontainer);
  //   graphCont.push(gcontainer);
  // }

  // // INTIALIZE chartFactory
  // const charFac = new chartFactory('blue');

  // var chartHourlySent = charFac.getChart({
  //   type: 'clock',
  //   parent: graphCont[0],
  //   data: msgReportStats.timeStats.hourly.sent,
  //   title: 'Messages by Hour of Day - Sent',
  //   colorscheme: 'blue',
  //   name: 'chart1',
  //   size: 'medium'
  // });
  // var chartHourly = charFac.getChart({
  //   type: 'clock',
  //   parent: graphCont[1],
  //   data: msgReportStats.timeStats.hourly.received,
  //   title: 'Messages by Hour of Day - Received',
  //   colorscheme: 'blue',
  //   name: 'chart2',
  //   size: 'medium'
  // });

  // // improved other graphs
  // let msgSentDaily = msgReportStats.timeStats.weekly.sent;
  // let msgReceivedDaily = msgReportStats.timeStats.weekly.received;
  // // HACK BECAUSE FRAPPE CHARTS ARE BROKEN :(((((
  // msgSentDaily.push(0);
  // var chartWeekly = charFac.getChart({
  //   type: 'axis-mixed',
  //   parent: graphCont[2],
  //   name: 'chart3',
  //   title: 'Messages by Day of the Week',
  //   labels: DAYS,
  //   data: [msgSentDaily, msgReceivedDaily, ['Sent', 'Received']],
  //   size: 'medium'
  // });

  // let msgSentMonthly = msgReportStats.timeStats.monthly.sent;
  // let msgReceivedMonthly = msgReportStats.timeStats.monthly.received;
  // // HACK BECAUSE FRAPPE CHARTS ARE BROKEN :(((((
  // msgSentMonthly.push(0);
  // var chartMonthly = charFac.getChart({
  //   type: 'axis-mixed',
  //   parent: graphCont[3],
  //   name: 'chart4',
  //   title: 'Messages by Month',
  //   labels: MONTHS,
  //   data: [msgSentMonthly, msgReceivedMonthly, ['Sent', 'Received']],
  //   size: 'medium'
  // });

  // let msgSentYearly = Object.keys(msgReportStats.timeStats.yearly).map((y) => {
  //   return msgReportStats.timeStats.yearly[y].sent
  // });
  // let msgReceivedYearly= Object.keys(msgReportStats.timeStats.yearly).map((y) => {
  //   return msgReportStats.timeStats.yearly[y].received
  // });
  // // HACK BECAUSE FRAPPE CHARTS ARE BROKEN :(((((
  // msgSentYearly.push(0);
  // var chartYearly = charFac.getChart({
  //   type: 'axis-mixed',
  //   parent: graphCont[4],
  //   name: 'chart5',
  //   title: 'Messages by Year',
  //   labels: Object.keys(msgReportStats.timeStats.yearly),
  //   data: [msgSentYearly, msgReceivedYearly, ['Sent', 'Received']],
  //   size: 'medium'
  // });

  // // this is just having fun. THINK ABOUT HOW DATA NEEDS TO BE STRUCTURED
  // // THIS IS NOT FUNCTIONAL?
  // let sum = 0;
  // let msgCumulative = Object.keys(msgReportStats.timeStats.yearly).reduce((acc, dp) => {
  //   sum += msgReportStats.timeStats.yearly[dp].sent + msgReportStats.timeStats.yearly[dp].received;
  //   acc[dp] = sum;
  //   return acc;
  // }, {});

  // var chartYearlyCum = charFac.getChart({
  //   type: 'line',
  //   parent: graphCont[5],
  //   name: 'chart6',
  //   title: 'Cumulative Messages over Years',
  //   data: Object.values(msgCumulative),
  //   labels: Object.keys(msgCumulative),
  //   size: 'small'
  // });

  // // make a graph for top messaged people
  // let topMessagers = newTopMessagers(msgReportStats.regThreads, 20).map((t) => { return t[1]; });
  // let msgSent = topMessagers.reduce(function(acc, msger) {
  //   let cnt1 = msgReportStats.regThreads[msger]["msgByUser"];
  //   acc.push(cnt1);
  //   return acc;
  // }, []);

  // let msgReceived = topMessagers.reduce(function(acc, msger) {
  //   let cnt1 = msgReportStats.regThreads[msger]["other"];
  //   acc.push(cnt1);
  //   return acc;
  // }, []);

  // var chartTopMessegers = charFac.getChart({
  //   type: 'axis-mixed',
  //   parent: graphCont[6],
  //   name: 'chart7',
  //   title: 'Top Messagers',
  //   labels: topMessagers,
  //   data: [msgSent, msgReceived, [`${data.name}`, 'Friend']],
  //   size: 'medium'
  // });
}

// gets the top messagers sorts them and returns the last n ones
function newTopMessagers(threads, n) {
  var topMessagers = []
  Object.keys(threads).forEach((p) => {
    var cnt = threads[p].msgByUser + threads[p].other;
    topMessagers.push([cnt, p]);
  });

  // sort the results
  topMessagers.sort( (a, b) => { return a[0] - b[0]; } );
  return topMessagers.slice(topMessagers.length - n);
}
