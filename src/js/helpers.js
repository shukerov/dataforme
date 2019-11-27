export let isMobile = function() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}.apply(this);

export function formatNum(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function secondsToHms(d) {
  if (d <= 0) return 0;

  d = Number(d);

  var dd = Math.floor(d / 86400);
  var h = Math.floor(d % 86400 / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);

  let res = '';
  if (dd > 0) {res += (dd + 'd ');}
  if (h > 0) {res += (h + 'h ');}
  if (m > 0) {res += (m + 'm ');}
  if (s > 0) {res += (s + 's');}

  return res;
}

export function importAll(r) {
  let images = {};
  r.keys().map((item, index) => {
    let key = item.replace('./', '');
    key = key.replace('.svg', '');
    images[key] = r(item); });
  return images;
}
