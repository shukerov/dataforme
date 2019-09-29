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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/page-index/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/images/icons/facebook_inline.svg":
/*!**********************************************!*\
  !*** ./src/images/icons/facebook_inline.svg ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<svg version=\\\"1.1\\\" id=\\\"Capa_1\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\" xmlns:xlink=\\\"http://www.w3.org/1999/xlink\\\" x=\\\"0px\\\" y=\\\"0px\\\" viewBox=\\\"0 0 112.196 112.196\\\" xml:space=\\\"preserve\\\"><g><path d=\\\"M70.201,58.294h-10.01v36.672H45.025V58.294h-7.213V45.406h7.213v-8.34 c0-5.964,2.833-15.303,15.301-15.303L71.56,21.81v12.51h-8.151c-1.337,0-3.217,0.668-3.217,3.513v7.585h11.334L70.201,58.294z\\\"></path></g></svg>\"\n\n//# sourceURL=webpack:///./src/images/icons/facebook_inline.svg?");

/***/ }),

/***/ "./src/images/icons/spotify_inline.svg":
/*!*********************************************!*\
  !*** ./src/images/icons/spotify_inline.svg ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<svg version=\\\"1.1\\\" id=\\\"Layer_1\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\" xmlns:xlink=\\\"http://www.w3.org/1999/xlink\\\" x=\\\"0px\\\" y=\\\"0px\\\" viewBox=\\\"0 0 427.7 427.7\\\" xml:space=\\\"preserve\\\"><path d=\\\"M306.9,310.3c-2.7,4.7-7.6,7.2-12.6,7.2c-2.5,0-5-0.6-7.4-2c-38.4-22.5-82.8-26.1-113.3-25.1 c-33.8,1-58.5,7.7-58.8,7.8c-7.8,2.1-15.8-2.5-18-10.2c-2.1-7.8,2.4-15.8,10.2-18c1.1-0.3,27.8-7.5,64.8-8.8 c21.8-0.7,42.8,0.8,62.4,4.5c24.8,4.7,47.5,13,67.3,24.6C308.6,294.4,311,303.3,306.9,310.3z M334.1,253.9c-3.2,5.5-9,8.6-15,8.6 c-3,0-6-0.8-8.7-2.4c-45.5-26.6-98.1-30.9-134.2-29.8c-40,1.2-69.3,9.1-69.6,9.2c-9.2,2.5-18.7-2.9-21.3-12.1 c-2.5-9.2,2.9-18.7,12.1-21.3c1.3-0.4,32.9-8.9,76.8-10.4c25.9-0.9,50.7,0.9,74,5.4c29.4,5.6,56.2,15.4,79.7,29.1 C336.1,235,338.9,245.6,334.1,253.9z M350.8,202.5c-3.6,0-7.3-0.9-10.7-2.9c-108.2-63.2-248.6-25.6-250-25.3 c-11.3,3.1-23-3.5-26.1-14.8c-3.1-11.3,3.5-23,14.8-26.1c1.6-0.4,40.3-11,94.2-12.7c31.7-1,62.2,1.2,90.7,6.6 c36.1,6.8,69,18.9,97.8,35.7c10.1,5.9,13.5,18.9,7.6,29.1C365.2,198.8,358.1,202.5,350.8,202.5z\\\"></path></svg>\"\n\n//# sourceURL=webpack:///./src/images/icons/spotify_inline.svg?");

/***/ }),

/***/ "./src/images/icons/tinder_inline.svg":
/*!********************************************!*\
  !*** ./src/images/icons/tinder_inline.svg ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<svg version=\\\"1.1\\\" id=\\\"Tinder\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\" xmlns:xlink=\\\"http://www.w3.org/1999/xlink\\\" x=\\\"0px\\\" y=\\\"0px\\\" viewBox=\\\"0 0 64 64\\\"><title>Tinder Logo</title><path id=\\\"_x3C_path_x3E_\\\" d=\\\"M21.5,26c11.7-4.1,13.7-14.7,12.2-24.5c0-0.4,0.3-0.6,0.6-0.5 c11.2,5.5,23.8,17.6,23.8,35.7C58.2,50.7,47.5,63,32,63C15.5,63,5.8,51,5.8,36.8c0-8.3,5.8-16.9,12.1-20.5c0.3-0.2,0.7,0,0.7,0.4 c0.1,1.9,0.6,6.6,2.7,9.4C21.4,26,21.5,26,21.5,26z\\\"></path></svg>\"\n\n//# sourceURL=webpack:///./src/images/icons/tinder_inline.svg?");

/***/ }),

/***/ "./src/js/components/navBar.js":
/*!*************************************!*\
  !*** ./src/js/components/navBar.js ***!
  \*************************************/
/*! exports provided: NavBar */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"NavBar\", function() { return NavBar; });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar NavBar =\n/*#__PURE__*/\nfunction () {\n  function NavBar() {\n    var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;\n\n    _classCallCheck(this, NavBar);\n\n    // boolean that determines if navbar is loaded on index page\n    this.index = index; // contains the button elements in the navbar\n\n    this.navbarBtns = []; // gets website html element, needed for setting up scrolling event\n\n    this.website = document.getElementById('site'); // boolean, true when user scrolls\n\n    this.scrolled = false;\n    this.lastScroll = 0;\n    this.delta = 5; // create nav\n\n    this.self = document.getElementById('nav');\n    this.setup();\n    this.setScrolling();\n  }\n\n  _createClass(NavBar, [{\n    key: \"setup\",\n    value: function setup() {\n      this.navbar = document.getElementById('nav'); // create buttons\n\n      if (!this.index) {\n        this.createNavButton('analyze', '#report', {\n          subitem: true,\n          navbtn: true\n        });\n      } // setup class variables\n\n\n      this.navbarHeight = this.navbar.scrollHeight;\n      this.navBtns = document.getElementsByClassName('nav-item');\n    }\n  }, {\n    key: \"setScrolling\",\n    value: function setScrolling() {\n      setInterval(function () {\n        if (this.scrolled) {\n          this.scrollingEvent();\n          this.scrolled = false;\n        }\n      }.bind(this), 250);\n      this.website.addEventListener('scroll', function (e) {\n        this.scrolled = true;\n      }.bind(this));\n    }\n  }, {\n    key: \"scrollingEvent\",\n    value: function scrollingEvent() {\n      var curPos = this.website.scrollTop;\n      if (Math.abs(this.lastScroll - curPos) <= this.delta) return; // If they scrolled down and are past the navbar, add class .nav-up.\n\n      if (curPos > this.lastScroll && curPos > this.navbarHeight) {\n        // Scroll Down\n        for (var i = 0; i < this.navBtns.length; i++) {\n          this.navBtns[i].classList.add('nav-hidden');\n        } // this.logoCont.classList.remove('nav-normal');\n        // this.logoCont.classList.remove('nav-expand');\n        // this.logoCont.classList.add('nav-hidden');\n\n      } else {\n        // Scroll Up\n        for (var _i = 0; _i < this.navBtns.length; _i++) {\n          this.navBtns[_i].classList.remove('nav-hidden');\n        } // this.logoCont.classList.remove('nav-hidden');\n        // this.logoCont.classList.add('nav-normal');\n\n      }\n\n      this.lastScroll = curPos;\n    }\n  }, {\n    key: \"createNavButton\",\n    value: function createNavButton(text, link, options) {\n      var item = document.createElement('a');\n      item.classList.add('nav-item'); // item.classList.add('nav-link');\n\n      item.innerHTML = text;\n      item.href = link;\n\n      if (options) {\n        if (options.subitem) item.classList.add('nav-sub-item');\n      }\n\n      this.self.appendChild(item);\n    }\n  }]);\n\n  return NavBar;\n}();\n\n\n\n//# sourceURL=webpack:///./src/js/components/navBar.js?");

/***/ }),

/***/ "./src/page-index/main.js":
/*!********************************!*\
  !*** ./src/page-index/main.js ***!
  \********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _styles_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../styles/index.scss */ \"./src/styles/index.scss\");\n/* harmony import */ var _styles_index_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_styles_index_scss__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _images_icons_facebook_inline_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../images/icons/facebook_inline.svg */ \"./src/images/icons/facebook_inline.svg\");\n/* harmony import */ var _images_icons_facebook_inline_svg__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_images_icons_facebook_inline_svg__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _images_icons_spotify_inline_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../images/icons/spotify_inline.svg */ \"./src/images/icons/spotify_inline.svg\");\n/* harmony import */ var _images_icons_spotify_inline_svg__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_images_icons_spotify_inline_svg__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _images_icons_tinder_inline_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../images/icons/tinder_inline.svg */ \"./src/images/icons/tinder_inline.svg\");\n/* harmony import */ var _images_icons_tinder_inline_svg__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_images_icons_tinder_inline_svg__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _js_components_navBar_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../js/components/navBar.js */ \"./src/js/components/navBar.js\");\n// Style imports:\n // Assets:\n\n\n\n // JS imports:\n\n\nrenderContent();\n\nfunction renderContent() {\n  var globalContainer = document.getElementById('site');\n  var websiteContainer = document.getElementById('website-cnt');\n  var aboutContainer = document.getElementById('about');\n  new _js_components_navBar_js__WEBPACK_IMPORTED_MODULE_4__[\"NavBar\"](true);\n  loadWebsites(websiteContainer); // globalContainer);\n}\n\nfunction loadWebsites(globalContainer) {\n  var routes = {\n    'facebook': _images_icons_facebook_inline_svg__WEBPACK_IMPORTED_MODULE_1___default.a,\n    'spotify': _images_icons_spotify_inline_svg__WEBPACK_IMPORTED_MODULE_2___default.a,\n    'tinder': _images_icons_tinder_inline_svg__WEBPACK_IMPORTED_MODULE_3___default.a\n  };\n  Object.keys(routes).forEach(function (key) {\n    var link = createLink(key);\n    var iconContainer = document.createElement('div');\n    iconContainer.innerHTML = routes[key];\n    link.appendChild(iconContainer);\n    globalContainer.appendChild(link);\n  });\n}\n\nfunction createLink(to) {\n  var linkWrap = document.createElement('a');\n  linkWrap.classList.add('website-item');\n  linkWrap.id = to;\n  linkWrap.href = \"./\".concat(to, \".html\");\n  return linkWrap;\n}\n\n//# sourceURL=webpack:///./src/page-index/main.js?");

/***/ }),

/***/ "./src/styles/index.scss":
/*!*******************************!*\
  !*** ./src/styles/index.scss ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/styles/index.scss?");

/***/ })

/******/ });