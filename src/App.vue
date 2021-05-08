<template>
  <div id="app">
    <h1>Imse Editor</h1>
    <textarea v-model="input" name="name" rows="8" cols="80"></textarea>
    <pre>{{ parsedInput }}</pre>
    <input type="color" name="fgCol" v-model="fgCol">
    <label for="fgCol">Foreground Colour</label><br>
    <input type="color" name="bgCol" v-model="bgCol">
    <label for="bgCol">Background Colour</label><br>
    <input type="checkbox" id="showAnnotations" v-model="showAnnotations">
    <label for="showAnnotations">Show Annotations</label><br>
    <button @click="exportSvg">Export SVG</button><br>
    <svg
      ref="svgContainer"
      xmlns="http://www.w3.org/2000/svg" version="1.1"
      width="500"
      height="500"
      :style="{ backgroundColor: bgCol }"
    >
      <g v-for="(line, i) in parsedInput" :transform="`translate(${i * 100}, 0)`" :key="i" >
        <g v-for="(character, j) in line" :transform="`translate(0, ${j * 60})`" :key="j">
          <rect  width="90" height="50" :fill="fgCol" />
          <text v-show="showAnnotations" x="20" y="35" fill="red">{{ character }}</text>
        </g>
      </g>
      <image href="@/assets/characters/original/k.svg" />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      input: 'jemboke gonboke\nki maika t:a',
      validCharacters: [' ', 'a', 'b', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'j:', 'k', 'k:', 'l', 'm', 'n', 'n:', 'o', 'r', 's', 's:', 't', 't:', 'v'],
      fgCol: '#000000',
      bgCol: '#ffffff',
      showAnnotations: true,
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
  methods: {
    exportSvg() {
      const svgData = this.$refs.svgContainer.outerHTML;
      const svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = "imse export.svg";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  }
}
</script>

<style>
html {
  background: #fce4ec;
}
</style>
