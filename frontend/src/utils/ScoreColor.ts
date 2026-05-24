const ScoreColor = (score: any, opacity: number = 1, b: number=0): string => {
  let r = 0,
    g = 0;

  if (score <= 50) {
    r = 200;
    g = (score / 50) * 200;
  } else if (score > 50) {
    r = ((100 - score) / 50) * 200;
    g = 200;
  } else {
    r = 127;
    g = 127;
    b = 127;
  }

  return `rgb(${r},${g},${b},${opacity})`;
};

export default ScoreColor;
