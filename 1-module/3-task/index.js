function ucFirst(str) {
  if ( str != null && str != "") {
    let firstLetter = str[0];
    let secondLetters = str.slice(1);
    firstLetter = firstLetter.toUpperCase();
    str = firstLetter + secondLetters;
    return str;
  } else {
    return str;
  }
}

