import itooltip from '../../images/components/help-circle.svg';
import '../../styles/components/toolTip.scss';

export class ToolTip {
  constructor(title) {
    this.title = title; // the tooltip text
    this.self = null; // the tooltip div
    this.toolTipIcon = new Image(); // the tooltip icon

    // add the image and css class to tooltip icon
    this.toolTipIcon.classList.add('tooltip-icon');
    this.toolTipIcon.src = itooltip;

    // add events that trigger showing/hiding tooltip
    this.toolTipIcon.addEventListener('mouseover', this.showTip.bind(this));
    this.toolTipIcon.addEventListener('mouseout', this.hideTip.bind(this));

    return this.toolTipIcon;
  }
  
  showTip() {
    this.self = document.createElement('div');
    this.self.classList.add('tooltip');
    this.self.appendChild(document.createTextNode(this.title));
    this.toolTipIcon.parentNode.insertBefore(this.self, this.toolTipIcon);

    // calculate the and add the position of the tip
    const padding = 10;
    let linkProps = this.toolTipIcon.getBoundingClientRect();
    let toolTipProps = this.self.getBoundingClientRect();
    let topPos = linkProps.top - (toolTipProps.height + padding);
    this.self.setAttribute('style', `top: ${topPos}px; left: ${linkProps.left}px;`);
  }

  hideTip() {
    this.self.remove();
  }
}
