export function sum(array) {
   return array.reduce((acc, item) => {
      acc += item;
      return acc;
   }, 0);
}
