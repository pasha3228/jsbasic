function factorial(n) {
  let fac = n;
  let u = 1;
  while (fac > 1) {
    u *= fac * (fac - 1);
    fac = fac - 2;
  }
  return u;
}

console.log(factorial(81));
