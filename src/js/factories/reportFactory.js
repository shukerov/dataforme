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
    }

    this.subreports = [];
  }

  renderSubReport(title, parent, reportItems) {
    // TODO: report heading is a terrible name. its a subreport look at the id ffs
    // create and append to parent
    let reportHeading = document.createElement('div');
    parent.appendChild(reportHeading);
    this.subreports.push(reportHeading);

    // add style
    let id = `subreport-${this.subreports.length}`;
    reportHeading.id = id; 
    reportHeading.classList.add('report-heading');

    reportHeading.innerHTML = `\
        <div class='report-heading-title'>\
           <h2 class='report-heading-user-name'>${title}</h2>\
        </div>\
        <div class='report-heading-content'></div>\
        `

    let subItemContainer = document.getElementById(id).children[1];

    reportItems.forEach((item) => {
      let icon = this.getIcon(item.icon);

      this.renderHeadingItem(
        icon,
        item.text,
        // THIS VERSION only does one bold? do you really need more
        this.renderText('*', [item.textBold]),
        subItemContainer);
    });

    return reportHeading;
  }

  getIcon(iconString) {
    let icon = this.icons[iconString];
    if (icon) {
      return icon;
    }
    else {
      throw `Invalid incon '${iconString}'`;
    }
  }

  renderHeadingItem(iconPath, label, headingText, parent) {
    // element creation
    let headingItem = document.createElement('div');
    // TODO: use helper here
    let headingIcon = new Image();
    let headingLabel = document.createElement('p');

    // appending elements
    headingItem.appendChild(headingIcon);
    headingItem.appendChild(headingLabel);
    headingItem.appendChild(headingText);
    parent.appendChild(headingItem);
    // adding content
    headingIcon.src = iconPath;
    headingLabel.innerHTML = label;

    // styles
    headingIcon.classList.add('heading-content-icon');
    headingLabel.classList.add('heading-content-label');
    headingText.classList.add('heading-content-text');
    headingItem.classList.add('heading-content-item');
  }
  
  renderText(text, highlight, parent) {
    let container = document.createElement('p');
    let textA = text.split('*');

    textA.forEach((item) => {
      let span = document.createElement('span');
      span.innerHTML = item;
      container.appendChild(span);
    });

    let pos = 1;
    highlight.forEach((item) => {
      let highlighted = document.createElement('strong');

      highlighted.innerHTML = item;
      container.insertBefore(highlighted, container.children[pos]);

      pos +=2;
    });

    return (parent ? parent.appendChild(container) : container);
  }
}
