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
    this.subreports = [];
  }

  // renderSubReport returns report content
  // renderReportList should append to the subreport a list
  // renderItemsVerticall should append to the report a list of items
  // renderItemsHorizontal should append to the report a list of items
  // renderItemRaw should append a pre element with raw data inside
  // renderComparison should render items side by side (eg. sent vs received)

  // should just return the report content
  renderSubReport(title, parent, reportItems) {
    // create and append to parent
    let subreport = document.createElement('div');
    parent.appendChild(subreport);
    this.subreports.push(subreport);

    // add style
    let id = `subreport-${this.subreports.length}`;
    subreport.id = id; 
    subreport.classList.add('subreport');

    subreport.innerHTML = `\
        <div class='subreport-title'>\
           <h2 class='subreport-title-text'>${title}</h2>\
        </div>\
        <div class='report-content'></div>\
        `

    let subItemContainer = document.getElementById(id).children[1];

    reportItems.forEach((item) => {
      let icon = this.getIcon(item.icon);
      let options = item.options ? item.options : null;

      // should be able to render
      //   side by side comparison of items
      //   single big stats with an icon under them
      //   top searches??
      if (item.type == 'list') {
        this.renderReportList(icon, item.text, item.listData, item.tooltip, subItemContainer);
      }
      else {
        this.renderReportItem(
          icon,
          item.text,
          this.renderText(item.textBold),
          item.tooltip,
          subItemContainer,
          options);
      }
    });

    return subreport;
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

  renderReportList(iconPath, label, listData, tooltip, parent) {
    const reportItem = document.createElement('div');
    const itemIcon = new Image();
    const itemLabel = document.createElement('p');
    const reportList = document.createElement('ul');

    listData.forEach((listItemText) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = listItemText;
      reportList.appendChild(listItem);
    });

    // adding content
    itemIcon.src = iconPath;
    itemLabel.innerHTML = label;

    reportList.classList.add('report-list');
    itemIcon.classList.add('report-item-icon');
    itemLabel.classList.add('report-item-label');
    reportItem.classList.add('report-item-list');

    reportItem.appendChild(itemIcon);
    reportItem.appendChild(itemLabel);
    reportItem.appendChild(reportList);
    parent.appendChild(reportItem);
  }

  renderReportItem(iconPath, label, headingText, tooltip, parent, options) {
    // element creation
    let headingItem = document.createElement('div');
    // TODO: use helper here
    let headingIcon = new Image();
    let headingLabel = document.createElement('p');
    let headingToolTip = new ToolTip(tooltip);
    
      let preOption = document.createElement('pre');
      preOption.classList.add('heading-item-raw');
    if (options && options.raw) {
      // let preOption = document.createElement('pre');
      // preOption.classList.add('heading-item-raw');
    }

    // appending elements
    headingItem.appendChild(headingIcon);
    headingItem.appendChild(headingLabel);

    if (options && options.raw) {
      preOption.appendChild(headingText);
      headingItem.appendChild(preOption);
    }
    else {
      headingItem.appendChild(headingText);
    }

    headingItem.appendChild(headingToolTip);
    parent.appendChild(headingItem);
    // adding content
    headingIcon.src = iconPath;
    headingLabel.innerHTML = label;

    // styles
    headingIcon.classList.add('report-item-icon');
    headingLabel.classList.add('report-item-label');
    headingItem.classList.add('report-item-grid');
  }
  
  renderText(highlight) {
    let container = document.createElement('p');
    container.classList.add('report-item-text');
    container.innerHTML = highlight;
    return container;
  }
}
