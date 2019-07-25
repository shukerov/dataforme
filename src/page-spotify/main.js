import '../styles/main.scss';
import { ClockChart } from '../js/clock-chart/clock_graph.js';

var fakeData = [4648, 3840, 2475, 1201, 844, 873, 1386, 1952, 5032, 7815,
  9034, 3681, 4076, 4677, 6684, 6501, 5244, 3797, 3344, 4265, 4054, 4352,
  4538, 4778];

var container = document.getElementById("svg-testing");
var graph = new ClockChart(fakeData, 600, container, {addLegend: true});
