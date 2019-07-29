// TODO: tear this whole file up please
import { ANGLE_RATIO, CLK_COLOR_DEF, BAR_COLOR_DEF, BG_COLOR_DEF } from './constants.js';
import { createSVG, createSVGLoaded, createLegendWrapper } from './draw-utils.js';

// TODO: calculate the size from parent element?
class ClockChart {
  // TODO: make use of the options to set the colors for the graph
  constructor(graphData, height, parent, options) {
    // create svg element
    const svg = createSVG('svg', {
      height: height,
      width: height
    });



    // set up dimensions
    middleX = height / 2;
    middleY = height / 2;
    // svg.setAttribute('viewBox', `0 0 400 400`);
    svg.style.margin = '0 auto';

    parent.appendChild(svg);

    window.addEventListener('resize', updateDimensions.bind(this, parent, svg));

    // TODO: data is an array and has to be a size of 24... need a check here!
    if (options && options.addLegend) {
      var graph = getClockGraph(svg, graphData, height);
      var wrapper = createLegendWrapper(graphData, graph, options.title); 
      parent.appendChild(wrapper);

      // trying to fix dimensions
      updateDimensions.call(this, parent, svg);
    }
    else {
      return getClockGraph(svg, graphData, height, parent);
    }
  }
}

// WHAT EVEN?
var middleX;
var middleY;
// function helpers
var createSVGboundParent;

const outerR = 50;
const barHeight = 100;
const radiusBig = outerR + barHeight;
let innerClockRadius = 20;
let innerClockArrowsLen = 15;


// color constants. Maybe add a functionality to change those from outside?
const clockFaceColor = CLK_COLOR_DEF;
const barColor = BAR_COLOR_DEF;
const backgroundCircleColor = BG_COLOR_DEF;

// trying out resizing
function updateDimensions(parent, svg) {
  var buffer = 100;
  var height = getElementContentWidth(parent);
  // if its less than the original width added
  if (height < middleX * 2) {
    svg.setAttribute('height', `${height - buffer}`);
    svg.setAttribute('width', `${height - buffer}`);
  }
  else if (height >= middleX * 2) {
    svg.setAttribute('height', middleX * 2);
    svg.setAttribute('width', middleX * 2);
  }
}

// copied from frappe-chart utils
function getElementContentWidth(element) {
  var styles = window.getComputedStyle(element);
  var padding = parseFloat(styles.paddingLeft) +
    parseFloat(styles.paddingRight);

  return element.clientWidth - padding;
}

function getClockGraph(svg1, graphData, height, parent) {

  createSVGboundParent = createSVGLoaded(svg1);
  // create the outer stat circle
  createSVGboundParent('circle', {
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
    createSVGboundParent('line', {
      'x1': middleX,
      'x2': middleX,
      'y1': middleY - outerR,
      'y2': middleY - radiusBig,
      'transform': `rotate(${deg}, ${middleX}, ${middleY})`,
      'styles': {
        'stroke': 'white',
        'stroke-width': 2,
      }
    });
  }

  if (parent) {
    parent.appendChild(svg1);
  }
  else {
    return svg1;
  }
}

// TODO: make this one group, and break the components within into groups too
function createClockFace() {
  // create outer clock face
  createSVGboundParent('circle', {
    'cx': middleX,
    'cy': middleY,
    'r': outerR,
    'styles': {
      'fill': 'white'
    }
  });

  // create clock face
  createSVGboundParent('circle', {
    'cx': middleX,
    'cy': middleY,
    'r': innerClockRadius,
    'styles': {
      'fill': 'white',
      'stroke': clockFaceColor,
      'stroke-width': 3
    }
  });

  // create clock Arrows
  createSVGboundParent('line', {
    'x1': middleX,
    'x2': middleX,
    'y1': middleY,
    'y2': middleY - innerClockArrowsLen,
    'styles': {
      'stroke': clockFaceColor,
      'stroke-linecap': 'round',
      'stroke-width': 3
    }
  });

  createSVGboundParent('line', {
    'x1': middleX,
    'x2': middleX,
    'y1': middleY,
    'y2': middleY - innerClockArrowsLen,
    'transform': `rotate(135, ${middleX}, ${middleY})`,
    'styles': {
      'stroke': clockFaceColor,
      'stroke-linecap': 'round',
      'stroke-width': 3
    }
  });

  createClockNumbers();

  // generate all the clock ticks around the clockface
  for(let deg = 0; deg <= 360; deg += 15) {
    const tickSize = 4;
    const spacing = 5;
    createSVGboundParent('line', {
      'x1': middleX,
      'x2': middleX,
      'y1': middleY - outerR + spacing + tickSize,
      'y2': middleY - outerR + spacing,
      'transform': `rotate(${deg}, ${middleX}, ${middleY})`,
      'styles': {
        'stroke': 'grey',
        'stroke-linecap': 'round',
        'stroke-width': 1,
      }
    });
  }
}

function createGraphBarSVG(height, deg, title, svg1) {
  const bar = createSVG('g', {}, svg1);
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
    const titleElement = createSVG('title', {
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

  const bar = createSVG('path', {
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
  const distanceFromMid = 30;
  const textSize = 11.25 / 2;
  const fontSize = '10px';

  var clockNumberFactory = function(innerHTML, x, y) {
    return createSVGboundParent('text', {
      'x': x,
      'y': y,
      'class': 'clock-text',
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
