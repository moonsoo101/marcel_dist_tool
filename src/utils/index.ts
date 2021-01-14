export function getGCD(a, b) {
    const minNum = Math.min(a, b);
    const maxNum = Math.max(a, b);
    return gcd(minNum, maxNum);
}
// 최대공약수
function gcd(minNum, maxNum){
  return (minNum % maxNum) === 0 ? maxNum : gcd(maxNum, minNum % maxNum);
}
