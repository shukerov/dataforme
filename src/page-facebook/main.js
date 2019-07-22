import '../styles/main.scss';
import '../styles/facebook.scss';
import { DAYS, MONTHS, MS_IN_DAY } from '../js/constants.js';
import { renderText, formatNum } from '../js/helpers.js';

import { chartFactory, scrollManager } from '../js/helpers.js';
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

var reportContainer = document.getElementById("report");
var msgGraphCont = document.getElementById("graphs-container");
var msgTextCont = document.getElementById("text-container");
var genTextRep = document.getElementById("general-text");

// TODO: this should  be a global object used by all reports
var analyzer = undefined;

// var analyzer = new FBAnalyzer();
// var analyzer = new BaseAnalyzer();

new NavBar(document.getElementById('site'));
let smng = new scrollManager();
smng.setScrolling();
// new NavBar(document.getElementsByClassName('site')[0]);
kickStartReport();

function kickStartReport() {
   if (!DEBUG_MODE) {
      // event specifying that file was uploaded
      var file = document.getElementById("file-picker-input");
      file.onchange = report.bind(this, file, data);
      // file.onchange = startReport.bind(this, file);
   }
   else {
      renderMainInfoNew(data);
      // renderMainInfo(profInfoJSON);
      // showReportBtns();
      renderMsgReport(data);
   }
}

function report(file, data) {
   analyzer = new FBAnalyzer(file.files[0], data, renderMainInfoNew.bind(this, data));
   // renderMainInfoNew(data);
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
   // TODO: helper

   let totMsgSent = 0
   Object.keys(msgReportStats.regThreads).forEach((key) => {
      totMsgSent += msgReportStats.regThreads[key].msgByUser;
   });

   let totMsgReceived = 0
   Object.keys(msgReportStats.regThreads).forEach((key) => {
      totMsgReceived += msgReportStats.regThreads[key].other;
   });

   console.log(totMsgSent);
   console.log(totMsgReceived);
   let numChats = Object.keys(msgReportStats['regThreads']).length;
   let numGrChats = msgReportStats['groupChatThreads'].length;
   renderText('Messages sent: *', [formatNum(totMsgSent)], msgTextCont);
   renderText('Messages received: *', [formatNum(totMsgReceived)], msgTextCont);
   renderText('I have talked to * people!', [numChats], msgTextCont);
   renderText('I have been in * group chats!', [numGrChats], msgTextCont);

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
      size: 'medium'
   });

   var chartMonthly = charFac.getChart({
      type: 'bar',
      parent: graphCont[2],
      name: 'chart3',
      title: 'Messages by Month',
      data: msgReportStats.timeStats.monthly,
      labels: MONTHS
   });

   var chartYearly = charFac.getChart({
      type: 'bar',
      parent: graphCont[3],
      name: 'chart4',
      title: 'Messages by Year',
      data: Object.values(msgReportStats.timeStats.yearly),
      labels: Object.keys(msgReportStats.timeStats.yearly)
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
