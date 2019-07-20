import { Chart } from 'frappe-charts/dist/frappe-charts.min.esm';
import { ClockChart } from '../js/clock-chart/clock_graph.js';

export function renderDecoratedText(decorate, prefix, postfix, parent) {
   var container = document.createElement('p');       // holds all elements
   var pretext = document.createElement('span');      // prefix text
   var dtext = document.createElement('strong');      // decorated text

   pretext.innerHTML = prefix + " ";
   dtext.innerHTML = `${decorate}`;

   container.appendChild(pretext);
   container.appendChild(dtext);

   if (postfix) {
      var potext = document.createElement('span');     // postfix text
      potext.innerHTML = ' ' + postfix;
      container.appendChild(potext);
   }

   // should it not always return the container
   return (parent ? parent.appendChild(container) : container);
}

export function createImage(imgSrc) {
   var img = new Image();
   img.src = imgSrc;
   return img;
}

class chartFactory {
   
   constructor(colorscheme) {
      // constants
      this.DEFAULT_CHART_SIZE = 600;
      this.cscheme = this.setColorScheme(colorscheme);
   }

   setColorScheme(cscheme) {
      const schemes = {
         blue: ['light-blue', 'blue', 'violet']
      }

      return schemes[cscheme];
   }

   // TODO: need to make sure that unique colors are chosen
   getColor(n=1) {
      let colors = [];
      for( var i = 0; i < n; i++) {
         colors.push(this.cscheme[Math.floor(Math.random()*this.cscheme.length)]);
      }
      return colors;
   }

   getSize(size) {
      if (!size) {
         return this.DEFAULT_CHART_SIZE;
      }

      if (size === 'medium') return 600;
      if (size === 'small')  return 250;
   }

   prepData(args) {
      let data;

      if (args.type == 'axis-mixed') {
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

      if (/^(bar|line|scatter|pie|percentage|axis-mixed)$/.test(args.type)) {
         var chart = document.createElement('div');
         chart.id = args.name;
         args.parent.appendChild(chart);

         new Chart(`#${args.name}`, {  // or a DOM element,
            title: args.title,
            data: data,
            type: args.type, // or 'bar', 'line', 'scatter', 'pie', 'percentage'
            height: size,
            colors: this.getColor(),
            valuesOverPoints: 0,
            barOptions: {
               spaceRatio: 0.3,
               stacked: 0
            },
            // maxSlices: 24
         })
      }
      else if (args.type == 'clock') {
         return new ClockChart(data, size, args.parent, {
            'addLegend':
            true
         });
      }
   }
}

export { chartFactory };
