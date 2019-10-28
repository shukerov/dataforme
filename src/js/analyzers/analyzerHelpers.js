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

export function getTopSearches(searches, n) {
  let topSearches = [];
  Object.keys(searches).forEach((s) => {
    topSearches.push([searches[s], s]);
  });

  topSearches.sort( (a, b) => { return a[0] - b[0]; } );
  return topSearches.slice(topSearches.length - n);
}

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

// out: a formated date string.
// in:  number of seconds since beginning of time 
export function formatDate(date) {
  return new Date(date).toDateString();
}
