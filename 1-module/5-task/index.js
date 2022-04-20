function truncate(str, maxlength) {
  let strLength = str.length;
  if (strLength > maxlength) {
   str = str.slice(0, maxlength-1) + "…";
   return str
  } else {
    return str;
  }
}

