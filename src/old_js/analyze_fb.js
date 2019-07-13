reportContainer = document.getElementById("report");
reportAlert = document.getElementById("report-alert");
msgGraphCont = document.getElementById("graphs-container");
msgTextCont = document.getElementById("text-container");
genTextRep = document.getElementById("general-text");

// CONSTANTS
var MONTHS  = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var DAYS  = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// TODO: delete this. just testing for a future loading bar
var counter = document.createElement("p");
msgTextCont.appendChild(counter);
// this should  be a global object used by all reports
var name = undefined;

zip.workerScriptsPath = "/javascripts/";
var fs = new zip.fs.FS();

// event specifying that file was uploaded
file = document.getElementById("file-picker-input");
file.onchange = startReport;

function startReport() {
   fs.importBlob(file.files[0], function() {
      // TODO: make sure you check if those two exist before proceeding... 
      let profInfo = fs.root.getChildByName("profile_information").getChildByName("profile_information.json");
      // get generic profile info. Used for greeting. Pull this out in a function
      profInfo.getText(function(text) {
         let profileInfoJSON = JSON.parse(text);
         // TODO: check if profile.name.full_name is defined
         name = profileInfoJSON.profile.name.full_name;
         let joinedDate = new Date(profileInfoJSON.profile.registration_timestamp * 1000);
         genTextRep.appendChild(makeCoolText1("My name is", `${name}!`));
         genTextRep.appendChild(makeCoolText1("I joined Facebook on", `${joinedDate.toDateString()}!`));
         
         let startReporting = document.createElement("p");
         startReporting.innerHTML = "Lets do something more interesting. Click below.";
         genTextRep.appendChild(startReporting);
      });
      // generate message report container
      showReportBtns();
   });
};

function filesToConsole(file) {
   // this will unzip the file and print out the name of each file in the console
   zip.workerScriptsPath = "/javascripts/";
   zip.createReader(new zip.BlobReader(file), function(zipReader) {
      zipReader.getEntries(function(entries) {
         entries.map(function(e) {
            return console.log(e.filename);
         });
      });
   });
}

function showReportBtns() {
   fbBtns = document.getElementById("btn-container");
   fbBtns.style.visibility = "visible";

   // gets all the message report data
   msgReportBtn = document.getElementById("message-report-btn");
   msgReportBtn.addEventListener("click", genAggMsgReport);

   // gets the interactions report data
}

var counter = 0;
function updateCounter() {
   console.log(counter);
   counter++;
}

function genAggMsgReport() {
   // TODO this can break in 15 different places...
   var msgDirs = fs.root.getChildByName("messages").getChildByName("inbox").children; // gets the messages directory from zip
   
   // create a loading bar
   // var
   // TODO: a check if actual messages were found needs to be added here
   msgReportStats = {
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

   // regular attempt
   var count = 0;
   var msgThreadsProcessed = 0;
   var numDirs = msgDirs.length;
   console.log(numDirs);
   // msgDirs.forEach(function(msgDir) {
   msgDirs.map((msgDir) => {
   // for(var z = 0; z < numDirs; z++) {
      // console.log(z);
      // var msgDir = msgDirs[z];
      var msgThread = msgDir.getChildByName("message_1.json");
      //todo: intiliaze an analyzer

      // gets pictures statistics
      //TODO:

      // message thread was not found in the given directory
      if (!msgThread) {
         msgThreadsProcessed++;
         return;
      }


      var cnt = 0;
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

         updateCounter();
         // counts stuff
         msgThreadsProcessed++;
         cnt++;
         console.log(cnt);

         // triggers callback once all msgThreads are analyzed
         if (msgThreadsProcessed == numDirs) {
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

   msgAggCont = document.createElement("div");
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
   const chart = new frappe.Chart(frappeChart, {  // or a DOM element,
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

   const chart = new frappe.Chart(`#${chartId}`, {  // or a DOM element,
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
   var graph = kokich.getClockGraph(data, 600, mainContainer);
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
