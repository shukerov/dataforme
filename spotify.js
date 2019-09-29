/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/page-spotify/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/clock-chart/clock_graph.js":
/*!*******************************************!*\
  !*** ./src/js/clock-chart/clock_graph.js ***!
  \*******************************************/
/*! exports provided: ClockChart */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ClockChart\", function() { return ClockChart; });\n/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ \"./src/js/clock-chart/constants.js\");\n/* harmony import */ var _draw_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./draw-utils.js */ \"./src/js/clock-chart/draw-utils.js\");\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }\n\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance\"); }\n\nfunction _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === \"[object Arguments]\") return Array.from(iter); }\n\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n// TODO: tear this whole file up please\n\n\n\nvar ClockChart =\n/*#__PURE__*/\nfunction () {\n  // TODO: make use of the options to set the colors for the graph\n  // TODO: data is an array and has to be a size of 24... need a check here!\n  function ClockChart(graphData, height, parent, options) {\n    _classCallCheck(this, ClockChart);\n\n    // create svg element\n    this.svg = Object(_draw_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"createSVG\"])('svg', {\n      height: height,\n      width: height\n    });\n    this.outerR = 50;\n    this.barHeight = 100;\n    this.radiusBig = this.outerR + this.barHeight;\n    this.innerClockRadius = 20;\n    this.innerClockArrowsLen = 15; // set up dimensions\n\n    this.middleX = height / 2;\n    this.middleY = height / 2; // function helper so I can bind everything to svg?\n\n    this.createSVG = Object(_draw_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"createSVGLoaded\"])(this.svg); // ild style changes\n    // svg.setAttribute('viewBox', `0 0 400 400`);\n\n    this.svg.style.margin = '0 auto';\n    this.clockFaceColor = _constants_js__WEBPACK_IMPORTED_MODULE_0__[\"CLK_COLOR_DEF\"];\n    this.barColor = _constants_js__WEBPACK_IMPORTED_MODULE_0__[\"BAR_COLOR_DEF\"];\n    this.backgroundCircleColor = _constants_js__WEBPACK_IMPORTED_MODULE_0__[\"BG_COLOR_DEF\"];\n    this.units = 'thingies';\n    if (options) this.applyOptions(options);\n    parent.appendChild(this.svg); // resize with parent\n\n    window.addEventListener('resize', this.updateDimensions.bind(this, parent)); // create the graph\n\n    this.getClockGraph(graphData, parent);\n  }\n\n  _createClass(ClockChart, [{\n    key: \"applyOptions\",\n    value: function applyOptions(options) {\n      if (options.units) {\n        this.units = options.units;\n      }\n    } // trying out resizing\n\n  }, {\n    key: \"updateDimensions\",\n    value: function updateDimensions(parent) {\n      var buffer = 100;\n      var height = Object(_draw_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"getElementContentWidth\"])(parent); // if its less than the original width added\n\n      if (height < this.middleX * 2) {\n        this.svg.setAttribute('height', \"\".concat(height - buffer));\n        this.svg.setAttribute('width', \"\".concat(height - buffer));\n      } else if (height >= this.middleX * 2) {\n        this.svg.setAttribute('height', this.middleX * 2);\n        this.svg.setAttribute('width', this.middleX * 2);\n      }\n    }\n  }, {\n    key: \"getClockGraph\",\n    value: function getClockGraph(graphData, parent) {\n      // create the outer stat circle\n      this.createSVG('circle', {\n        'cx': this.middleX,\n        'cy': this.middleY,\n        'r': this.radiusBig,\n        'fill': this.backgroundCircleColor\n      }); // creates the bars of the chart\n\n      var maxVal = Math.max.apply(Math, _toConsumableArray(graphData));\n\n      for (var i = 0; i < graphData.length; i++) {\n        this.createGraphBarSVG(graphData[i] * this.barHeight / maxVal, i * 15, graphData[i]);\n      }\n\n      this.createClockFace(); // create stat lines\n\n      for (var deg = 0; deg <= 360; deg += 15) {\n        this.createSVG('line', {\n          'x1': this.middleX,\n          'x2': this.middleX,\n          'y1': this.middleY - this.outerR,\n          'y2': this.middleY - this.radiusBig,\n          'transform': \"rotate(\".concat(deg, \", \").concat(this.middleX, \", \").concat(this.middleY, \")\"),\n          'styles': {\n            'stroke': 'white',\n            'stroke-width': 2\n          }\n        });\n      }\n\n      if (parent) {\n        parent.appendChild(this.svg);\n      } else {\n        return this.svg;\n      }\n    } // TODO: make this one group, and break the components within into groups too\n\n  }, {\n    key: \"createClockFace\",\n    value: function createClockFace() {\n      // create outer clock face\n      this.createSVG('circle', {\n        'cx': this.middleX,\n        'cy': this.middleY,\n        'r': this.outerR,\n        'styles': {\n          'fill': 'white'\n        }\n      }); // create clock face\n\n      this.createSVG('circle', {\n        'cx': this.middleX,\n        'cy': this.middleY,\n        'r': this.innerClockRadius,\n        'styles': {\n          'fill': 'white',\n          'stroke': this.clockFaceColor,\n          'stroke-width': 3\n        }\n      }); // create clock Arrows\n\n      this.createSVG('line', {\n        'x1': this.middleX,\n        'x2': this.middleX,\n        'y1': this.middleY,\n        'y2': this.middleY - this.innerClockArrowsLen,\n        'styles': {\n          'stroke': this.clockFaceColor,\n          'stroke-linecap': 'round',\n          'stroke-width': 3\n        }\n      });\n      this.createSVG('line', {\n        'x1': this.middleX,\n        'x2': this.middleX,\n        'y1': this.middleY,\n        'y2': this.middleY - this.innerClockArrowsLen,\n        'transform': \"rotate(135, \".concat(this.middleX, \", \").concat(this.middleY, \")\"),\n        'styles': {\n          'stroke': this.clockFaceColor,\n          'stroke-linecap': 'round',\n          'stroke-width': 3\n        }\n      });\n      this.createClockNumbers(); // generate all the clock ticks around the clockface\n\n      for (var deg = 0; deg <= 360; deg += 15) {\n        var tickSize = 4;\n        var spacing = 5;\n        this.createSVG('line', {\n          'x1': this.middleX,\n          'x2': this.middleX,\n          'y1': this.middleY - this.outerR + spacing + tickSize,\n          'y2': this.middleY - this.outerR + spacing,\n          'transform': \"rotate(\".concat(deg, \", \").concat(this.middleX, \", \").concat(this.middleY, \")\"),\n          'styles': {\n            'stroke': 'grey',\n            'stroke-linecap': 'round',\n            'stroke-width': 1\n          }\n        });\n      }\n    }\n  }, {\n    key: \"createGraphBarSVG\",\n    value: function createGraphBarSVG(height, deg, title) {\n      var bar = Object(_draw_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"createSVG\"])('g', {}, this.svg);\n      var bar_level = this.createSVGBarLevel(height, deg);\n      var bar_selec = this.createSVGSelector(deg, title);\n      bar.appendChild(bar_level);\n      bar.appendChild(bar_selec);\n      return bar;\n    }\n  }, {\n    key: \"createSVGSelector\",\n    value: function createSVGSelector(deg, title) {\n      var selector = this.createSVGBarLevel(this.barHeight, deg); // set selector specific css\n\n      selector.style.opacity = 0;\n      selector.style.fill = 'white';\n      selector.style.transition = '0.3';\n      selector.addEventListener('mouseenter', function (e) {\n        selector.style.opacity = 0.15;\n      });\n      selector.addEventListener('mouseleave', function (e) {\n        selector.style.opacity = 0;\n      }); // add a title to selector\n\n      if (title) {\n        var titleElement = Object(_draw_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"createSVG\"])('title', {\n          'innerHTML': title + \" \".concat(this.units)\n        });\n        selector.appendChild(titleElement);\n      }\n\n      return selector;\n    }\n  }, {\n    key: \"createSVGBarLevel\",\n    value: function createSVGBarLevel(height, deg) {\n      var START_ANGLE = 90 - deg;\n      var END_ANGLE = 75 - deg;\n      var path = [\"M \".concat(this.middleX, \" \").concat(this.middleY), \"L \".concat(this.middleX + Math.cos(START_ANGLE * _constants_js__WEBPACK_IMPORTED_MODULE_0__[\"ANGLE_RATIO\"]) * (this.outerR + height), \"\\n         \").concat(this.middleY - Math.sin(START_ANGLE * _constants_js__WEBPACK_IMPORTED_MODULE_0__[\"ANGLE_RATIO\"]) * (this.outerR + height)), \"A \".concat(this.outerR + height, \" \").concat(this.outerR + height, \" 0 0 1  \\n      \").concat(this.middleX + Math.cos(END_ANGLE * _constants_js__WEBPACK_IMPORTED_MODULE_0__[\"ANGLE_RATIO\"]) * (this.outerR + height), \" \\n      \").concat(this.middleY - Math.sin(END_ANGLE * _constants_js__WEBPACK_IMPORTED_MODULE_0__[\"ANGLE_RATIO\"]) * (this.outerR + height), \" Z\")].join(\" \");\n      var bar = Object(_draw_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"createSVG\"])('path', {\n        'd': path,\n        'styles': {\n          'fill': this.barColor\n        }\n      });\n      return bar;\n    }\n  }, {\n    key: \"createClockNumbers\",\n    // create clock numbers\n    // TODO: font-size passed from outside maybe?\n    value: function createClockNumbers() {\n      var distanceFromMid = 30;\n      var textSize = 11.25 / 2;\n      var fontSize = '10px';\n\n      var clckNumFactory = function (innerHTML, x, y) {\n        return this.createSVG('text', {\n          'x': x,\n          'y': y,\n          'class': 'clock-text',\n          'innerHTML': innerHTML,\n          'styles': {\n            'font': 'bold',\n            'font-size': fontSize\n          }\n        });\n      }.bind(this);\n\n      clckNumFactory('00', this.middleX - textSize, this.middleY - distanceFromMid);\n      clckNumFactory('12', this.middleX - textSize, this.middleY + distanceFromMid + textSize);\n      clckNumFactory('06', this.middleX + distanceFromMid - textSize / 2, this.middleY + textSize / 2);\n      clckNumFactory('18', this.middleX - distanceFromMid - textSize, this.middleY + textSize / 2);\n    }\n  }, {\n    key: \"getConclusion\",\n    value: function getConclusion(data, verb) {\n      // gets the maximum from the fake data\n      var maxVal = 0;\n      var maxIndex = -1;\n\n      for (var i = 0; i < data.length; i++) {\n        if (maxVal <= data[i]) {\n          maxVal = data[i];\n          maxIndex = i;\n        }\n      }\n\n      return \"You have \".concat(verb, \" the most from      \").concat(Object(_draw_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"getTime\"])(maxIndex), \" to \").concat(Object(_draw_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"getTime\"])(maxIndex + 1), \".\");\n    }\n  }]);\n\n  return ClockChart;\n}();\n\n\n\n//# sourceURL=webpack:///./src/js/clock-chart/clock_graph.js?");

/***/ }),

/***/ "./src/js/clock-chart/constants.js":
/*!*****************************************!*\
  !*** ./src/js/clock-chart/constants.js ***!
  \*****************************************/
/*! exports provided: ANGLE_RATIO, CLK_COLOR_DEF, BAR_COLOR_DEF, BG_COLOR_DEF */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ANGLE_RATIO\", function() { return ANGLE_RATIO; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"CLK_COLOR_DEF\", function() { return CLK_COLOR_DEF; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"BAR_COLOR_DEF\", function() { return BAR_COLOR_DEF; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"BG_COLOR_DEF\", function() { return BG_COLOR_DEF; });\nvar ANGLE_RATIO = Math.PI / 180;\nvar CLK_COLOR_DEF = \"#0066ff\";\nvar BAR_COLOR_DEF = \"#0066ff\";\nvar BG_COLOR_DEF = \"#cce1fe\";\n\n\n//# sourceURL=webpack:///./src/js/clock-chart/constants.js?");

/***/ }),

/***/ "./src/js/clock-chart/draw-utils.js":
/*!******************************************!*\
  !*** ./src/js/clock-chart/draw-utils.js ***!
  \******************************************/
/*! exports provided: getTime, getElementContentWidth, createSVG, createSVGLoaded */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getTime\", function() { return getTime; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getElementContentWidth\", function() { return getElementContentWidth; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createSVG\", function() { return createSVG; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createSVGLoaded\", function() { return createSVGLoaded; });\n/* harmony import */ var _style_graph_wrapper_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style/graph-wrapper.scss */ \"./src/js/clock-chart/style/graph-wrapper.scss\");\n/* harmony import */ var _style_graph_wrapper_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_graph_wrapper_scss__WEBPACK_IMPORTED_MODULE_0__);\n // creates an svg tag, applies the given attributes, and optionally appends the element to a parent\n\nfunction createSVG(tag, attributes, parent) {\n  var svg = document.createElementNS(\"http://www.w3.org/2000/svg\", tag); // set the attributes for the svg element\n\n  Object.keys(attributes).forEach(function (key) {\n    if (key == \"innerHTML\") {\n      svg.innerHTML = attributes[key];\n    } else if (key == \"styles\") {\n      // apply all the styles\n      Object.keys(attributes[key]).forEach(function (s) {\n        svg.style[s] = attributes[key][s];\n      });\n    } else {\n      svg.setAttribute(key, attributes[key]);\n    }\n  }); // append to parent if specified\n\n  if (parent) parent.appendChild(svg);\n  return svg;\n} // returns a \"loaded\" create svgFunction with a bound parent argument\n// use in case you don't want to attach parent all the time\n\n\nfunction createSVGLoaded(parent) {\n  return function () {\n    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {\n      args[_key] = arguments[_key];\n    }\n\n    createSVG.apply(void 0, args.concat([parent]));\n  };\n}\n\n;\nfunction getTime(index) {\n  var postfix = 'am';\n  var time = index % 12;\n\n  if (index >= 12) {\n    postfix = 'pm';\n  }\n\n  if (time == 0) {\n    return \"12:00 \".concat(postfix);\n  }\n\n  return \"\".concat(time, \":00 \").concat(postfix);\n} // copied from frappe-chart utils\n\nfunction getElementContentWidth(element) {\n  var styles = window.getComputedStyle(element);\n  var padding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);\n  return element.clientWidth - padding;\n}\n\n\n//# sourceURL=webpack:///./src/js/clock-chart/draw-utils.js?");

/***/ }),

/***/ "./src/js/clock-chart/style/graph-wrapper.scss":
/*!*****************************************************!*\
  !*** ./src/js/clock-chart/style/graph-wrapper.scss ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/js/clock-chart/style/graph-wrapper.scss?");

/***/ }),

/***/ "./src/page-spotify/main.js":
/*!**********************************!*\
  !*** ./src/page-spotify/main.js ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _styles_main_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../styles/main.scss */ \"./src/styles/main.scss\");\n/* harmony import */ var _styles_main_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_styles_main_scss__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _js_clock_chart_clock_graph_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../js/clock-chart/clock_graph.js */ \"./src/js/clock-chart/clock_graph.js\");\n\n\nvar fakeData = [4648, 3840, 2475, 1201, 844, 873, 1386, 1952, 5032, 7815, 9034, 3681, 4076, 4677, 6684, 6501, 5244, 3797, 3344, 4265, 4054, 4352, 4538, 4778];\nvar container = document.getElementById(\"svg-testing\");\nvar graph = new _js_clock_chart_clock_graph_js__WEBPACK_IMPORTED_MODULE_1__[\"ClockChart\"](fakeData, 600, container, {\n  addLegend: true\n});\n\n//# sourceURL=webpack:///./src/page-spotify/main.js?");

/***/ }),

/***/ "./src/styles/main.scss":
/*!******************************!*\
  !*** ./src/styles/main.scss ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/styles/main.scss?");

/***/ })

/******/ });