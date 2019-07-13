// "use strict";
// import ANGLE_RATIO from '/constants.js';

// TODO: expand createSVG it also needs to be able to suck  in styles/ innerHTML and potentially even other elements
// TODO: pull out the colors into varibles, and think about how to handle that.
// TODO: calculate the size from parent element?


// TODO: IMPLEMENT WHAT YOU LEARNED MATE... the lessons are so applicable here
// instead of giving parent everytime make createSvg that binds parent to it. Also pull out the createsvg out of this file.
class ClockChart {
   constructor(graphData, height, parent) {
      return getClockGraph(graphData, height, parent);
   }
}

// var kokich = (function () {
   var middleX = 400;
   var middleY = 400;
   const outerR = 100;
   const barHeight = 200;
   const radiusBig = outerR + barHeight;

   // color constants. Maybe add a functionality to change those from outside?
   const clockFaceColor = "#0066ff";
   const barColor = "#0066ff";
   const backgroundCircleColor = "#cce1fe";


   function setup(height, parent) {
      middleX = height / 2;
      middleY = height / 2;
      parent.appendChild(this);
   }

   // TODO; could be a part of a utils file
   function createSvg(tag, attributes, parent) {
      var svg =  document.createElementNS("http://www.w3.org/2000/svg", tag);
      svg.setAttribute("viewBox", "0 0 600 600");
      svg.style = "margin: 0 auto;"      

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
      
      // append to parent if specified
      if (parent) parent.appendChild(svg);

      return svg;
   }

   // returns a "loaded" create svgFunction with a bound parent argument
   function createSVGLoaded(parent) {
      return function(...args) {
         createSvg(...args, parent);
      }
   };

   function createGraphBarSVG(height, deg, title, svg1) {
      const bar = createSvg("g", {}, svg1);
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
         const titleElement = createSvg("title", {
            'innerHTML': title + ' messages'
         });
         selector.appendChild(titleElement);
      }

      return selector;
   }

   function createSVGBarLevel(height, deg) {
      const ANGLE_RATIO = Math.PI / 180;
      const START_ANGLE = 90 - deg;
      const END_ANGLE = 75 - deg;

      const path = [
         `M ${middleX} ${middleY}`,
         `L ${middleX + Math.cos(START_ANGLE * ANGLE_RATIO) * (outerR + height)}
            ${middleY - Math.sin(START_ANGLE * ANGLE_RATIO) * (outerR + height)}`,
         `A ${outerR + height} ${outerR + height} 0 0 1  
         ${middleX + Math.cos(END_ANGLE * ANGLE_RATIO) * (outerR + height)} 
         ${middleY - Math.sin(END_ANGLE * ANGLE_RATIO) * (outerR + height)} Z`].join(" ")
      
      const bar = createSvg("path", {
         'd': path,
         'styles': {
            'fill': barColor
         }
      });

      return bar;
   };

   function createClockNumbers(svgCreateFn) {
      const distanceFromMid = 70;
      const textSize = 22.25 / 2;
      const fontSize = '20px';

      // create clock numbers
      svgCreateFn("text", {
         'x': middleX - textSize,
         'y': middleY - distanceFromMid,
         'class': "clock-text",
         'innerHTML': '00',
         'styles': {
            'font': 'bold',
            'font-size': fontSize
         }
      });

      svgCreateFn("text", {
         'x': middleX - textSize,
         'y': middleY + distanceFromMid + textSize,
         'class': "clock-text",
         'innerHTML': '12',
         'styles': {
            'font': 'bold',
            'font-size': fontSize
         }
      });

      svgCreateFn("text", {
         'x': middleX + distanceFromMid - textSize / 2,
         'y': middleY + textSize / 2,
         'class': "clock-text",
         'innerHTML': '06',
         'styles': {
            'font': 'bold',
            'font-size': fontSize
         }
      });

      svgCreateFn("text", {
         'x': middleX - distanceFromMid - textSize,
         'y': middleY + textSize / 2,
         'class': "clock-text",
         'innerHTML': '18',
         'styles': {
            'font': 'bold',
            'font-size': fontSize
         }
      });
   }

   function getClockGraph(graphData, height, parent) {
      // NOTE: data is an array and has to be a size of 24... need a check here!
      // create the svg element
      const svg1 = createSvg("svg", {
         id: "clock-copy",
         height: height,
         width: height
      });
      
      setup.apply(svg1, [height, parent]);

      var createSVGboundParent = createSVGLoaded(svg1);
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

      createClockNumbers(createSVGboundParent);

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

export { ClockChart };
   // return {
   //    getClockGraph
   // }
// })();
