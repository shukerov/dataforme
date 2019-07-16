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


export function renderChart(type, data, labels, colorscheme) {
}
