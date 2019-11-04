// Style imports:
import '../../styles/components/reportscommon.scss';

// Import js
import { ToolTip } from '../components/toolTip.js';
import { importAll } from '../helpers.js';

const icons = importAll(require.context('../../images/report-icons', false, /\.svg$/));

export class reportFactory {
  constructor() {
    this.icons = icons;
    this.subreports = {};
    this.reportContainer = document.getElementById('report');
  }

  // renderItemsVerticall should append to the report a list of items
  // renderComparison should render items side by side (eg. sent vs received)

  // Descr: gets the number of subreports in the report
  getNumberSubreports() {
    return Object.keys(this.subreports).length;
  }


  // Descr: fetches a subreport given a title. If subreport doesn't exist it creates one. 
  // --------------------------------------
  // Input:
  //   *  title - string representing the title of the subreport
  getSubreport(title) {
    if (this.subreports[title]) {
      return this.subreports[title];
    }
    

    let subreport = document.createElement('div');
    let titleContainer = document.createElement('div');
    let titleText = document.createElement('h2');
    let subreportContent = document.createElement('div');

    // add style
    let id = `subreport-${this.getNumberSubreports()}`;
    subreport.id = id; 
    subreport.classList.add('subreport');
    subreportContent.classList.add('subreport-content');
    titleContainer.classList.add('subreport-title');
    titleText.classList.add('subreport-title-text');

    // add content
    titleText.innerHTML = title;

    titleContainer.appendChild(titleText);
    subreport.appendChild(titleContainer);
    subreport.appendChild(subreportContent);
    
    // add to subreports
    let result = {
      top: subreport,
      content: subreportContent
    }

    // append to report
    this.reportContainer.appendChild(subreport);

    this.subreports[title] = result;
    return result;
  }


  // Descr: adds a report item to a subreport
  // --------------------------------------
  // Input:
  //   *  reportItems - array of report items. For DS look at report below.
  //   *  type - a string representing the type of report item to be rendered
  //   *  subreport - the DOM element that will contain the report item/items
  add(reportItems, type, subreport) {

    // vertical items, with an individual icon
    if (type == 'icon-list') {
      this.addIconList(reportItems, subreport);
    }
    // one icon big list of items
    else if (type == 'list') {
      this.addList(reportItems, subreport);
    }
    // display raw data
    else if (type == 'raw') {
      this.addRaw(reportItems, subreport);
    }
  }


  // Descr: adds a report item/s to a subreport that look like a list.
  //        think typical ul HTML elements. 
  // --------------------------------------
  // Input:
  //   *  lists - array of report items. DS example below
  //   *  subreport - the DOM element that will contain the report item/items
  // --------------------------------------
  // Data Structure example of a list item:
  // {
  //   icon: 'shopping-bag',
  //   text: 'Ad Interests: ',
  //   type: 'list',
  //   listData: ['some item', 'another item', 'more items'],
  //   tooltip: 'Text that will display in tooltip'
  // }
  addList(lists, subreport) {
    // loop through lists and create all list report items
    lists.forEach((item) => {
      // element creation
      const itemIcon = new Image();
      const reportItem = document.createElement('div');
      const itemLabel = document.createElement('p');
      const reportList = document.createElement('ul');
      let itemToolTip = new ToolTip(item.tooltip);

      // create individual list items
      item.listData.forEach((listItemText) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = listItemText;
        reportList.appendChild(listItem);
      });

      // adding content
      itemIcon.src = this.getIcon(item.icon);
      itemLabel.innerHTML = item.text;

      // add styles
      reportList.classList.add('report-list');
      itemIcon.classList.add('report-item-icon');
      itemLabel.classList.add('report-item-label');
      reportItem.classList.add('report-item-above');

      // appending elements
      reportItem.appendChild(itemIcon);
      reportItem.appendChild(itemLabel);
      reportItem.appendChild(itemToolTip);
      reportItem.appendChild(reportList);

      // append to subreport
      subreport.content.appendChild(reportItem);
    });

  }


  // Descr: adds a report item/s to a subreport that has raw data
  //        Think a long json file. Content is wrapped in a pre tag 
  // --------------------------------------
  // Input:
  //   *  rawItems - array of raw report items. DS example below
  //   *  subreport - the DOM element that will contain the report item/items
  // --------------------------------------
  // Data Structure example of a list item:
  // {
  //   icon: 'smile',
  //   text: 'Face: ',
  //   rawData: 'slkdajsldkjiewjlksajdlkjsldknaslkdlqkjeqwkejlansd',
  //   tooltip: 'Text that will display in tooltip.'
  // }
  addRaw(rawItems, subreport) {
    // loop through rawItems and create all raw report items
    rawItems.forEach((item) => {

      // element creation
      const itemIcon = new Image();
      const reportItem = document.createElement('div');
      const itemLabel = document.createElement('p');
      const itemRaw = document.createElement('pre');
      let itemToolTip = new ToolTip(item.tooltip);

      // adding content
      itemIcon.src = this.getIcon(item.icon);
      itemLabel.innerHTML = item.text;
      itemRaw.innerHTML = item.rawData;

      // add styles
      itemRaw.classList.add('report-raw');
      itemIcon.classList.add('report-item-icon');
      itemLabel.classList.add('report-item-label');
      reportItem.classList.add('report-item-above');

      // appending elements
      reportItem.appendChild(itemIcon);
      reportItem.appendChild(itemLabel);
      reportItem.appendChild(itemToolTip);
      reportItem.appendChild(itemRaw);

      // append to subreport
      subreport.content.appendChild(reportItem);
    });
  }


  // Descr: adds a report item/s to a subreport. Every item will have
  //        an individual icon, tooltip and label. All items are displayed in a row.
  // --------------------------------------
  // Input:
  //   *  reportItems - array of report items. DS example below
  //   *  subreport - the DOM element that will contain the report item/items
  // --------------------------------------
  // Data Structure example of a list item:
  // {
  //   icon: 'smile',
  //   text: 'Face Count: ',
  //   textBold: 15,
  //   tooltip: 'This text will be displayed in the tooltip.'
  // }
  addIconList(reportItems, subreport) {
    // loop through reportItems and create each report item
    reportItems.forEach((item) => {

      // element creation
      let headingIcon = new Image();
      let headingItem = document.createElement('div');
      let headingLabel = document.createElement('p');
      let headingToolTip = new ToolTip(item.tooltip);
      
      // appending elements
      headingItem.appendChild(headingIcon);
      headingItem.appendChild(headingLabel);
      headingItem.appendChild(this.renderText(item.textBold));
      headingItem.appendChild(headingToolTip);

      // adding content
      headingIcon.src = this.getIcon(item.icon);
      headingLabel.innerHTML = item.text;

      // styles
      headingIcon.classList.add('report-item-icon');
      headingLabel.classList.add('report-item-label');
      headingItem.classList.add('report-item-grid');

      // add to subreport
      subreport.content.appendChild(headingItem);
    });
  }


  // Descr: fetches an icon path given an icon name
  // --------------------------------------
  // Input:
  //   *  iconString - string representing the name of the icon
  // Return:
  //   *  the icon path of the searched icon. 
  //   *  throws an error if icon doesn't exist? TODO: Maybe should default to an icon?
  getIcon(iconString) {
    let icon = this.icons[iconString];
    if (icon) {
      return icon;
    }
    else {
      throw `Invalid icon '${iconString}'`;
    }
  }

  // Descr:  creates a paragraph element
  // --------------------------------------
  // Input:
  //   *  text - string which is the innerHTML of the p tag
  // Return:
  //   * the p tag element
  renderText(text) {
    let container = document.createElement('p');
    container.classList.add('report-item-text');
    container.innerHTML = text;
    return container;
  }
}
