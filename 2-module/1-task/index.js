function sumSalary(salaries) {
  let result = 0;

  for ( let prop in salaries) {
    if ( isFinite(salaries[prop]) ) {
     result = result + salaries[prop];
    }
  }
  return result;
}
