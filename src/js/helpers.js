export let isMobile = function() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}.apply(this);

export function formatNum(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
