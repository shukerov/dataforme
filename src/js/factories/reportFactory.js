// Style imports:
import '../../styles/components/reportscommon.scss';

// Import js
import { ToolTip } from '../components/toolTip.js';
import { importAll } from '../helpers.js';
import { chartFactory } from './chartFactory.js';

const icons = importAll(require.context('../../images/report-icons', false, /\.svg$/));

export class reportFactory {
  constructor(color) {
    this.icons = icons;
    this.subreports = {};
    this.reportContainer = document.getElementById('report');
    this.chartFactory = new chartFactory(color);
  }

  // renderItemsVerticall should append to the report a list of items
  // renderComparison should render items side by side (eg. sent vs received)

  // Descr: gets the number of subreports in the report
  getNumberSubreports() {
    return Object.keys(this.subreports).length;
  }


  // Descr: fetches a subreport's graph container.
  // If subreport graph container doesn't exist it creates one. 
  // --------------------------------------
  // Input:
  //   *  name - string representing the id of the graph container (used for styling)
  //   *  subreport - the subreport the graph container belongs to
  getSubreportGraphContainer(name, subreport) {
    if (subreport.graphs) {
      return this.subreport.graphs;
    }

    let subreportGraphContainer = document.createElement('div');
    subreportGraphContainer.id = name;
    subreport.content.appendChild(subreportGraphContainer);

    subreport.graphs = subreportGraphContainer;
    subreport.graph_num = 0;

    return subreport.graphs;
  }


  // Descr: creates a graph wrapper, with heading and conclusion
  // adds it to the subreport
  // --------------------------------------
  // Input:
  //   *  subreport - subreport where graph should be added
  //   *  graphArgs - the graph arguments needed to build the graph. Check Example.
  // --------------------------------------
  // Example:
  // {
  //   type: 'axis-mixed',
  //   parent: graphCont[2],
  //   name: 'chart3',
  //   title: 'Messages by Day of the Week',
  //   labels: DAYS,
  //   data: [msgSentDaily, msgReceivedDaily, ['Sent', 'Received']],
  //   size: 'medium'
  // }
  addGraph(subreport, graphArgs) {
    subreport.graph_num += 1;
    let gContainer = document.createElement('div');
    gContainer.classList.add('graph-wrapper');
    gContainer.id = `${graphArgs.css_label}${subreport.graph_num}`;
    subreport.graphs.appendChild(gContainer);

    // add title
    if (graphArgs.title) {
      let gTitle = document.createElement('h2');
      gTitle.classList.add('graph-title');
      gTitle.innerHTML = graphArgs.title;
      gContainer.appendChild(gTitle);
    }

    // create chart
    let chartFactArgs = {
      parent: gContainer,
      name: `${graphArgs.css_label}-${subreport.graph_num}-sub`,
    }

    Object.keys(graphArgs).forEach((ga_key) => {
      chartFactArgs[ga_key] = graphArgs[ga_key];
    });

    this.chartFactory.getChart(chartFactArgs);
    // add conclusion
    // ???
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
    // one icon big list of items separated by heading
    else if (type == 'list-headings') {
      this.addListHeading(reportItems, subreport);
    }
    // big icons smaller numbers
    else if (type == 'big-icon-list') {
      this.addBigIconList(reportItems, subreport);
    }
    // display raw data
    else if (type == 'raw') {
      this.addRaw(reportItems, subreport);
    }
  }


  // Descr: adds a report item/s to a subreport that have big icons and a smal text underneath
  // --------------------------------------
  // Input:
  //   *  reportItems - array of report items. DS example below
  //   *  subreport - the DOM element that will contain the report item/items
  // --------------------------------------
  // Data Structure example of a list item:
  // {
  //   icon: 'thumbs-up',
  //   text: 'Num Likes: ',
  //   textBold: 32,
  //   tooltip: 'Text that will display in tooltip'
  // },
  addBigIconList(reportItems, subreport) {
    let reportItemContainer = document.createElement('div');
    reportItemContainer.classList.add('report-item-big-icon-list');

    // loop through report Items, create and append them to subreport
    reportItems.forEach((item) => {

      // element creation
      let itemIcon = new Image();
      let reportItem = document.createElement('div');
      let reportItemText = this.renderText(item.textBold);
      let itemToolTip = new ToolTip(item.tooltip);
      
      // appending elements
      reportItem.appendChild(itemIcon);
      reportItem.appendChild(reportItemText);
      reportItem.appendChild(itemToolTip);

      // adding content
      itemIcon.src = this.getIcon(item.icon);

      // styles
      itemIcon.classList.add('report-item-icon-big');
      itemToolTip.classList.add('tooltip-start');
      reportItemText.classList.add('report-item-text-icon-big');
      reportItem.classList.add('report-item-big-icon');
      reportItemContainer.appendChild(reportItem);
    });
    subreport.content.appendChild(reportItemContainer);
  }


  // Descr: adds a report item to a subreport
  // It is a list with headings for individual items 
  // --------------------------------------
  // Input:
  //   *  reportItem - an object in the example shown below:
  //   *  subreport - the DOM element that will contain the report item/items
  // --------------------------------------
  // Example:
  // {
  //   icon: 'shopping-bag',
  //   text: 'Ad Interests: ',
  //   type: 'list',
  //   listData: {
  //             "interactions": {
  //                "Clicked ad": [
  //                  {
  //                    "title": "Are you read?",
  //                    "date": "Sun Sep 08 2019"
  //                  },
  //                ],
  //                  "Closed ad": [
  //                    {
  //                      "title": "Epic idle RPG",
  //                      "date": "Thu Aug 08 2019"
  //                    }
  //                  ]
  //                },
  //   tooltip: 'Text that will display in tooltip'
  // }
  addListHeading(reportItem, subreport) {
    const itemIcon = new Image();
    const item = document.createElement('div');
    const itemLabel = document.createElement('p');
    const itemToolTip = new ToolTip(reportItem.tooltip);

    // adding content
    itemIcon.src = this.getIcon(reportItem.icon);
    itemLabel.innerHTML = reportItem.text;

    // add styles
    itemIcon.classList.add('report-item-icon');
    itemLabel.classList.add('report-item-label');
    item.classList.add('report-item-above');

    // appending elements
    item.appendChild(itemIcon);
    item.appendChild(itemLabel);
    item.appendChild(itemToolTip);

    // loop through lists and create all list report items
    Object.keys(reportItem.listData).forEach((item_key) => {
      // create and append subheading and ul element
      const reportListSubheading = document.createElement('h4');
      const reportHeadingList = document.createElement('div');
      reportListSubheading.innerHTML = item_key;

      // styles
      reportHeadingList.classList.add('report-list-with-headings');
      reportListSubheading.classList.add('report-list-heading');
      item.appendChild(reportListSubheading);
      item.appendChild(reportHeadingList);

      // create individual list items
      reportItem.listData[item_key].forEach((subitem) => {
        const subitemElementContainer = document.createElement('div');
        subitemElementContainer.classList.add('report-list-item');
        Object.keys(subitem).forEach((subitem_key) => {
          const subitemElement = document.createElement('div');
          const subitemLabel = document.createElement('div');
          const subitemText = document.createElement('div');

          subitemElement.classList.add('report-list-subitem');
          subitemLabel.classList.add('report-list-subitem-label');
          subitemText.classList.add('report-list-subitem-text');

          subitemLabel.innerHTML = subitem_key;
          subitemText.innerHTML = subitem[subitem_key];
          
          subitemElement.appendChild(subitemLabel);
          subitemElement.appendChild(subitemText);
          subitemElementContainer.appendChild(subitemElement);
        });
        reportHeadingList.appendChild(subitemElementContainer);
      });

      // append to subreport
      subreport.content.appendChild(item);
    });
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
      let itemIcon = new Image();
      let reportItem = document.createElement('div');
      let itemLabel = document.createElement('p');
      let itemToolTip = new ToolTip(item.tooltip);

      // create the report item text
      let itemText = null;
      if (item.link) {
        itemText = document.createElement('a');
        itemText.innerHTML = item.textBold;
        itemText.target = 'blank';
        itemText.href = item.link;
      }
      else {
        itemText = this.renderText(item.textBold); 
      }


      // appending elements
      reportItem.appendChild(itemIcon);
      reportItem.appendChild(itemLabel);
      reportItem.appendChild(itemText);
      reportItem.appendChild(itemToolTip);

      // adding content
      itemIcon.src = this.getIcon(item.icon);
      itemLabel.innerHTML = item.text;

      // styles
      itemIcon.classList.add('report-item-icon');
      itemLabel.classList.add('report-item-label');
      reportItem.classList.add('report-item-grid');

      // add to subreport
      subreport.content.appendChild(reportItem);
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
