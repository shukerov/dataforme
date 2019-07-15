import '../styles/main.scss';
import { InflaterJS } from '../js/zip-js-modified/inflate.js';
import { Zip } from '../js/zip-js-modified/zip.js';
import { ZipFS } from '../js/zip-js-modified/zip-fs.js';
import { Chart } from 'frappe-charts/dist/frappe-charts.min.esm';
import { ClockChart } from '../js/clock-chart/clock_graph.js';
import { DAYS, MONTHS } from '../js/constants.js';
import { LoadBar } from '../js/components/loadBar.js'


// THIS IS FOR DEBUG MODE ONLY
if (DEBUG_MODE) {
   var profInfoJSON = require('../data/profile_info.json');
   var msgStatsPrecompiled = require('../data/dev-data.json');
}
// import profInfoJSON from '../data/profile_info.json';
// import msgStatsPrecompiled from '../data/dev-data.json';

// INSTRUCTION LOADING:
function dataInstructionsRender() {
   const images = require.context('../images/fb-instructions', true);
   const imagePath = (name) => images(name, true);
   const instructions = [
         {
            image: imagePath('./1.jpg'),
            instruction: 'do this now'
         },
         {
            image: imagePath('./2.jpg'),
            instruction: 'do this then'
         },
         {
            image: imagePath('./3.png'),
            instruction: 'do this when'
         },
         {
            image: imagePath('./4.jpg'),
            instruction: 'do this how'
         },
   ]

   var instructionsContainer = document.getElementById("fb-insns");

   for (var i = 0; i < instructions.length; i++) {
      var step = document.createElement('div');
      step.className = 'ins-step';
      var img = new Image();
      var ins = document.createElement('p');
      ins.innerHTML = instructions[i].instruction;
      img.src = instructions[i].image;

      step.appendChild(img);
      step.appendChild(ins);
      instructionsContainer.appendChild(step);
   }
}
// dataInstructionsRender();

var reportContainer = document.getElementById("report");
var reportAlert = document.getElementById("report-alert");
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
   genTextRep.appendChild(makeCoolText1("My name is", `${name}!`));
   genTextRep.appendChild(makeCoolText1("I joined Facebook on", `${joinedDate.toDateString()}!`));

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
   msgTextCont.appendChild(makeCoolText2(
      "I have talked to",
      Object.keys(msgReportStats["regThreads"]).length,
      "people!"));
   msgTextCont.appendChild(makeCoolText2(
      "I have participated in",
      msgReportStats["groupChatThreads"].length,
      "group chats!"));

   var msgAggCont = document.createElement("div");
   msgAggCont.classList.add("graph-wrapper");
   msgGraphCont.appendChild(msgAggCont);

   // new graph stuff
   msgAggCont.appendChild(makeCustomClockChart(msgReportStats["timeStats"]["hourly"]));
   // new graph stuff end

   makeFrappeChart(
      msgAggCont,
      "chart1",
      "When do I usually message people (weekly)?",
      msgReportStats["timeStats"]["weekly"],
      DAYS,
      'bar',
      ['light-blue', 'blue', 'violet',
         'red', 'orange', 'yellow', 
         'green', 'light-green', 'purple',
         'magenta', 'light-grey', 'dark-grey',
         '#5D76CB', '#F0E891', '#FC2847',
         '#FFA343', '#1DACD6', '#FDDB6D',
         '#F75394', '#EDEDED', '#7366BD',
         '#F780A1', '#C5E384', '#FF5349']);

   makeFrappeChart(
      msgAggCont,
      "chart2",
      "When do I usally message people (monthly)?",
      msgReportStats["timeStats"]["monthly"],
      MONTHS,
      'bar',
      ['blue']);

   makeFrappeChart(
      msgAggCont,
      "chart3",
      "When do I usally message people (yearly)?",
      Object.values(msgReportStats["timeStats"]["yearly"]),
      Object.keys(msgReportStats["timeStats"]["yearly"]),
      'bar',
      ['light-blue']);

   // make a graph for top messaged people
   let topMessagers = newTopMessagers(msgReportStats.regThreads, 10).map((t) => { return t[1]; });
   //.filter((thread) => {return thread[1];})
   let data = {
      labels:  topMessagers,
      datasets: [
         {
            name: "Me",
            values: topMessagers.reduce(function(acc, msger) {
               let cnt1 = msgReportStats.regThreads[msger]["msgByUser"];
               acc.push(cnt1);
               return acc;
            }, []),
            chartType: 'bar'
         },
         {
            name: "Other",
            values: topMessagers.reduce(function(acc, msger) {
               let cnt1 = msgReportStats.regThreads[msger]["other"];
               acc.push(cnt1);
               return acc;
            }, []),
            chartType: 'bar'
         }
      ]
   }

   var graphWrapper = document.createElement('div');
   var frappeChart = document.createElement('div');
   graphWrapper.classList.add('graph-wrapper');
   graphWrapper.appendChild(frappeChart);
   msgGraphCont.appendChild(graphWrapper);
   const chart = new Chart(frappeChart, {  // or a DOM element,
      title: "People I chatted with the most.",
      data: data,
      type: "axis-mixed", // or 'bar', 'line', 'scatter', 'pie', 'percentage'
      height: 250
   })

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

function makeFrappeChart(cont, chartId, chartName, data, labels, type, colors) {
   // construct the data variable that frappe requires
   const chartData = {
      labels: labels,
      datasets: [ { values: data } ]
   }

   // generate the needed divs
   var frappeChart = document.createElement('div');
   frappeChart.id = chartId;
   cont.appendChild(frappeChart);

   const chart = new Chart(`#${chartId}`, {  // or a DOM element,
      title: chartName,
      data: chartData,
      type: type, // or 'bar', 'line', 'scatter', 'pie', 'percentage'
      height: 250,
      colors: colors,
      maxSlices: 24
   })
}

// TODO: could be paired with function below?
function getTimerangeString(data) {
   // gets the maximum from the fake data
   var maxVal = 0;
   var maxIndex = -1;

   for (var i = 0; i < data.length; i++) {
      if (maxVal <= data[i]) {
         maxVal = data[i];
         maxIndex = i;
      }
   }

   return `You have messaged the most from ${getTime(maxIndex)} to ${getTime(maxIndex + 1)}.`;
}

function getTime(index) {
   var postfix = 'am';
   var time = index % 12;

   if (index >= 12) {
      postfix = 'pm'
   }

   if (time == 0) {
      return `12:00 ${postfix}`;
   }

   return `${time}:00 ${postfix}`;
}

function setAttributesCustom(el, options) {
   Object.keys(options).forEach((key) => {
      el.style[key] = options[key];
   });
}

function makeCustomClockChart(data) {
   var mainContainer = document.createElement("div");
   var title = document.createElement("h3");
   var conclusion = document.createElement('p');
   conclusion.innerHTML = getTimerangeString(data);
   title.innerHTML = "Messaging Clock";
   mainContainer.setAttribute("id", "clock-graph-container");

   setAttributesCustom(conclusion, {
      'text-align': 'center'
   });

   setAttributesCustom(title, {
      'text-align': 'center',
      'margin-bottom': '18px'
   });

   setAttributesCustom(mainContainer, {
      'width': '800px',
      'display': 'flex',
      'flex-direction': 'column',
      'justify-content': 'center'
   });

   mainContainer.appendChild(title);
   var graph = new ClockChart(data, 600, mainContainer);
   mainContainer.appendChild(conclusion);
   return mainContainer;
}

function makeCoolText1(p1, stat) {
   var convStat = document.createElement('p');
   var convStatPar1 = document.createElement('span');
   var convStatPar2 = document.createElement('strong');

   convStatPar1.innerHTML = p1 + " ";
   convStatPar2.innerHTML = stat;

   convStat.appendChild(convStatPar1);
   convStat.appendChild(convStatPar2);
   return convStat;
}

function makeCoolText2(p1, stat, p2) {
   var convStat = document.createElement('p');
   var convStatPar1 = document.createElement('span');
   var convStatPar2 = document.createElement('strong');
   var convStatPar3 = document.createElement('span');
   convStatPar1.innerHTML = p1 + " ";
   convStatPar2.innerHTML = stat;
   convStatPar3.innerHTML = " " + p2;

   convStat.appendChild(convStatPar1);
   convStat.appendChild(convStatPar2);
   convStat.appendChild(convStatPar3);
   return convStat;
}
