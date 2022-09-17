export const isAlreadyPlayed = (date: Date | null | undefined) => {
  return date && date.valueOf() > 0;
};
