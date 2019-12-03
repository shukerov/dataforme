import itooltip from '../../assets/images/components/help-circle.svg';
import '../../assets/styles/components/toolTip.scss';

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
    let iconTop = this.toolTipIcon.offsetTop;
    let iconLeft = this.toolTipIcon.offsetLeft;
    let toolTipProps = this.self.getBoundingClientRect();

    // top position of the tooltip bubble
    let topPos = iconTop - (toolTipProps.height + padding);

    this.self.setAttribute('style', `top: ${topPos}px; left: ${iconLeft}px;`);
  }

  hideTip() {
    this.self.remove();
  }
}
