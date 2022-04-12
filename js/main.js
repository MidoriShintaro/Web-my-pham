/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function (digits) {
  const temp = digits.join("");
  let s = BigInt(temp) + 1n;
  const result = s.toString().split('')
  return result.map(Number);

};

console.log(plusOne([5,2,2,6,5,7,1,9,0,3,8,6,8,6,5,2,1,8,7,9,8,3,8,4,7,2,5,8,9]))