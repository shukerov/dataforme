import { Chart } from 'frappe-charts/dist/frappe-charts.min.esm';
import { ClockChart } from '../clock-chart/clock_graph.js';
import { isMobile } from '../helpers.js';

class chartFactory {

  constructor(colorscheme) {
    // constants
    this.DEFAULT_CHART_SIZE = 600;
    this.cscheme = this.setColorScheme(colorscheme);
  }

  setColorScheme(cscheme) {
    const schemes = {
      blue: ['light-blue', 'blue', 'violet', '#41B3A3', '#85DCB'],
      red: ['#1A1A1D', '#4E4E50', '#6F2232', '#950740', '#C3073F']
    }

    return schemes[cscheme];
  }

  // TODO: need to make sure that unique colors are chosen
  getColor(n=1) {
    n = this.numDatasets;
    let randomIndex = Math.floor(Math.random() * (this.cscheme.length - n));

    return this.cscheme.slice(randomIndex, randomIndex + n);
  }

  getSize(size) {
    if (!size) {
      return this.DEFAULT_CHART_SIZE;
    }
    if (isMobile) {
      return 250;
    }
    else {
      if (size === 'medium') return 300;
      if (size === 'small')  return 350;
    }
  }

  prepData(args) {
    let data;

    if (args.type == 'axis-mixed') {
      this.numDatasets = 2;
      // TODO: not handling more than two datasets
      data = {
        labels:  args.labels,
        datasets: [
          {
            name: args.data[2][0],
            values: args.data[0],
            chartType: 'bar'
          },
          {
            name: args.data[2][1],
            values: args.data[1],
            chartType: 'bar'
          }
        ]
      }
    }
    else if (args.labels) {
      this.numDatasets = 1;
      data = {
        labels: args.labels,
        datasets: [{ values: args.data }],
      }
    }
    else {
      data = args.data;
    }

    return data;
  }

  getChart(args) {
    // check arguments
    // this.checkArguments(args);
    // args.type should be defined
    // args.parent needs to be defined
    const size = this.getSize(args.size);
    var data = this.prepData(args);

    // add title
    if (args.title) {
      let gTitle = document.createElement('h2');
      gTitle.classList.add('graph-title');
      gTitle.innerHTML = args.title;
      args.parent.appendChild(gTitle);
    }

    if (/^(bar|line|scatter|pie|percentage|axis-mixed)$/.test(args.type)) {
      var chart = document.createElement('div');
      // chart.classList.add('frappe-chart-wrap');
      chart.id = args.name;
      args.parent.appendChild(chart);

      new Chart(`#${args.name}`, {  // or a DOM element,
        // title: args.title,
        data: data,
        type: args.type, // or 'bar', 'line', 'scatter', 'pie', 'percentage'
        height: size,
        colors: this.getColor(),
        valuesOverPoints: 0,
        barOptions: {
          spaceRatio: 0.3,
          stacked: 0
        },
        lineOptions: {
          regionFill: 1
        }
        // maxSlices: 24
      })
    }
    else if (args.type == 'clock') {
      let clckGraph =  new ClockChart(data, 300, args.parent, {
        units: 'messages'
      });
      let gConclusion = document.createElement('h2');
      gConclusion.classList.add('graph-conclusion');
      gConclusion.innerHTML = clckGraph.getConclusion(data, 'messaged');
      args.parent.appendChild(gConclusion);
    }
  }
}

export { chartFactory };
