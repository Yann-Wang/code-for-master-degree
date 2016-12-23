const md5Hex = require('md5-hex');

//let input = "xxxxxx";
let input = process.argv[2];

let result = md5Hex(input);

console.log(typeof input);
console.log(result);

//argv[2] : gospray

//string
//e7ae982534f178c5e609fbea8ea7bb56