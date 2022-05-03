function getMinMax(str) {
  let objMinMax = {

  };

  let sortedArr = str
            .split(" ")
            .map ( item => isFinite(+item) ? +item : "" )
            .filter ( item => item != " ");

  objMinMax.min = Math.min(...sortedArr);
  objMinMax.max = Math.max(...sortedArr);
  return objMinMax;
};
