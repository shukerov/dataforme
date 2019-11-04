// TODO: this whole factory needs a refactor.
// names are awful, loading of icon assets is awful, css naming is crap too
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

  getNumberSubreports() {
    return Object.keys(this.subreports).length;
  }

  // fetches a subreport given a title.
  // if subreport doesn't exist it creates one with the given title
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

  // TODO: needs comments
  addList(lists, subreport) {
    lists.forEach((item) => {
      const reportItem = document.createElement('div');
      const itemIcon = new Image();
      const itemLabel = document.createElement('p');
      const reportList = document.createElement('ul');
      let itemToolTip = new ToolTip(item.tooltip);

      item.listData.forEach((listItemText) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = listItemText;
        reportList.appendChild(listItem);
      });

      // adding content
      itemIcon.src = this.getIcon(item.icon);
      itemLabel.innerHTML = item.text;

      reportList.classList.add('report-list');
      itemIcon.classList.add('report-item-icon');
      itemLabel.classList.add('report-item-label');
      reportItem.classList.add('report-item-above');

      reportItem.appendChild(itemIcon);
      reportItem.appendChild(itemLabel);
      reportItem.appendChild(itemToolTip);
      reportItem.appendChild(reportList);

      subreport.content.appendChild(reportItem);
    });

  }

  // TODO: needs comments
  addRaw(rawItems, subreport) {
    rawItems.forEach((item) => {
      const reportItem = document.createElement('div');
      const itemIcon = new Image();
      const itemLabel = document.createElement('p');
      const itemRaw = document.createElement('pre');
      let itemToolTip = new ToolTip(item.tooltip);

      itemRaw.innerHTML = item.rawData;

      // adding content
      itemIcon.src = this.getIcon(item.icon);
      itemLabel.innerHTML = item.text;

      itemRaw.classList.add('report-raw');
      itemIcon.classList.add('report-item-icon');
      itemLabel.classList.add('report-item-label');
      reportItem.classList.add('report-item-above');

      reportItem.appendChild(itemIcon);
      reportItem.appendChild(itemLabel);
      reportItem.appendChild(itemToolTip);
      reportItem.appendChild(itemRaw);

      subreport.content.appendChild(reportItem);
    });
  }

  // takes an array of items and displays them vertically in order.
  // 
  // example format is:
  // {
  //   icon: 'smile',
  //   text: 'Face Count: ',
  //   textBold: data.face_example_count,
  //   tooltip: 'Number of pictures of your face Facebook has.'
  // }
  addIconList(reportItems, subreport) {
    // loop through icons and create them
    reportItems.forEach((item) => {

      // element creation
      let headingItem = document.createElement('div');
      // TODO: use helper here
      let headingIcon = new Image();
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

  getIcon(iconString) {
    let icon = this.icons[iconString];
    if (icon) {
      return icon;
    }
    else {
      throw `Invalid icon '${iconString}'`;
    }
  }

  renderText(highlight) {
    let container = document.createElement('p');
    container.classList.add('report-item-text');
    container.innerHTML = highlight;
    return container;
  }
}
