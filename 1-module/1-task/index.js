function factorial(n) {
  let result = 1;
  if (n == 0 || n == 1) {
    return result;
  } else if (n > 0 && (n % 1 == 0)) {
    for (let i = 0; i < n; i++) {
      result = result * (n - i);
    }
    return result;
  } else {
    alert("Введите натуральное число")
  }
}
