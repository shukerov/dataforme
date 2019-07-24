import { Chart } from 'frappe-charts/dist/frappe-charts.min.esm';
import { ClockChart } from '../js/clock-chart/clock_graph.js';

export let isMobile = function() {
   return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function formatNum(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function renderText(text, highlight, parent) {
   let container = document.createElement('p');
   let textA = text.split('*');

   textA.forEach((item) => {
      let span = document.createElement('span');
      span.innerHTML = item;
      container.appendChild(span);
   });

   let pos = 1;
   highlight.forEach((item) => {
      let highlighted = document.createElement('strong');

      highlighted.innerHTML = item;
      container.insertBefore(highlighted, container.children[pos]);

      pos +=2;
   });

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

      if (isMobile) {
         return 250;
      }
      else {
         if (size === 'medium') return 600;
         if (size === 'small')  return 250;
      }
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
            lineOptions: {
               regionFill: 1
            }
            // maxSlices: 24
         })
      }
      else if (args.type == 'clock') {
         return new ClockChart(data, 600, args.parent, {
            'addLegend':
            true
         });
      }
   }
}

export { chartFactory };
