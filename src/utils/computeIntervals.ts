import firstMultiple from "./firstMultiple";

const computeIntervals = (start: number): { start: number; end: number }[] => {
  if (start <= 660) {
    var startingTime = 660;
  } else if (start > 945) {
    return [];
  } else {
    startingTime = firstMultiple(start, 15);
  }

  const intervals: { start: number; end: number }[] = [];
  while (startingTime <= 945) {
    intervals.push({ start: startingTime, end: startingTime + 15 });
    startingTime += 15;
  }

  return intervals;
};

export default computeIntervals;
