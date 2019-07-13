import { ANGLE_RATIO, CLK_COLOR_DEF, BAR_COLOR_DEF, BG_COLOR_DEF } from './constants.js';
import { createSVG, createSVGLoaded } from './draw-utils.js';

// TODO: calculate the size from parent element?
class ClockChart {
   // TODO: make use of the options to set the colors for the graph
   constructor(graphData, height, parent, options) {
      // create svg element
      const svg = createSVG("svg", {
         height: height,
         width: height
      });

      // set up dimensions
      middleX = height / 2;
      middleY = height / 2;
      parent.appendChild(svg);

      // NOTE: data is an array and has to be a size of 24... need a check here!
      return getClockGraph(svg, graphData, height, parent);
   }
}

var middleX = 400;
var middleY = 400;
const outerR = 100;
const barHeight = 200;
const radiusBig = outerR + barHeight;

// function helpers
var createSVGboundParent;

// color constants. Maybe add a functionality to change those from outside?
const clockFaceColor = CLK_COLOR_DEF;
const barColor = BAR_COLOR_DEF;
const backgroundCircleColor = BG_COLOR_DEF;

function getClockGraph(svg1, graphData, height, parent) {

   createSVGboundParent = createSVGLoaded(svg1);
   // create the outer stat circle
   createSVGboundParent("circle", {
      'cx': middleX,
      'cy': middleY,
      'r': radiusBig,
      'fill': backgroundCircleColor
   });


   // creates the bars of the chart
   var maxVal = Math.max(...graphData);
   for (var i = 0; i < graphData.length; i++) {
      createGraphBarSVG(graphData[i] * barHeight / maxVal, i * 15, graphData[i], svg1);
   }

   createClockFace();

   // create stat lines
   for(let deg = 0; deg <= 360; deg += 15) {
      createSVGboundParent("line", {
         'x1': middleX,
         'x2': middleX,
         'y1': middleY - outerR,
         'y2': middleY - radiusBig,
         'transform': `rotate(${deg}, ${middleX}, ${middleY})`,
         'styles': {
            'stroke': "white",
            'stroke-width': 2,
         }
      });
   }

   return svg1;
}

// TODO: make this one group, and break the components within into groups too
function createClockFace() {
   // create outer clock face
   createSVGboundParent("circle", {
      'cx': middleX,
      'cy': middleY,
      'r': outerR,
      'styles': {
         'fill': 'white'
      }
   });

   // create clock face
   createSVGboundParent("circle", {
      'cx': middleX,
      'cy': middleY,
      'r': 25,
      'styles': {
         'fill': 'white',
         'stroke': clockFaceColor,
         'stroke-width': 3
      }
   });

   // create clock Arrows
   createSVGboundParent("line", {
      'x1': middleX,
      'x2': middleX,
      'y1': middleY,
      'y2': middleY - 20,
      'styles': {
         'stroke': clockFaceColor,
         'stroke-linecap': "round",
         'stroke-width': 3
      }
   });

   createSVGboundParent("line", {
      'x1': middleX,
      'x2': middleX,
      'y1': middleY,
      'y2': middleY - 20,
      'transform': `rotate(135, ${middleX}, ${middleY})`,
      'styles': {
         'stroke': clockFaceColor,
         'stroke-linecap': "round",
         'stroke-width': 3
      }
   });

   createClockNumbers();

   // generate all the clock ticks around the clockface
   for(let deg = 0; deg <= 360; deg += 15) {
      const tickSize = 4;
      const spacing = 5;
      createSVGboundParent("line", {
         'x1': middleX,
         'x2': middleX,
         'y1': middleY - outerR + spacing + tickSize,
         'y2': middleY - outerR + spacing,
         'transform': `rotate(${deg}, ${middleX}, ${middleY})`,
         'styles': {
            'stroke': 'grey',
            'stroke-linecap': "round",
            'stroke-width': 1,
         }
      });
   }
}

function createGraphBarSVG(height, deg, title, svg1) {
   const bar = createSVG("g", {}, svg1);
   var bar_level = createSVGBarLevel(height, deg);
   var bar_selec = createSVGSelector(deg, title);
   bar.appendChild(bar_level);
   bar.appendChild(bar_selec);
   return bar;
};

function createSVGSelector(deg, title) {
   var selector = createSVGBarLevel(barHeight, deg);
   
   // set selector specific css
   selector.style.opacity = 0;
   selector.style.fill = 'white';
   selector.style.transition = '0.3';

   selector.addEventListener('mouseenter', e => {
      selector.style.opacity = 0.15;
   });

   selector.addEventListener('mouseleave', e => {
      selector.style.opacity = 0;
   });

   // add a title to selector
   if (title) {
      const titleElement = createSVG("title", {
         'innerHTML': title + ' messages'
      });
      selector.appendChild(titleElement);
   }

   return selector;
}

function createSVGBarLevel(height, deg) {
   const START_ANGLE = 90 - deg;
   const END_ANGLE = 75 - deg;

   const path = [
      `M ${middleX} ${middleY}`,
      `L ${middleX + Math.cos(START_ANGLE * ANGLE_RATIO) * (outerR + height)}
         ${middleY - Math.sin(START_ANGLE * ANGLE_RATIO) * (outerR + height)}`,
      `A ${outerR + height} ${outerR + height} 0 0 1  
      ${middleX + Math.cos(END_ANGLE * ANGLE_RATIO) * (outerR + height)} 
      ${middleY - Math.sin(END_ANGLE * ANGLE_RATIO) * (outerR + height)} Z`].join(" ")
   
   const bar = createSVG("path", {
      'd': path,
      'styles': {
         'fill': barColor
      }
   });

   return bar;
};

// create clock numbers
// TODO: font-size passed from outside maybe?
function createClockNumbers() {
   const distanceFromMid = 70;
   const textSize = 22.25 / 2;
   const fontSize = '20px';

   var clockNumberFactory = function(innerHTML, x, y) {
      return createSVGboundParent("text", {
         'x': x,
         'y': y,
         'class': "clock-text",
         'innerHTML': innerHTML,
         'styles': {
            'font': 'bold',
            'font-size': fontSize
         }
      });
   }

   clockNumberFactory('00', middleX - textSize, middleY - distanceFromMid);
   clockNumberFactory('12', middleX - textSize, middleY + distanceFromMid + textSize);
   clockNumberFactory('06', middleX + distanceFromMid - textSize / 2, middleY + textSize / 2);
   clockNumberFactory('18', middleX - distanceFromMid - textSize, middleY + textSize / 2);
}

export { ClockChart };
