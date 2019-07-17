import './style/graph-wrapper.scss'

// creates an svg tag, applies the given attributes, and optionally appends the element to a parent
function createSVG(tag, attributes, parent) {
   var svg =  document.createElementNS("http://www.w3.org/2000/svg", tag);

   // set the attributes for the svg element
   Object.keys(attributes).forEach(key => {
      if (key == "innerHTML") {
         svg.innerHTML = attributes[key];
      }
      else if (key == "styles") {
         // apply all the styles
         Object.keys(attributes[key]).forEach(s => {
            svg.style[s] = attributes[key][s];
         });
      }
      else {
         svg.setAttribute(key, attributes[key]);
      }
   });
   
   svg.setAttribute("viewBox", "0 0 600 600");
   // svg.style = "margin: 0 auto;"      

   // append to parent if specified
   if (parent) parent.appendChild(svg);

   return svg;
}

// returns a "loaded" create svgFunction with a bound parent argument
// use in case you don't want to attach parent all the time
function createSVGLoaded(parent) {
   return function(...args) {
      createSVG(...args, parent);
   }
};

function createLegendWrapper(data, graph) {
   var mainContainer = document.createElement("div");
   var title = document.createElement("h3");
   var conclusion = document.createElement('p');

   conclusion.innerHTML = getTimerangeString(data);
   title.innerHTML = "Messaging Clock";

   mainContainer.classList.add("clock-graph-container");
   conclusion.classList.add("clock-graph-conclusion");
   title.classList.add("clock-graph-title");

   mainContainer.appendChild(title);
   mainContainer.appendChild(graph);
   mainContainer.appendChild(conclusion);
   return mainContainer;
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

export { createSVG, createSVGLoaded, createLegendWrapper };

