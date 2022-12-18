const capitalizeWord = (word: string): string => {
  const firstLetter = word.charAt(0);
  const substring = word.slice(1);

  return firstLetter.toUpperCase() + substring;
};

export default capitalizeWord;
