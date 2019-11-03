// TODO: this whole factory needs a refactor.
// names are awful, loading of icon assets is awful, css naming is crap too
// Style imports:
import '../../styles/components/reportscommon.scss';

// Import assets
import icalendar from '../../images/report-icons/calendar.svg';
import itext from '../../images/report-icons/file-text.svg';
import icake from '../../images/report-icons/cake.svg';
import isearch from '../../images/report-icons/search.svg';
import iuser from '../../images/report-icons/user.svg';
import iusers from '../../images/report-icons/users.svg';
import imsg from '../../images/report-icons/message-square.svg';
import imsgcir from '../../images/report-icons/message-circle.svg';
import isend from '../../images/report-icons/send.svg';
import iinbox from '../../images/report-icons/inbox.svg';
import iactivity from '../../images/report-icons/activity.svg';
import ismile from '../../images/report-icons/smile.svg';
import iheart from '../../images/report-icons/heart.svg';

// Import js
import { ToolTip } from '../components/toolTip.js';
// import itooltip from '../../images/components/help-circle.svg';

export class reportFactory {
  constructor() {
    this.icons = {
      'icalendar': icalendar,
      'itext': itext,
      'icake': icake,
      'isearch': isearch,
      'iuser': iuser,
      'iusers': iusers,
      'imsg': imsg,
      'imsgcir': imsgcir,
      'isend': isend,
      'iinbox': iinbox,
      'iactivity': iactivity,
      'ismile': ismile,
      'iheart': iheart,
    }

    this.subreports = [];
  }

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
      //   long lists of items
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
