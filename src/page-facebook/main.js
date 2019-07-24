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
         "hourly": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "weekly": [0, 0, 0, 0, 0, 0, 0],
         "monthly": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
   renderMsgHeading(msgReportStats, reportContainer);

   var msgGraphCont = document.createElement('div');
   msgGraphCont.id = 'graphs-container';
   reportContainer.appendChild(msgGraphCont);
   // TODO: helper

   // OLD MESSAGE STATS
   // let totMsgSent = 0
   // Object.keys(msgReportStats.regThreads).forEach((key) => {
   //    totMsgSent += msgReportStats.regThreads[key].msgByUser;
   // });

   // let totMsgReceived = 0
   // Object.keys(msgReportStats.regThreads).forEach((key) => {
   //    totMsgReceived += msgReportStats.regThreads[key].other;
   // });

   // console.log(totMsgSent);
   // console.log(totMsgReceived);
   // let numChats = Object.keys(msgReportStats['regThreads']).length;
   // let numGrChats = msgReportStats['groupChatThreads'].length;
   // renderText('Messages sent: *', [formatNum(totMsgSent)], msgTextCont);
   // renderText('Messages received: *', [formatNum(totMsgReceived)], msgTextCont);
   // renderText('I have talked to * people!', [numChats], msgTextCont);
   // renderText('I have been in * group chats!', [numGrChats], msgTextCont);

   var graphCont = [];

   for (var i = 0; i < 5; i++) {
      var gcontainer = document.createElement('div');
      gcontainer.classList.add('graph-wrapper');
      msgGraphCont.appendChild(gcontainer);
      graphCont.push(gcontainer);
   }

   const charFac = new chartFactory('blue');
   var chartHorly = charFac.getChart({
      type: 'clock',
      parent: graphCont[0],
      data: msgReportStats.timeStats.hourly,
      title: 'Messages by Day of Week',
      colorscheme: 'blue',
      name: 'chart1',
      size: 'medium'
   });

   var chartDaily = charFac.getChart({
      type: 'bar',
      parent: graphCont[1],
      data: msgReportStats.timeStats.weekly,
      labels: DAYS,
      title: 'Messages by Day of Week',
      colorscheme: 'blue',
      name: 'chart2',
      size: 'small'
   });

   var chartMonthly = charFac.getChart({
      type: 'bar',
      parent: graphCont[2],
      name: 'chart3',
      title: 'Messages by Month',
      data: msgReportStats.timeStats.monthly,
      labels: MONTHS,
      size: 'small'
   });

   var chartYearly = charFac.getChart({
      type: 'line',
      parent: graphCont[3],
      name: 'chart4',
      title: 'Messages by Year',
      data: Object.values(msgReportStats.timeStats.yearly),
      labels: Object.keys(msgReportStats.timeStats.yearly),
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
      parent: graphCont[4],
      name: 'chart5',
      title: 'Top Messegers',
      labels: topMessagers,
      data: [msgSent, msgReceived, [`${data.name}`, 'Friend']],
      size: 'medium'
   });
   console.log("should happen once!");
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
