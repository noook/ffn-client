import { Identity } from "./types";

export function parseName(str: string): Identity {
  const [lastname, firstname] = str.split(' ').reduce(((acc, word) => {
    if (word.toUpperCase() === word) {
      acc[0] = `${acc[0]} ${word}`.trim().replace(/\*/g, '');
    } else {
      acc[1] = `${acc[1]} ${word}`.trim().replace(/\*/g, '');
    }
    return acc;
  }), ['', '']);

  return { firstname, lastname };
};
