import { customAlphabet } from "nanoid/async";

const numbers = "0123456789";
const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const thaiAlphabets = "กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ";

const numbersGenerator = customAlphabet(numbers, 1);
const alphabetsGenerator = customAlphabet(numbers + alphabets, 21);

/**
 * Returns a randomly generated ID that similar to Spotify Track IDs.
 *
 * Example of track ID: 00hpozFur43iV7X6nJXWmO (22)
 * Consists of 1 digit numbers and 21 randomly generated alphabets.
 */
export const trackId = async () => {
  return (await numbersGenerator()) + (await alphabetsGenerator());
};

export const trackName = async () => {
  const language = Math.random() > 0.5 ? thaiAlphabets : alphabets;
  return await customAlphabet(language, 21)();
};
