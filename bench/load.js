console.time('find-up');
const findup = require('find-up');
console.timeEnd('find-up');

console.time('escalade');
const escalade = require('escalade');
console.timeEnd('escalade');

console.time('escalade/sync');
const sync = require('escalade/sync');
console.timeEnd('escalade/sync');
