import './style/graph-wrapper.scss'

// creates an svg tag, applies the given attributes, and optionally appends the element to a parent
function createSVG(tag, attributes, parent) {
  var svg =  document.createElementNS("http://www.w3.org/2000/svg", tag);

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
// use in case you don't want to attach parent all the time
function createSVGLoaded(parent) {
  return function(...args) {
    createSVG(...args, parent);
  }
};

export function getTime(index) {
  var postfix = 'am';
  var time = index % 12;

  if (index >= 12) {
    postfix = 'pm'
  }

  if (time == 0) {
    return `12:00 ${postfix}`;
  }

  return `${time}:00 ${postfix}`;
}

// copied from frappe-chart utils
export function getElementContentWidth(element) {
  let styles = window.getComputedStyle(element);
  let padding = parseFloat(styles.paddingLeft) +
    parseFloat(styles.paddingRight);

  return element.clientWidth - padding;
}


export { createSVG, createSVGLoaded };
