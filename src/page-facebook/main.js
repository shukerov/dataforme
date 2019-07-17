import '../styles/main.scss';
import { InflaterJS } from '../js/zip-js-modified/inflate.js';
import { Zip } from '../js/zip-js-modified/zip.js';
import { ZipFS } from '../js/zip-js-modified/zip-fs.js';
import { DAYS, MONTHS } from '../js/constants.js';
import { LoadBar } from '../js/components/loadBar.js';
import { renderDecoratedText } from '../js/helpers.js';

import { chartFactory } from '../js/helpers.js';
// import { insFactory } from '../js/components/insFactory.js';


// TODO: extract this in its own component...
// THIS IS FOR DEBUG MODE ONLY
if (DEBUG_MODE) {
   var profInfoJSON = require('../data/profile_info.json');
   var msgStatsPrecompiled = require('../data/dev-data.json');
}

var reportContainer = document.getElementById("report");
var msgGraphCont = document.getElementById("graphs-container");
var msgTextCont = document.getElementById("text-container");
var genTextRep = document.getElementById("general-text");

// TODO: this SHOULD NOT BE HERE
var msgReportStats = {
   "groupChatThreads": [],
   "regThreads": {},
   "numPictures": {"gifs": 0, "other": 0},
   "timeStats": {
      "hourly": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      "weekly": [0, 0, 0, 0, 0, 0, 0],
      "monthly": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      "yearly": {}
   }
};
// average sent number of messages per day (on days that you did message)
// average received -"-
// total calls that you have initiated
// total calls that you have received
// total call time
// average call time

// TODO: this should  be a global object used by all reports
var name = undefined;

var zip = new Zip(window);
var fs = new ZipFS(window.zip);
var inflate = new InflaterJS(window);
fs = window.zip.fs.FS();

kickStartReport();

// NOTES: right now the code flow is the following:
// on file uploaded the report is kickstarted with the startReport fn.
//    the file is imported as a blob, and the profile_info.json parsed first (SCEN1: directly from json files)
//    the buttons are displayed and functions are added to them.
//       more data is crunched on btn pressed and msgReportStats is created (SCEN2: data is crunched)
//       the creation of msgReportStats triggers the rest of the report.

// could be more generic, like JSON parse text first and then do the rest the same
function procProfInfo(text) {
   let profileInfoJSON = JSON.parse(text);
   renderMainInfo(profileInfoJSON);
}

function renderMainInfo(profileInfoJSON) {
   // TODO: check if profile.name.full_name is defined
   name = profileInfoJSON.profile.name.full_name;
   let joinedDate = new Date(profileInfoJSON.profile.registration_timestamp * 1000);
   renderDecoratedText(name, 'My name is', '!', genTextRep);
   renderDecoratedText(joinedDate.toDateString(), "Joined FB on:", null, genTextRep);

   let startReporting = document.createElement("p");
   startReporting.innerHTML = "Lets do something more interesting. Click below.";
   genTextRep.appendChild(startReporting);
}

function kickStartReport() {
   if (!DEBUG_MODE) {
      // event specifying that file was uploaded
      var file = document.getElementById("file-picker-input");
      file.onchange = startReport.bind(this, file);
   }
   else {
      renderMainInfo(profInfoJSON);
      showReportBtns();
      renderMsgReport();
   }
}

function startReport(file) {
   fs.importBlob(file.files[0], function() {
      // TODO: extract this in a helper that can check if the directories exist or not. should fail GRACEFULLY
      let profInfo = fs.root.getChildByName("profile_information").getChildByName("profile_information.json");
      // get generic profile info. Used for greeting. Pull this out in a function
      profInfo.getText(procProfInfo);
      // generate message report container
      showReportBtns();
   });
};

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

function renderMsgReport() {
   if (!DEBUG_MODE) {
      // should pass in the progress component
      genAggMsgReport();
   }
   else {
      msgReportStats = msgStatsPrecompiled;
      displayAggMsgReport();
   }
}

function genAggMsgReport() {
   // TODO this can break in 15 different places...
   var msgDirs = fs.root.getChildByName("messages").getChildByName("inbox").children; // gets the messages directory from zip

   // regular attempt
   var msgThreadsProcessed = 0;
   var numDirs = msgDirs.length;
   var progress = new LoadBar(msgThreadsProcessed, numDirs);
   progress.show();
   
   console.log(numDirs);
   msgDirs.map((msgDir) => {
      var msgThread = msgDir.getChildByName("message_1.json");
      //todo: intiliaze an analyzer

      // gets pictures statistics
      //TODO:

      // message thread was not found in the given directory
      if (!msgThread) {
         msgThreadsProcessed++;
         return;
      }


      // gets thread text, and analyzes it
      msgThread.getText(function(text) {
         var text_json = JSON.parse(text);
         let participants = text_json.participants // all participants in the current chat thread
         let group = true;                         // remains true if the chat is a groupchat

         if (participants && participants.length > 2) {
            msgReportStats["groupChatThreads"].push(msgDir.name);
         }
         else if(participants) {
            let participantStat = {
               "dirName": msgDir.name,
               "msgByUser": 0,
               "other": 0
            };
            msgReportStats["regThreads"][participants[0].name] = participantStat; 
            group = false;
         }

         if (text_json.messages && text_json.messages.length > 1) {
            // pull this function out and make sure you can reuse it in individual thread analysis
            text_json.messages.reduce(function(acc, msg) {
               if (!group) {
                  if (msg.sender_name == name) {
                     acc["regThreads"][participants[0].name]["msgByUser"]++; 
                  }
                  else
                  {
                     acc["regThreads"][participants[0].name]["other"]++; 
                  }
               }

               if (msg.sender_name == name) {
                  let d = new Date(msg.timestamp_ms);
                  acc.timeStats.weekly[d.getDay()]++;
                  acc["timeStats"]["hourly"][d.getHours()]++;
                  acc["timeStats"]["monthly"][d.getMonth()]++;
                  acc["timeStats"]["yearly"][d.getFullYear()] = (acc["timeStats"]["yearly"][d.getFullYear()] || 0) + 1;
               }
               return acc;
            }, msgReportStats);
         }

         // TODO: current progress bar. kind of suck
         // should be a function on progress component
        progress.updatePercentage(msgThreadsProcessed); 
         // counts stuff
         msgThreadsProcessed++;

         // triggers callback once all msgThreads are analyzed
         if (msgThreadsProcessed == numDirs) {
            progress.hide();
            displayAggMsgReport();
         }
      });
   });
}

function displayAggMsgReport() {
   var numChats = Object.keys(msgReportStats['regThreads']).length;
   var numGrChats = msgReportStats['groupChatThreads'].length;
   renderDecoratedText(numChats, 'I have talked to', 'people!', msgTextCont);
   renderDecoratedText(numGrChats, 'I have been in ', 'group chats!', msgTextCont);

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
      data: [msgSent, msgReceived, [`${name}`, 'Friend']],
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
