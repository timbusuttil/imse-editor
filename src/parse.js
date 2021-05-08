const validCharacters = [' ', 'a', 'b', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'j.', 'k', 'k.', 'l', 'm', 'n', 'n.', 'o', 'r', 's', 's.', 't', 't.', 'v'];

export function parse(rawInput) {

  // convert to lowercase
  let input = rawInput.toLowerCase();

  // convert to only consonants and syllable-intiial vowels
  // (ie remove any vowel following a consonant)
  let regex = /(?<=[bcdfghjklmnpqrstvwxyz:])[aeiou]/gm;
  input = input.replaceAll(regex, '');

  // remove any punctuation characters
  input = input.replaceAll('-', '');
  input = input.replaceAll(',', '');

  // TODO: accept some character aliases
  // accept y as an alias for j:
  input = input.replaceAll('y', 'j:');
  // decide whether c & c: or k & k: is canonical, and accept one as alias for the other

  // split into lines to return in array
  const lines = input.split('\n');

  return lines.map(line => {
    // split each line into characters
    const splitLine = line.split('');

    // check for soft characters
    splitLine.forEach((char, i) => {
      if (char === ':') {
        splitLine[i-1] += '.';
        splitLine.splice(i, 1);
      }
    });

    splitLine.forEach((char, i) => {
      // set initial and terminal
      if (i === 0) {
        splitLine[i] += "/initial";
      }
      if (i === splitLine.length-1) {
        splitLine[i] += "/terminal";
      }

      // check for invalid characters
      if (!validCharacters.includes(char)) {
        splitLine[i] += " ! invalid character";
      }
    });

    // check for word boundaries and remove whitespace
    splitLine.forEach((char, i) => {
      if (char === ' ') {
        splitLine[i-1] += '/wordend';
        splitLine.splice(i, 1);
      }
    });

    // possible codes to parse
    // /initial:     add initial loop
    // /terminal:    add terminal loop & no character break line
    // no /wordend:  regular character break line
    // /wordend:     word break line instead of character break line
    return splitLine;
  });
}
