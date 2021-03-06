// JS imports:
import { consoleMessage } from '../../js/helpers.js'
import { formatDate, formatPercent, safeDivide } from '../../js/analysis/analyzerHelpers.js';
import { NavBar } from '../../js/components/navBar.js';
import { FilePicker } from '../../js/components/filePicker.js';
import { reportFactory } from '../../js/factories/reportFactory.js';
import { insFactory } from '../../js/factories/insFactory.js';
import { TinderAnalyzer } from './tinderAnalyzer.js';

// CSS imports:
import './tinder.scss';
import website_icon from '../../assets/images/logos/tinder_inline.svg';

// print a console log friendly message
consoleMessage();

let instructions = new insFactory('tinder', document.getElementById('instructions-container'));
let rRender = new reportFactory('tinder');
let nBar = new NavBar();
let fPicker = new FilePicker(document.getElementById('filepicker'));
let analyzer = new TinderAnalyzer(renderReport);

let websiteIcon = document.getElementById('website-icon');
websiteIcon.innerHTML = website_icon;

let previewBtn = document.getElementById('preview-btn');
previewBtn.onclick = () => {
  renderReport(true);
};

kickStartReport();

function kickStartReport() {
  if (!DEBUG_MODE) {
    fPicker.onUpload((file) => { analyzer.init(file) });
  }
  else {
    renderReport(true);
  }
}

function renderReport(fakeData) {
  // make sure report container is empty
  rRender.emptyReportElement();

  const data = analyzer.getData(fakeData);
  renderUserReport(data);
  renderMatchReport(data);
  renderUsageReport(data);
  renderMessageReport(data);

  // scrolls down to the report
  rRender.reportContainer.scrollIntoView();

  // set report container to full
  rRender.setReportElementFull();
}

function renderUserReport(data) {
  let reportItems = [
    {
      icon: 'calendar',
      text: 'Date Joined: ',
      textBold: formatDate(data.date_joined),
      tooltip: 'The date that you created a Tinder account'
    },
    {
      icon: 'map-pin',
      text: 'Location: ',
      textBold: 'here',
      link: `https://www.google.com/maps/search/?api=1&query=${data.pos.lat},${data.pos.lon}`,
      tooltip: `Your location on ${data.pos.at}. NOTE: you need internet connection to view this link.`
    },
    {
      icon: 'image',
      text: 'Number of Pictures: ',
      textBold: data.photo_count,
      tooltip: 'The number of pictures you have on Tinder.'
    },
    {
      icon: 'mail',
      text: 'Email: ',
      textBold: data.email,
      tooltip: 'Your email address.'
    },
    {
      icon: 'phone-call',
      text: 'Phone: ',
      textBold: data.phone,
      tooltip: 'Your phone number.'
    },
    {
      icon: 'book',
      text: 'Education: ',
      textBold: data.education,
      tooltip: 'The education Tinder thinks you have.'
    },
    {
      icon: 'cake',
      text: 'Birthday: ',
      textBold: formatDate(data.birthday),
      tooltip: 'Your birthday.'
    },
  ];

  const subreport = rRender.getSubreport(data.name);
  rRender.add(reportItems, 'icon-list', subreport);
}

function renderMatchReport(data) {
  const swipeData = [
    {
      icon: 'thumbs-up',
      text: 'Number of Likes: ',
      textBold: data.num_likes,
      tooltip: 'The number of likes(right swipes) you have on Tinder.'
    },
    {
      icon: 'thumbs-down',
      text: 'Number of Passes: ',
      textBold: data.num_passes,
      tooltip: 'The number of passes(left swipes) you have on Tinder.'
    },
    {
      icon: 'heart',
      text: 'Number of Matches: ',
      textBold: data.num_matches,
      tooltip: 'The number of matches you have on Tinder.'
    }
  ];

  const reportItems = [
    {
      icon: 'maximize-2',
      text: 'Age Range: ',
      textBold: `${data.age_min} - ${data.age_max} years old`,
      tooltip: 'The age range you have selected on Tinder.'
    },
    {
      icon: 'thumbs-up',
      text: 'Chance to like: ',
      textBold: formatPercent(safeDivide(data.num_likes, (data.num_likes + data.num_passes))),
      tooltip: 'Your chance to swipe right on someone based on your swipe history.'
    },
    {
      icon: 'thumbs-down',
      text: 'Chance to pass: ',
      textBold: formatPercent(safeDivide(data.num_passes, (data.num_likes + data.num_passes))),
      tooltip: 'Your chance to swipe left on someone based on your swipe history.'
    },
    {
      icon: 'heart',
      text: 'Chance to match: ',
      textBold: formatPercent(safeDivide(data.num_matches, data.num_likes)),
      tooltip: 'Your chance to match with someone when you swipe right based on your swipe history.'
    },
  ];
  
  const subreport = rRender.getSubreport('Match Report');
  rRender.add(swipeData, 'big-icon-list', subreport);
  rRender.add(reportItems, 'icon-list', subreport);

  // render graphs
  rRender.getSubreportGraphContainer('graphs-container-matches', subreport);

  // some pie graphs
  rRender.addGraph(subreport, {
    type: 'pie',
    data: [data.num_matches, data.num_likes - data.num_matches],
    labels: ['Matches', 'Likes'],
    title: `Matches versus Likes`,
    css_label: 'matches-graph',
    size: 'medium'
  });

  rRender.addGraph(subreport, {
    type: 'pie',
    data: [data.num_likes, data.num_passes],
    labels: ['Likes', 'Passes'],
    title: `Likes versus Passes`,
    css_label: 'matches-graph',
    size: 'medium'
  });

  // usage graphs by year chart
  Object.keys(data.matches_by_date).forEach((year) => {

    // calculate the year
    data.matches_by_date[year].start = new Date(year, 0, 1)
    data.matches_by_date[year].end = new Date(year, 11, 31)

    rRender.addGraph(subreport, {
      type: 'heatmap',
      data: data.matches_by_date[year],
      title: `Tinder Matches ${year}`,
      css_label: 'matches-graph',
      size: 'huge'
    });
  });
}

function renderUsageReport(data) {
  const reportItems = [
    {
      icon: 'activity',
      text: 'Number of app opens: ',
      textBold: data.app_opens,
      tooltip: 'The total number of times you have opened the app.'
    }
  ];

  const subreport = rRender.getSubreport('Usage Report');
  rRender.add(reportItems, 'icon-list', subreport);

  // render graphs
  rRender.getSubreportGraphContainer('graphs-container-usage', subreport);

  // usage graphs by year chart
  Object.keys(data.app_opens_by_date).forEach((year) => {

    // calculate the year
    data.app_opens_by_date[year].start = new Date(year, 0, 1)
    data.app_opens_by_date[year].end = new Date(year, 11, 31)

    rRender.addGraph(subreport, {
      type: 'heatmap',
      data: data.app_opens_by_date[year],
      title: `Tinder Usage ${year}`,
      css_label: 'usage-graph',
      size: 'huge'
    });
  });
}

function renderMessageReport(data) {
  const messageStats = [ 
    {
      icon: 'target',
      text: 'Number of Matches Messaged: ',
      textBold: `${data.total_matches_messaged} of ${data.num_matches} total`,
      tooltip: 'How many of your matches you actually messaged.'
    },
    {
      icon: 'send',
      text: 'Number of Messages Sent: ',
      textBold: data.num_messages_sent,
      tooltip: 'The number of messages you have sent on Tinder.'
    },
    {
      icon: 'message-square',
      text: 'Number of Messages Sent per Match: ',
      textBold: safeDivide(data.num_messages_sent, data.total_matches_messaged).toFixed(2),
      tooltip: 'How many messages you sent on average to a person you match with.'
    },
    {
      icon: 'inbox',
      text: 'Number of Messages Received: ',
      textBold: data.num_messages_received,
      tooltip: 'The number of messages you have received on Tinder.'
    },
    {
      icon: 'message-square',
      text: 'Number of Messages Received per Match: ',
      textBold: safeDivide(data.num_messages_received, data.total_matches_messaged).toFixed(2),
      tooltip: 'How many messages you receive on average by a person you match with.'
    }
  ];

  const messages = {
      icon: 'message-circle',
      text: 'Messages: ',
      listData: data.messages,
      tooltip: 'For each match - your first message and when you sent it, total number of messages. Note that Tinder doesn\'t include the name of matches for privacy reasons.'
  };

  const subreport = rRender.getSubreport('Message Report');
  rRender.add(messageStats, 'icon-list', subreport);
  rRender.add(messages, 'list-headings', subreport);
}
