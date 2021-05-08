<template>
  <div id="app">
    <h1>Imse Editor</h1>

    <!-- text input area -->
    <textarea v-model="input" name="name" rows="8" cols="80"></textarea>
    <!-- <pre>{{ parsedInput }}</pre> -->

    <!-- controls -->
    <div>
      <input type="color" name="fgCol" v-model="fgCol">
      <label for="fgCol">Foreground Colour</label><br>
      <input type="color" name="bgCol" v-model="bgCol">
      <label for="bgCol">Background Colour</label><br>
      <input type="checkbox" id="showAnnotations" v-model="showAnnotations">
      <label for="showAnnotations">Show Annotations</label><br>
      <button @click="exportSvg">Export SVG</button><br>
    </div>

    <!-- svg rendering -->
    <svg
      ref="svgContainer"
      xmlns="http://www.w3.org/2000/svg" version="1.1"
      width="500"
      height="500"
      :style="{ backgroundColor: bgCol }"
    >
      <g transform="scale(0.5) translate(100, 200)">
        <g v-for="(line, i) in parsedInput" :transform="`translate(${i * 120}, ${i * -20})`" :key="i" >
          <g v-for="(character, j) in line" :transform="`translate(0, ${j * 80})`" :key="j">
            <!-- <rect  width="90" height="50" :fill="fgCol" /> -->
            <use :href="`#${character.split('/')[0]}`" :fill="fgCol" y="-10"></use>
            <text v-show="showAnnotations" x="20" y="35" fill="red">{{ character }}</text>
          </g>
        </g>
      </g>

      <!-- character defs -->
      <!-- need to be included here for export to work -->
      <defs>
        <path d="M10,0 L10,30 L20,30 L20,10 L50,10 L50,50 L60,50 L60,10 L90,10 L90,70 L80,70 L80,20 L70,20 L70,60 L40,60 L40,20 L30,20 L30,40 L0,40 L0,0 L10,0 Z M10,50 L10,60 L0,60 L0,50 L10,50 Z M30,50 L30,60 L20,60 L20,50 L30,50 Z" id="k:"></path>
        <path d="M0,60 L0,0 L10,0 L10,50 L20,50 L20,10 L50,10 L50,50 L60,50 L60,10 L90,10 L90,70 L80,70 L80,20 L70,20 L70,60 L40,60 L40,20 L30,20 L30,60 L0,60 Z" id="k"></path>
        <path d="M50,60 L50,70 L40,70 L40,60 L0,60 L0,30 L20,30 L20,20 L0,20 L0,0 L10,0 L10,10 L30,10 L30,40 L10,40 L10,50 L40,50 L40,10 L90,10 L90,60 L50,60 Z M80,20 L50,20 L50,50 L80,50 L80,20 Z M70,30 L70,40 L60,40 L60,30 L70,30 Z" id="b"></path>
        <path d="M10,40 L10,50 L60,50 L60,10 L90,10 L90,70 L80,70 L80,20 L70,20 L70,60 L0,60 L0,30 L40,30 L40,20 L0,20 L0,0 L10,0 L10,10 L50,10 L50,40 L10,40 Z" id="t"></path>
        <path d="M10,0 L10,10 L50,10 L50,40 L30,40 L30,50 L60,50 L60,10 L90,10 L90,70 L80,70 L80,20 L70,20 L70,60 L20,60 L20,30 L40,30 L40,20 L0,20 L0,0 L10,0 Z M10,50 L10,60 L0,60 L0,50 L10,50 Z M10,30 L10,40 L0,40 L0,30 L10,30 Z" id="t:"></path>
        <path d="M90,60 L60,60 L60,40 L50,40 L50,70 L40,70 L40,30 L70,30 L70,50 L80,50 L80,20 L30,20 L30,60 L0,60 L0,0 L10,0 L10,50 L20,50 L20,10 L90,10 L90,60 Z" id="s"></path>
        <path d="M90,60 L60,60 L60,40 L50,40 L50,70 L40,70 L40,30 L70,30 L70,50 L80,50 L80,20 L30,20 L30,40 L0,40 L0,0 L10,0 L10,30 L20,30 L20,10 L90,10 L90,60 Z M10,50 L10,60 L0,60 L0,50 L10,50 Z M30,50 L30,60 L20,60 L20,50 L30,50 Z" id="s:"></path>
        <path d="M90,70 L80,70 L80,60 L0,60 L0,30 L80,30 L80,20 L0,20 L0,0 L10,0 L10,10 L90,10 L90,40 L10,40 L10,50 L90,50 L90,70 Z" id="n"></path>
        <path d="M90,70 L80,70 L80,60 L20,60 L20,30 L80,30 L80,20 L0,20 L0,0 L10,0 L10,10 L90,10 L90,40 L30,40 L30,50 L90,50 L90,70 Z M10,30 L10,60 L0,60 L0,30 L10,30 Z" id="n:"></path>
        <path d="M90,10 L90,70 L80,70 L80,20 L30,20 L30,30 L70,30 L70,60 L0,60 L0,0 L10,0 L10,50 L60,50 L60,40 L20,40 L20,10 L90,10 Z" id="r"></path>
        <path d="M90,10 L90,40 L70,40 L70,50 L90,50 L90,70 L80,70 L80,60 L60,60 L60,30 L80,30 L80,20 L30,20 L30,30 L50,30 L50,60 L0,60 L0,0 L10,0 L10,50 L40,50 L40,40 L20,40 L20,10 L90,10 Z" id="d"></path>
        <path d="M90,40 L70,40 L70,70 L60,70 L60,30 L80,30 L80,20 L0,20 L0,0 L10,0 L10,10 L90,10 L90,40 Z M90,50 L90,60 L80,60 L80,50 L90,50 Z M50,30 L50,60 L0,60 L0,30 L50,30 Z M40,40 L10,40 L10,50 L40,50 L40,40 Z" id="e"></path>
        <path d="M90,70 L80,70 L80,40 L70,40 L70,60 L20,60 L20,40 L0,40 L0,0 L10,0 L10,30 L20,30 L20,10 L70,10 L70,30 L90,30 L90,70 Z M10,50 L10,60 L0,60 L0,50 L10,50 Z M60,40 L30,40 L30,50 L60,50 L60,40 Z M60,20 L30,20 L30,30 L60,30 L60,20 Z M90,10 L90,20 L80,20 L80,10 L90,10 Z" id="a"></path>
        <path d="M40,30 L40,10 L90,10 L90,40 L50,40 L50,50 L90,50 L90,70 L80,70 L80,60 L40,60 L40,40 L30,40 L30,60 L0,60 L0,0 L10,0 L10,50 L20,50 L20,30 L40,30 Z M80,20 L50,20 L50,30 L80,30 L80,20 Z M30,10 L30,20 L20,20 L20,10 L30,10 Z" id="m"></path>
        <path d="M70,40 L70,70 L60,70 L60,40 L50,40 L50,60 L20,60 L20,30 L40,30 L40,20 L0,20 L0,0 L10,0 L10,10 L50,10 L50,30 L60,30 L60,10 L90,10 L90,40 L70,40 Z M90,50 L90,60 L80,60 L80,50 L90,50 Z M10,30 L10,60 L0,60 L0,30 L10,30 Z M40,40 L30,40 L30,50 L40,50 L40,40 Z M80,20 L70,20 L70,30 L80,30 L80,20 Z" id="j:"></path>
        <path d="M70,40 L70,70 L60,70 L60,40 L50,40 L50,60 L0,60 L0,30 L40,30 L40,20 L0,20 L0,0 L10,0 L10,10 L50,10 L50,30 L60,30 L60,10 L90,10 L90,40 L70,40 Z M90,50 L90,60 L80,60 L80,50 L90,50 Z M40,40 L10,40 L10,50 L40,50 L40,40 Z M80,20 L70,20 L70,30 L80,30 L80,20 Z" id="j"></path>
        <path d="M50,50 L60,50 L60,10 L90,10 L90,70 L80,70 L80,20 L70,20 L70,60 L40,60 L40,40 L30,40 L30,60 L0,60 L0,30 L20,30 L20,20 L0,20 L0,0 L10,0 L10,10 L30,10 L30,30 L50,30 L50,50 Z M20,40 L10,40 L10,50 L20,50 L20,40 Z M50,10 L50,20 L40,20 L40,10 L50,10 Z" id="h"></path>
        <path d="M70,30 L90,30 L90,70 L80,70 L80,40 L70,40 L70,60 L0,60 L0,30 L60,30 L60,20 L0,20 L0,0 L10,0 L10,10 L70,10 L70,30 Z M60,40 L10,40 L10,50 L60,50 L60,40 Z M90,10 L90,20 L80,20 L80,10 L90,10 Z" id="g"></path>
        <path d="M70,60 L70,70 L60,70 L60,60 L0,60 L0,0 L10,0 L10,50 L60,50 L60,10 L90,10 L90,60 L70,60 Z M80,20 L70,20 L70,50 L80,50 L80,20 Z M50,10 L50,40 L20,40 L20,10 L50,10 Z M40,20 L30,20 L30,30 L40,30 L40,20 Z" id="i"></path>
        <path d="M50,30 L60,30 L60,10 L90,10 L90,60 L40,60 L40,40 L10,40 L10,50 L30,50 L30,70 L20,70 L20,60 L0,60 L0,30 L40,30 L40,20 L0,20 L0,0 L10,0 L10,10 L50,10 L50,30 Z M80,20 L70,20 L70,40 L50,40 L50,50 L80,50 L80,20 Z" id="v"></path>
        <path d="M90,60 L70,60 L70,70 L60,70 L60,60 L0,60 L0,30 L70,30 L70,50 L80,50 L80,20 L0,20 L0,0 L10,0 L10,10 L90,10 L90,60 Z M60,40 L10,40 L10,50 L60,50 L60,40 Z" id="l"></path>
        <path d="M0,60 L0,0 L10,0 L10,50 L40,50 L40,40 L20,40 L20,10 L50,10 L50,30 L60,30 L60,10 L90,10 L90,40 L70,40 L70,50 L90,50 L90,70 L80,70 L80,60 L60,60 L60,40 L50,40 L50,60 L0,60 Z M40,20 L30,20 L30,30 L40,30 L40,20 Z M80,20 L70,20 L70,30 L80,30 L80,20 Z" id="f"></path>
        <path d="M90,70 L80,70 L80,60 L0,60 L0,0 L10,0 L10,50 L90,50 L90,70 Z M90,10 L90,40 L20,40 L20,10 L90,10 Z M80,20 L30,20 L30,30 L80,30 L80,20 Z" id="o"></path>
      </defs>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      input: 'jemboke gonboke\nki maika t:a\nodenda adenda\nki reva t:a',
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
