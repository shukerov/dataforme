import './styles/main.scss';
import { ClockChart } from './js/clock-chart/clock_graph.js';

var fakeData = [4648, 3840, 2475, 1201, 844, 873, 1386, 1952, 5032, 7815,
   9034, 3681, 4076, 4677, 6684, 6501, 5244, 3797, 3344, 4265, 4054, 4352,
   4538, 4778];
var container = document.getElementById("svg-testing");
container.appendChild(makeCustomClockChart(fakeData));

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

