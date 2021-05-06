<template>
  <div id="app">
    <h1>Imse Editor</h1>
    <textarea v-model="input" name="name" rows="8" cols="80"></textarea>
    <pre>{{ parsedInput }}</pre>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      input: 'jemboke gonboke\nki maika t:a',
      validCharacters: [' ', 'a', 'b', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'j:', 'k', 'k:', 'l', 'm', 'n', 'n:', 'o', 'r', 's', 's:', 't', 't:', 'v'],
    }
  },
  computed: {
    parsedInput() {
      // convert to lowercase
      let input = this.input.toLowerCase();

      // convert to only consonants and syllable-intiial vowels
      // (ie remove any vowel following a consonant)
      let regex = /(?<=[bcdfghjklmnpqrstvwxyz:])[aeiou]/gm;
      input = input.replaceAll(regex, '');

      // remove any hyphen characters
      input = input.replaceAll('-', '');

      // split into lines to return in array
      const lines = input.split('\n');

      return lines.map(line => {
        // split each line into characters
        const splitLine = line.split('');

        // check for soft characters
        splitLine.forEach((char, i) => {
          if (char === ':') {
            splitLine[i-1] += splitLine.splice(i, 1);
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
          if (!this.validCharacters.includes(char)) {
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
    },
  },
}
</script>

<style>

</style>
