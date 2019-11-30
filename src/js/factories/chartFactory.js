import { Chart } from 'frappe-charts/dist/frappe-charts.min.esm';
import { ClockChart } from '../clock-chart/clock_graph.js';
import { isMobile } from '../helpers.js';

class chartFactory {

  constructor(colorscheme_key) {
    // constants
    this.DEFAULT_CHART_SIZE = 600;
    this.color_key = colorscheme_key;
    this.color_schemes = {
      'facebook': {
        'bar': ['light-blue', 'blue', 'violet', '#41B3A3', '#85DCB'],
        'line': [ 'violet' ]
      },
      'tinder': {
        'bar': [ 'red'],
        'pie': [ '#9b2020', 'red' ],
        'heatmap': ['#ffd6d3', '#ffa7a0', '#ff877e', '#ff584b', '#ff3929']
      },
      'spotify': {
        'bar': [ '#90f285' ],
        'clock': [ '#18bb51', '#18bb51', '#baf6cf']
      },
      'default': ['light-blue', 'blue', 'violet', '#41B3A3', '#85DCB']
    };
  }

  getColor(chart_type) {
    if (this.color_key) {
      return this.color_schemes[this.color_key][chart_type];
    }

    // so one can work on a report before worrying about colors
    return this.color_schemes['default'];
  }

  getSize(size) {
    if (!size) {
      return this.DEFAULT_CHART_SIZE;
    }
    if (isMobile) {
      return 250;
    }
    else {
      if (size === 'huge') return 200;
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

    if (/^(bar|heatmap|line|scatter|pie|percentage|axis-mixed)$/.test(args.type)) {
      var chart = document.createElement('div');
      chart.id = args.name;


      args.parent.appendChild(chart);

      const chartOptions = {  // or a DOM element,
        data: data,
        type: args.type,
        height: size,
        colors: this.getColor(args.type),
        valuesOverPoints: 0,
        barOptions: {
          spaceRatio: 0.3,
          stacked: 0
        },
        lineOptions: {
          regionFill: 1
        },
        maxSlices: 24
      }

      if (args.type == 'heatmap') {
        // Forces heatmaps to be responsive with scrolling
        chart.classList.add('heatmap-graph');
      }

      new Chart(`#${args.name}`, chartOptions)
    }
    else if (args.type == 'clock') {
      let clckGraph =  new ClockChart(data, 300, args.parent, {
        units: args.clock_labels[0],
        colors: this.getColor(args.type)
      });

      // add conclusion?
      let gConclusion = document.createElement('h2');
      gConclusion.classList.add('graph-conclusion');
      gConclusion.innerHTML = clckGraph.getConclusion(data, args.clock_labels[1]);
      args.parent.appendChild(gConclusion);
    }
  }
}

export { chartFactory };
