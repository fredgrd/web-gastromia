const firstMultiple = (minimum: number, base: number): number => {
  let multiple: number | undefined;
  while (!multiple) {
    if (minimum % base === 0) {
      multiple = minimum;
      break;
    }

    minimum += 1;
  }

  return multiple;
};

export default firstMultiple;
