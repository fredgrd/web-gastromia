const formatMinuteTime = (time: number): string => {
  const remainder = time % 60;
  console.log(remainder);
  return `${Math.floor(time / 60)}:${remainder === 0 ? "00" : remainder}`;
};

export default formatMinuteTime;
