// creates an svg tag, applies the given attributes, and optionally appends the element to a parent
function createSVG(tag, attributes, parent) {
   var svg =  document.createElementNS("http://www.w3.org/2000/svg", tag);
   svg.setAttribute("viewBox", "0 0 600 600");
   svg.style = "margin: 0 auto;"      

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

export { createSVG, createSVGLoaded };

