// TODO: tear this whole file up please
import { ANGLE_RATIO, CLK_COLOR_DEF, BAR_COLOR_DEF, BG_COLOR_DEF } from './constants.js';
import { createSVG, createSVGLoaded, createLegendWrapper, getElementContentWidth, getTime} from './draw-utils.js';

class ClockChart {
  // TODO: make use of the options to set the colors for the graph
  // TODO: data is an array and has to be a size of 24... need a check here!
  constructor(graphData, height, parent, options) {
    // create svg element
    this.svg = createSVG('svg', {
      height: height,
      width: height
    });

    this.outerR = 50;
    this.barHeight = 100;
    this.radiusBig = this.outerR + this.barHeight;
    this.innerClockRadius = 20;
    this.innerClockArrowsLen = 15;

    // set up dimensions
    this.middleX = height / 2;
    this.middleY = height / 2;

    // function helper so I can bind everything to svg?
    
    this.createSVG = createSVGLoaded(this.svg);

    // ild style changes
    // svg.setAttribute('viewBox', `0 0 400 400`);
    this.svg.style.margin = '0 auto';
    this.clockFaceColor = CLK_COLOR_DEF;
    this.barColor = BAR_COLOR_DEF;
    this.backgroundCircleColor = BG_COLOR_DEF;
    this.units = 'thingies';

    if (options) this.applyOptions(options); 

    parent.appendChild(this.svg);
    // resize with parent
    window.addEventListener('resize', this.updateDimensions.bind(this, parent));

    // create the graph
    this.getClockGraph(graphData, parent);
  }

  applyOptions(options) {
    if (options.units) {
      this.units = options.units;
    }
  }

  // trying out resizing
  updateDimensions(parent) {
    let buffer = 100;
    let height = getElementContentWidth(parent);
    // if its less than the original width added
    if (height < this.middleX * 2) {
      this.svg.setAttribute('height', `${height - buffer}`);
      this.svg.setAttribute('width', `${height - buffer}`);
    }
    else if (height >= this.middleX * 2) {
      this.svg.setAttribute('height', this.middleX * 2);
      this.svg.setAttribute('width', this.middleX * 2);
    }
  }

  getClockGraph(graphData, parent) {
    // create the outer stat circle
    this.createSVG('circle', {
      'cx': this.middleX,
      'cy': this.middleY,
      'r': this.radiusBig,
      'fill': this.backgroundCircleColor
    });

    // creates the bars of the chart
    let maxVal = Math.max(...graphData);
    for (let i = 0; i < graphData.length; i++) {
      this.createGraphBarSVG(graphData[i] * this.barHeight / maxVal,
        i * 15,
        graphData[i]
      );
    }

    this.createClockFace();

    // create stat lines
    for(let deg = 0; deg <= 360; deg += 15) {
      this.createSVG('line', {
        'x1': this.middleX,
        'x2': this.middleX,
        'y1': this.middleY - this.outerR,
        'y2': this.middleY - this.radiusBig,
        'transform': `rotate(${deg}, ${this.middleX}, ${this.middleY})`,
        'styles': {
          'stroke': 'white',
          'stroke-width': 2,
        }
      });
    }

    if (parent) {
      parent.appendChild(this.svg);
    }
    else {
      return this.svg;
    }
  }

  // TODO: make this one group, and break the components within into groups too
  createClockFace() {
    // create outer clock face
    this.createSVG('circle', {
      'cx': this.middleX,
      'cy': this.middleY,
      'r': this.outerR,
      'styles': {
        'fill': 'white'
      }
    });

    // create clock face
    this.createSVG('circle', {
      'cx': this.middleX,
      'cy': this.middleY,
      'r': this.innerClockRadius,
      'styles': {
        'fill': 'white',
        'stroke': this.clockFaceColor,
        'stroke-width': 3
      }
    });

    // create clock Arrows
    this.createSVG('line', {
      'x1': this.middleX,
      'x2': this.middleX,
      'y1': this.middleY,
      'y2': this.middleY - this.innerClockArrowsLen,
      'styles': {
        'stroke': this.clockFaceColor,
        'stroke-linecap': 'round',
        'stroke-width': 3
      }
    });

    this.createSVG('line', {
      'x1': this.middleX,
      'x2': this.middleX,
      'y1': this.middleY,
      'y2': this.middleY - this.innerClockArrowsLen,
      'transform': `rotate(135, ${this.middleX}, ${this.middleY})`,
      'styles': {
        'stroke': this.clockFaceColor,
        'stroke-linecap': 'round',
        'stroke-width': 3
      }
    });

    this.createClockNumbers();

    // generate all the clock ticks around the clockface
    for(let deg = 0; deg <= 360; deg += 15) {
      const tickSize = 4;
      const spacing = 5;
      this.createSVG('line', {
        'x1': this.middleX,
        'x2': this.middleX,
        'y1': this.middleY - this.outerR + spacing + tickSize,
        'y2': this.middleY - this.outerR + spacing,
        'transform': `rotate(${deg}, ${this.middleX}, ${this.middleY})`,
        'styles': {
          'stroke': 'grey',
          'stroke-linecap': 'round',
          'stroke-width': 1,
        }
      });
    }
  }

  createGraphBarSVG(height, deg, title) {
    const bar = createSVG('g', {}, this.svg);
    let bar_level = this.createSVGBarLevel(height, deg);
    let bar_selec = this.createSVGSelector(deg, title);
    bar.appendChild(bar_level);
    bar.appendChild(bar_selec);
    return bar;
  };

  createSVGSelector(deg, title) {
    var selector = this.createSVGBarLevel(this.barHeight, deg);

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
        'innerHTML': title + ` ${this.units}`
      });
      selector.appendChild(titleElement);
    }

    return selector;
  }

  createSVGBarLevel(height, deg) {
    const START_ANGLE = 90 - deg;
    const END_ANGLE = 75 - deg;

    const path = [
      `M ${this.middleX} ${this.middleY}`,
      `L ${this.middleX + Math.cos(START_ANGLE * ANGLE_RATIO) * (this.outerR + height)}
         ${this.middleY - Math.sin(START_ANGLE * ANGLE_RATIO) * (this.outerR + height)}`,
      `A ${this.outerR + height} ${this.outerR + height} 0 0 1  
      ${this.middleX + Math.cos(END_ANGLE * ANGLE_RATIO) * (this.outerR + height)} 
      ${this.middleY - Math.sin(END_ANGLE * ANGLE_RATIO) * (this.outerR + height)} Z`].join(" ")

    const bar = createSVG('path', {
      'd': path,
      'styles': {
        'fill': this.barColor
      }
    });

    return bar;
  };

  // create clock numbers
  // TODO: font-size passed from outside maybe?
  createClockNumbers() {
    const distanceFromMid = 30;
    const textSize = 11.25 / 2;
    const fontSize = '10px';

    var clckNumFactory = function(innerHTML, x, y) {
      return this.createSVG('text', {
        'x': x,
        'y': y,
        'class': 'clock-text',
        'innerHTML': innerHTML,
        'styles': {
          'font': 'bold',
          'font-size': fontSize
        }
      });
    }.bind(this);

    clckNumFactory('00', this.middleX - textSize, this.middleY - distanceFromMid);
    clckNumFactory('12', this.middleX - textSize, this.middleY + distanceFromMid + textSize);
    clckNumFactory('06', this.middleX + distanceFromMid - textSize / 2, this.middleY + textSize / 2);
    clckNumFactory('18', this.middleX - distanceFromMid - textSize, this.middleY + textSize / 2);
  }

  getConclusion(data, verb) {
    // gets the maximum from the fake data
    var maxVal = 0;
    var maxIndex = -1;

    for (var i = 0; i < data.length; i++) {
      if (maxVal <= data[i]) {
        maxVal = data[i];
        maxIndex = i;
      }
    }

    return `You have ${verb} the most from\
      ${getTime(maxIndex)} to ${getTime(maxIndex + 1)}.`;
  }
}

export { ClockChart };
