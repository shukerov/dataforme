import { MS_IN_DAY } from '../constants.js';

export function sum(array) {
  return array.reduce((acc, item) => {
    acc += item;
    return acc;
  }, 0);
}

// returns the names of the top n messagers
export function getTopMessagers(threads, n) {
    var topMessagers = [];
    Object.keys(threads).forEach((p) => {
      var cnt = threads[p].msgByUser + threads[p].other;
      topMessagers.push([cnt, p]);
    });

    // sort the results
    topMessagers.sort( (a, b) => { return a[0] - b[0]; } );
    return topMessagers.slice(topMessagers.length - n).map((t) => { return t[1]; });;
}

// gets the top n from a javascript object
export function getTopObjects(objects, n) {
  let topObjects = [];
  Object.keys(objects).forEach((o) => {
    topObjects.push([objects[o], o]);
  });

  topObjects.sort( (a, b) => { return a[0] - b[0]; } );
  return topObjects.slice(topObjects.length - n);
}

export function getTopSearches(searches, n) {
  // let topSearches = [];
  // Object.keys(searches).forEach((s) => {
  //   topSearches.push([searches[s], s]);
  // });

  // topSearches.sort( (a, b) => { return a[0] - b[0]; } );
  // let result = topSearches.slice(topSearches.length - n);
  let result = getTopObjects(searches, n);
  result = result.reduce((acc, s) => { acc[s[1]] = s[0]; return acc;}, {});
  return result;
}

//TODO should those really be in analyzer helpers?
// truncates a string and returns just the last two characters
export function truncateYears(years) {
  let yearsTruncated = years.map((year) => {
    return year.slice(-2);
  });

  return yearsTruncated;
}

// gets current date
export function getCurrentDate() {
  return new Date(Date.now());
}

// gets number of days between two dates
export function getNumDays(dateStart, dateEnd) {
  return Math.round((dateEnd - dateStart) / MS_IN_DAY);
}

// in:  number of seconds since beginning of time 
// out: a formated date string.
export function formatDate(date) {
  return new Date(date).toDateString();
}

// in:  two numbers which will be divided
// out: the result of ar1/arg2
export function safeDivide(arg1, arg2) {
  return arg2 > 0 ? (arg1 / arg2) : 0;
}

// in:  a formatted percent. eg. '3%'
// out: a number between 0 and 1
export function formatPercent(ratio) {
  return `${ratio.toFixed(2) * 100}%`;
}
