import firstMultiple from './firstMultiple';

const computeIntervals = (
  start: number,
  multiple: number = 10
): { start: number; end: number }[] => {
  if (start <= 660) {
    var startingTime = 660;
  } else if (start > 945) {
    return [];
  } else {
    startingTime = firstMultiple(start, multiple);
  }

  const intervals: { start: number; end: number }[] = [];
  while (startingTime <= 945) {
    intervals.push({ start: startingTime, end: startingTime + multiple });
    startingTime += multiple;
  }

  return intervals;
};

export default computeIntervals;
