// Style imports:
import '../styles/main.scss';
import '../styles/facebook.scss';

// Assets imports:
import icalendar from '../images/report-icons/calendar.svg';
import itext from '../images/report-icons/file-text.svg';
import icake from '../images/report-icons/cake.svg';
import isearch from '../images/report-icons/search.svg';
import iuser from '../images/report-icons/user.svg';
import iusers from '../images/report-icons/users.svg';
import imsg from '../images/report-icons/message-square.svg';
import imsgcir from '../images/report-icons/message-circle.svg';
import isend from '../images/report-icons/send.svg';
import iinbox from '../images/report-icons/inbox.svg';

// JS imports:
import { DAYS, MONTHS, MS_IN_DAY } from '../js/constants.js';
import { renderText, formatNum } from '../js/helpers.js';
import { chartFactory } from '../js/helpers.js';
import { FBAnalyzer } from '../js/analyzers/fbAnalyzer.js';
import { NavBar } from '../js/components/navBar.js';
// import { insFactory } from '../js/components/insFactory.js';

var data = {
   'name': null,
   'joined': null,
   'msgStats': {
      "groupChatThreads": [],
      "regThreads": {},
      "numPictures": {"gifs": 0, "other": 0},
      "timeStats": {
         "hourly": {
            "sent": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "received": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
         },
         "weekly": {
            "sent": [0, 0, 0, 0, 0, 0, 0],
            "received": [0, 0, 0, 0, 0, 0, 0]
         },
         "monthly": {
            "sent": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "received": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
         },
         "yearly": {}
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
// var msgGraphCont = document.getElementById('graphs-container');
// var msgTextCont = document.getElementById('text-container');
// var genTextRep = document.getElementById('general-text');

// TODO: this should  be a global object used by all reports
var analyzer = undefined;
// var analyzer = new FBAnalyzer();
// var analyzer = new BaseAnalyzer();

new NavBar(document.getElementById('site'));

kickStartReport();

function kickStartReport() {
   if (!DEBUG_MODE) {
      // event specifying that file was uploaded
      var file = document.getElementById('file-picker-input');
      file.onchange = report.bind(this, file, data);
      // file.onchange = startReport.bind(this, file);
   }
   else {
      renderReportHeading(data, reportContainer);
      // renderMainInfoNew(data);
      // renderMainInfo(profInfoJSON);
      // showReportBtns();
      renderMsgReport(data);
   }
}

function report(file, data) {
   analyzer = new FBAnalyzer(file.files[0], data, renderReportHeading.bind(this, data, reportContainer));
   // renderMainInfoNew(data);
}

function renderMsgHeading(data, parent) {
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

   let reportHeading = document.createElement('div');
   reportHeading.classList.add('report-heading');

   reportHeading.innerHTML = `\
      <div class='report-heading-title'>\
         <h2 class='report-heading-user-name'>Message Report</h2>\
         <div class='report-heading-user-picture'></div>\
      </div>\
      <div class='report-heading-content'></div>\
      `
   parent.appendChild(reportHeading);
   // BAD BAD
   let reportItemContainer = document.getElementsByClassName('report-heading-content')[1];

   renderHeadingItem(isend, 'Messages sent:',
      renderText('*', [formatNum(totMsgSent)]),
      reportItemContainer);
   renderHeadingItem(iinbox, 'Messages received:',
      renderText('*', [formatNum(totMsgReceived)]),
      reportItemContainer);
   renderHeadingItem(imsg, 'People messaged:',
      renderText('*', [numChats]),
      reportItemContainer);
   renderHeadingItem(imsgcir, 'Group chats:',
      renderText('*', [numGrChats]),
      reportItemContainer);
}

function renderReportHeading(data, parent) {
   let reportHeading = document.createElement('div');
   reportHeading.classList.add('report-heading');

   reportHeading.innerHTML = `\
      <div class='report-heading-title'>\
         <h2 class='report-heading-user-name'>${data.name}</h2>\
         <div class='report-heading-user-picture'></div>\
      </div>\
      <div class='report-heading-content'></div>\
      <div class='report-controls'>\
         <button id='msg-report' class='report-button'>Message Report</button>\
         <button id='post-report' class='report-button'>Post Report</button>\
         <button id='search-report' class='report-button'>Search Report</button>\
      </div>\
      `
   parent.appendChild(reportHeading);
   // button actions
   let msgRBtn = document.getElementById('msg-report');
   msgRBtn.addEventListener("click", renderMsgReport);

   // data crunching
   // TODO: helper
   let dateRange = new Date(Date.now());
   let dateStart = new Date(data.joined);
   // TODO: helper
   let numDays = Math.round((dateRange-dateStart)/MS_IN_DAY);

   // let reportItemContainer = document.getElementById('report-heading-content');
   let reportItemContainer = document.getElementsByClassName('report-heading-content')[0];

   renderHeadingItem(icalendar, 'Data Range: ',
      renderText(`* - * (${numDays} days)`, [dateStart.toDateString(),
         dateRange.toDateString()]),
      reportItemContainer);
   renderHeadingItem(itext, 'Num Posts: ',
      renderText('*', [data.num_posts]),
      reportItemContainer);
   renderHeadingItem(isearch, 'Num Searches: ',
      renderText('*', [data.num_searches]),
      reportItemContainer);
   // still need to pull from data...
   renderHeadingItem(icake, 'Birthday: ',
      renderText('*', ['Wed Mar 24 1995']),
      reportItemContainer);
   renderHeadingItem(iuser, 'Last Profile Update: ',
      renderText('*', ['Wed Mar 24 1995']),
      reportItemContainer);
   renderHeadingItem(iusers, 'Family members: ',
      renderText('*', ['3']),
      reportItemContainer);
   renderHeadingItem(iusers, 'Friend Peer Group: ',
      renderText('*', ['3']),
      reportItemContainer);
}

function renderHeadingItem(iconPath, label, headingText, parent) {
   // element creation
   let headingItem = document.createElement('div');
   let headingIcon = new Image();
   let headingLabel = document.createElement('p');
   
   // appending elements
   headingItem.appendChild(headingIcon);
   headingItem.appendChild(headingLabel);
   headingItem.appendChild(headingText);
   parent.appendChild(headingItem);

   // adding content
   headingIcon.src = iconPath;
   headingLabel.innerHTML = label;

   // styles
   headingIcon.classList.add('heading-content-icon');
   headingLabel.classList.add('heading-content-label');
   headingText.classList.add('heading-content-text');
   headingItem.classList.add('heading-content-item');
}

function renderMainInfoNew(data) {
   // quick experiments
   let dateRange = new Date(Date.now());
   let dateStart = new Date(data.joined);
   //TODO: helper
   let numDays = Math.round((dateRange-dateStart)/MS_IN_DAY);
   renderText('My name is *. :)', [data.name], genTextRep);
   renderText(`Data from * to *. (${numDays} days).`,
      [dateStart.toDateString(), dateRange.toDateString()], genTextRep);

   let startReporting = document.createElement("p");
   startReporting.innerHTML = "Lets do something more interesting. Click below.";
   genTextRep.appendChild(startReporting);
   showReportBtns();
}

function renderMsgReport() {
   // ZIP FILE MODE
   if (!DEBUG_MODE) {
      analyzer.analyzeMsgThreads(data.msgStats, displayAggMsgReport.bind(this, data.msgStats));
   }
   else {
      displayAggMsgReport(data.msgStats);
   }
}

function showReportBtns() {
   var fbBtns = document.getElementById("btn-container");
   fbBtns.style.visibility = "visible";

   // gets all the message report data
   var msgReportBtn = document.getElementById("message-report-btn");
   msgReportBtn.addEventListener("click", renderMsgReport);

   // gets the interactions report data
   var msgInterBtn = document.getElementById('interaction-report-btn');
   msgInterBtn.disabled = true;
}

function displayAggMsgReport(msgReportStats) {
   // RENDERS HEADING
   renderMsgHeading(msgReportStats, reportContainer);

   var msgGraphCont = document.createElement('div');
   msgGraphCont.id = 'graphs-container';
   reportContainer.appendChild(msgGraphCont);

   var graphCont = [];

   // TODO: this has gotta be temporary solution
   for (var i = 0; i < 6; i++) {
      var gcontainer = document.createElement('div');
      gcontainer.classList.add('graph-wrapper');
      msgGraphCont.appendChild(gcontainer);
      graphCont.push(gcontainer);
   }

   // INTIALIZE chartFactory
   const charFac = new chartFactory('blue');

   var chartHourly = charFac.getChart({
      type: 'clock',
      parent: graphCont[0],
      data: msgReportStats.timeStats.hourly.sent,
      title: 'Messages by Day of Week',
      colorscheme: 'blue',
      name: 'chart1',
      size: 'medium'
   });

   // improved other graphs
   let msgSentDaily = msgReportStats.timeStats.weekly.sent;
   let msgReceivedDaily = msgReportStats.timeStats.weekly.received;
   // HACK BECAUSE FRAPPE CHARTS ARE BROKEN :(((((
   msgSentDaily.push(0);
   var chartWeekly = charFac.getChart({
      type: 'axis-mixed',
      parent: graphCont[1],
      name: 'chart2',
      title: 'Messages by Day of the Week',
      labels: DAYS,
      data: [msgSentDaily, msgReceivedDaily, ['Sent', 'Received']],
      size: 'medium'
   });

   let msgSentMonthly = msgReportStats.timeStats.monthly.sent;
   let msgReceivedMonthly = msgReportStats.timeStats.monthly.received;
   // HACK BECAUSE FRAPPE CHARTS ARE BROKEN :(((((
   // msgSentMonthly.push(0);
   var chartMonthly = charFac.getChart({
      type: 'axis-mixed',
      parent: graphCont[2],
      name: 'chart3',
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
   // msgSentYearly.push(0);
   var chartYearly = charFac.getChart({
      type: 'axis-mixed',
      parent: graphCont[3],
      name: 'chart4',
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

   var chartYearlyCum = charFac.getChart({
      type: 'line',
      parent: graphCont[4],
      name: 'chart5',
      title: 'Cumulative Messages over Years',
      data: Object.values(msgCumulative),
      labels: Object.keys(msgCumulative),
      size: 'small'
   });

   // make a graph for top messaged people
   let topMessagers = newTopMessagers(msgReportStats.regThreads, 20).map((t) => { return t[1]; });
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

   var chartTopMessegers = charFac.getChart({
      type: 'axis-mixed',
      parent: graphCont[5],
      name: 'chart6',
      title: 'Top Messagers',
      labels: topMessagers,
      data: [msgSent, msgReceived, [`${data.name}`, 'Friend']],
      size: 'medium'
   });
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
