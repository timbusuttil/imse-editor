<template>
  <div id="app">
    <div id="controls-parent">
      <!-- input -->
      <textarea v-model="input" rows="8"></textarea>
      <!-- <pre>{{ parsedInput }}</pre> -->

      <!-- controls -->
      <hr>
      <div id="controls">
        <p>Colours</p>
        <input type="color" name="fgCol" v-model="fgCol">
        <label for="fgCol">Foreground Colour</label><br>
        <input type="color" name="bgCol" v-model="bgCol">
        <label for="bgCol">Background Colour</label><br>
        <button @click="swapColours">Swap colours</button><br>
        <hr>
        <p>Scaling & Positioning</p>
        <input type="number" name="canvasWidth" min="0" v-model="canvasDimensions.x">
        <label for="canvasWidth">Canvas Width</label><br>
        <input type="number" name="canvasHeight" min="0" v-model="canvasDimensions.y">
        <label for="canvasHeight">Canvas Height</label><br>
        <input type="number" name="textSize" v-model="textScale">
        <label for="textSize">Text Size</label><br>
        <input type="number" name="xPos" v-model.number="directPos.x">
        <label for="xPos">Manual X Position</label><br>
        <input type="number" name="yPos" v-model.number="directPos.y">
        <label for="yPos">Manual Y Position</label><br>
        <input type="checkbox" id="autoCenter" v-model="useAutoPos">
        <label for="autoCenter">Auto-center (y axis currently broken)</label><br>
        <p>Line offsets</p>
        <div v-for="(line, i) in parsedInput" :key="`line-input-${i}`">
          <input type="number" :id="`line-${i}`" v-model="lineOffsets[i]">
          <label :for="`line-${i}`">Line {{ i+1 }}</label>
        </div>
        <hr>
        <p>Extras</p>
        <input type="checkbox" id="showAnnotations" v-model="showAnnotations">
        <label for="showAnnotations">Show Annotations</label><br>
        <hr>
        <p>Export</p>
        <button @click="exportAsSvg">Export as SVG</button><br>
        <button @click="exportAsPng">Export as PNG</button><br>
      </div>
    </div>

    <!-- svg rendering -->
    <svg
      ref="svgContainer"
      xmlns="http://www.w3.org/2000/svg" version="1.1"
      :width="canvasDimensions.x"
      :height="canvasDimensions.y"
      :style="{ backgroundColor: bgCol }"
    >
      <g ref="allLines" :transform="`translate(${position.x}, ${position.y}) scale(${textScale * 0.01})`">
        <g v-for="(line, i) in parsedInput" :id="`line-group-${i}`" :transform="`translate(${i * 120}, ${i * -20 + lineOffsets[i] * 80})`" :key="i" >
          <g v-for="(character, j) in line" :transform="`translate(0, ${j * 80})`" :key="j">
            <use :href="`#${character.split('/')[0]}`" :fill="fgCol"></use>
            <use v-if="character.includes('initial')" href="#initial" :fill="fgCol"></use>
            <use v-if="character.includes('terminal')" href="#terminal" :fill="fgCol"></use>
            <use v-if="character.includes('wordend')" href="#wordbreak" :fill="fgCol"></use>
            <use v-if="!character.includes('wordend') && !character.includes('terminal')" href="#characterbreak" :fill="fgCol"></use>
            <text v-show="showAnnotations" x="20" y="35" fill="red">{{ character }}</text>
          </g>
        </g>
      </g>

      <!-- character defs -->
      <!-- need to be included here for export to work -->
      <defs>
        <path d="M30,30 L30,60 L40,60 L40,40 L70,40 L70,80 L80,80 L80,40 L110,40 L110,100 L100,100 L100,50 L90,50 L90,90 L60,90 L60,50 L50,50 L50,70 L20,70 L20,30 L30,30 Z M30,80 L30,90 L20,90 L20,80 L30,80 Z M50,80 L50,90 L40,90 L40,80 L50,80 Z" id="k:"></path>
        <path d="M20,90 L20,30 L30,30 L30,80 L40,80 L40,40 L70,40 L70,80 L80,80 L80,40 L110,40 L110,100 L100,100 L100,50 L90,50 L90,90 L60,90 L60,50 L50,50 L50,90 L20,90 Z" id="k"></path>
        <path d="M70,90 L70,100 L60,100 L60,90 L20,90 L20,60 L40,60 L40,50 L20,50 L20,30 L30,30 L30,40 L50,40 L50,70 L30,70 L30,80 L60,80 L60,40 L110,40 L110,90 L70,90 Z M100,50 L70,50 L70,80 L100,80 L100,50 Z M90,60 L90,70 L80,70 L80,60 L90,60 Z" id="b"></path>
        <path d="M30,70 L30,80 L80,80 L80,40 L110,40 L110,100 L100,100 L100,50 L90,50 L90,90 L20,90 L20,60 L60,60 L60,50 L20,50 L20,30 L30,30 L30,40 L70,40 L70,70 L30,70 Z" id="t"></path>
        <path d="M30,30 L30,40 L70,40 L70,70 L50,70 L50,80 L80,80 L80,40 L110,40 L110,100 L100,100 L100,50 L90,50 L90,90 L40,90 L40,60 L60,60 L60,50 L20,50 L20,30 L30,30 Z M30,80 L30,90 L20,90 L20,80 L30,80 Z M30,60 L30,70 L20,70 L20,60 L30,60 Z" id="t:"></path>
        <path d="M110,90 L80,90 L80,70 L70,70 L70,100 L60,100 L60,60 L90,60 L90,80 L100,80 L100,50 L50,50 L50,90 L20,90 L20,30 L30,30 L30,80 L40,80 L40,40 L110,40 L110,90 Z" id="s"></path>
        <path d="M110,90 L80,90 L80,70 L70,70 L70,100 L60,100 L60,60 L90,60 L90,80 L100,80 L100,50 L50,50 L50,70 L20,70 L20,30 L30,30 L30,60 L40,60 L40,40 L110,40 L110,90 Z M30,80 L30,90 L20,90 L20,80 L30,80 Z M50,80 L50,90 L40,90 L40,80 L50,80 Z" id="s:"></path>
        <path d="M110,100 L100,100 L100,90 L20,90 L20,60 L100,60 L100,50 L20,50 L20,30 L30,30 L30,40 L110,40 L110,70 L30,70 L30,80 L110,80 L110,100 Z" id="n"></path>
        <path d="M110,100 L100,100 L100,90 L40,90 L40,60 L100,60 L100,50 L20,50 L20,30 L30,30 L30,40 L110,40 L110,70 L50,70 L50,80 L110,80 L110,100 Z M30,60 L30,90 L20,90 L20,60 L30,60 Z" id="n:"></path>
        <path d="M110,40 L110,100 L100,100 L100,50 L50,50 L50,60 L90,60 L90,90 L20,90 L20,30 L30,30 L30,80 L80,80 L80,70 L40,70 L40,40 L110,40 Z" id="r"></path>
        <path d="M110,40 L110,70 L90,70 L90,80 L110,80 L110,100 L100,100 L100,90 L80,90 L80,60 L100,60 L100,50 L50,50 L50,60 L70,60 L70,90 L20,90 L20,30 L30,30 L30,80 L60,80 L60,70 L40,70 L40,40 L110,40 Z" id="d"></path>
        <path d="M110,70 L90,70 L90,100 L80,100 L80,60 L100,60 L100,50 L20,50 L20,30 L30,30 L30,40 L110,40 L110,70 Z M110,80 L110,90 L100,90 L100,80 L110,80 Z M70,60 L70,90 L20,90 L20,60 L70,60 Z M60,70 L30,70 L30,80 L60,80 L60,70 Z" id="e"></path>
        <path d="M110,100 L100,100 L100,70 L90,70 L90,90 L40,90 L40,70 L20,70 L20,30 L30,30 L30,60 L40,60 L40,40 L90,40 L90,60 L110,60 L110,100 Z M30,80 L30,90 L20,90 L20,80 L30,80 Z M80,70 L50,70 L50,80 L80,80 L80,70 Z M80,50 L50,50 L50,60 L80,60 L80,50 Z M110,40 L110,50 L100,50 L100,40 L110,40 Z" id="a"></path>
        <path d="M60,60 L60,40 L110,40 L110,70 L70,70 L70,80 L110,80 L110,100 L100,100 L100,90 L60,90 L60,70 L50,70 L50,90 L20,90 L20,30 L30,30 L30,80 L40,80 L40,60 L60,60 Z M100,50 L70,50 L70,60 L100,60 L100,50 Z M50,40 L50,50 L40,50 L40,40 L50,40 Z" id="m"></path>
        <path d="M90,70 L90,100 L80,100 L80,70 L70,70 L70,90 L40,90 L40,60 L60,60 L60,50 L20,50 L20,30 L30,30 L30,40 L70,40 L70,60 L80,60 L80,40 L110,40 L110,70 L90,70 Z M110,80 L110,90 L100,90 L100,80 L110,80 Z M30,60 L30,90 L20,90 L20,60 L30,60 Z M60,70 L50,70 L50,80 L60,80 L60,70 Z M100,50 L90,50 L90,60 L100,60 L100,50 Z" id="j:"></path>
        <path d="M90,70 L90,100 L80,100 L80,70 L70,70 L70,90 L20,90 L20,60 L60,60 L60,50 L20,50 L20,30 L30,30 L30,40 L70,40 L70,60 L80,60 L80,40 L110,40 L110,70 L90,70 Z M110,80 L110,90 L100,90 L100,80 L110,80 Z M60,70 L30,70 L30,80 L60,80 L60,70 Z M100,50 L90,50 L90,60 L100,60 L100,50 Z" id="j"></path>
        <path d="M70,80 L80,80 L80,40 L110,40 L110,100 L100,100 L100,50 L90,50 L90,90 L60,90 L60,70 L50,70 L50,90 L20,90 L20,60 L40,60 L40,50 L20,50 L20,30 L30,30 L30,40 L50,40 L50,60 L70,60 L70,80 Z M40,70 L30,70 L30,80 L40,80 L40,70 Z M70,40 L70,50 L60,50 L60,40 L70,40 Z" id="h"></path>
        <path d="M90,60 L110,60 L110,100 L100,100 L100,70 L90,70 L90,90 L20,90 L20,60 L80,60 L80,50 L20,50 L20,30 L30,30 L30,40 L90,40 L90,60 Z M80,70 L30,70 L30,80 L80,80 L80,70 Z M110,40 L110,50 L100,50 L100,40 L110,40 Z" id="g"></path>
        <path d="M90,90 L90,100 L80,100 L80,90 L20,90 L20,30 L30,30 L30,80 L80,80 L80,40 L110,40 L110,90 L90,90 Z M100,50 L90,50 L90,80 L100,80 L100,50 Z M70,40 L70,70 L40,70 L40,40 L70,40 Z M60,50 L50,50 L50,60 L60,60 L60,50 Z" id="i"></path>
        <path d="M70,60 L80,60 L80,40 L110,40 L110,90 L60,90 L60,70 L30,70 L30,80 L50,80 L50,100 L40,100 L40,90 L20,90 L20,60 L60,60 L60,50 L20,50 L20,30 L30,30 L30,40 L70,40 L70,60 Z M100,50 L90,50 L90,70 L70,70 L70,80 L100,80 L100,50 Z" id="v"></path>
        <path d="M110,90 L90,90 L90,100 L80,100 L80,90 L20,90 L20,60 L90,60 L90,80 L100,80 L100,50 L20,50 L20,30 L30,30 L30,40 L110,40 L110,90 Z M80,70 L30,70 L30,80 L80,80 L80,70 Z" id="l"></path>
        <path d="M20,90 L20,30 L30,30 L30,80 L60,80 L60,70 L40,70 L40,40 L70,40 L70,60 L80,60 L80,40 L110,40 L110,70 L90,70 L90,80 L110,80 L110,100 L100,100 L100,90 L80,90 L80,70 L70,70 L70,90 L20,90 Z M60,50 L50,50 L50,60 L60,60 L60,50 Z M100,50 L90,50 L90,60 L100,60 L100,50 Z" id="f"></path>
        <path d="M110,100 L100,100 L100,90 L20,90 L20,30 L30,30 L30,80 L110,80 L110,100 Z M110,40 L110,70 L40,70 L40,40 L110,40 Z M100,50 L50,50 L50,60 L100,60 L100,50 Z" id="o"></path>
        <path d="M20,30 L20,0 L50,0 L50,30 L20,30 Z M40,10 L30,10 L30,20 L40,20 L40,10 Z" id="initial"></path>
        <path d="M80,130 L80,100 L110,100 L110,130 L80,130 Z M100,110 L90,110 L90,120 L100,120 L100,110 Z" id="terminal"></path>
        <rect id="characterbreak" x="10" y="100" width="110" height="10"></rect>
        <path d="M130,100 L130,120 L120,120 L120,110 L0,110 L0,90 L10,90 L10,100 L130,100 Z" id="wordbreak"></path>
      </defs>
    </svg>
  </div>
</template>

<script>
import { saveSvgAsPng } from 'save-svg-as-png';

export default {
  name: 'App',
  data() {
    return {
      input: 'jemboke gonboke\nki maika t:a\nodenda adenda\nki reva t:a',
      validCharacters: [' ', 'a', 'b', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'j:', 'k', 'k:', 'l', 'm', 'n', 'n:', 'o', 'r', 's', 's:', 't', 't:', 'v'],
      fgCol: '#EFECCA',
      bgCol: '#A9CBB7',
      lineOffsets: [0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      showAnnotations: false,
      textScale: 50,
      canvasDimensions: { x: 700, y: 500 },
      directPos: { x: 227.5, y: 97.5 },
      useAutoPos: false,
    }
  },
  computed: {
    autoPos() {
      // console.log('canvas dims');
      // console.log(this.canvasDimensions.x, this.canvasDimensions.y);
      // console.log('bounding box dims');
      // console.log(this.$refs.allLines.getBoundingClientRect().width, this.$refs.allLines.getBoundingClientRect().height);
      // console.log('y offset');
      // console.log(this.posOffsetY);
      // console.log('result');
      // console.log({
      //   x: this.canvasDimensions.x / 2 - this.$refs.allLines.getBoundingClientRect().width / 2,
      //   y: this.canvasDimensions.y / 2 - this.$refs.allLines.getBoundingClientRect().height / 2,
      // });

      // the below works, except need to adjust for diff between top of first line and top of highest line
      const firstLineY = document.getElementById('line-group-0').getBoundingClientRect().y;
      let highestLineY = 99999;
      this.parsedInput.forEach((line, i) => {
        let lineY = document.getElementById(`line-group-${i}`).getBoundingClientRect().y;
        if (lineY < highestLineY) highestLineY = lineY;
      });

      console.log('hly', highestLineY);
      console.log('fly', firstLineY);

      const diff = highestLineY - firstLineY;

      console.log('diff', diff);

      console.log({
        x: this.canvasDimensions.x / 2 - this.$refs.allLines.getBoundingClientRect().width / 2,
        y: this.canvasDimensions.y / 2 - this.$refs.allLines.getBoundingClientRect().height / 2 - diff / 2,
      });

      return {
        x: this.canvasDimensions.x / 2 - this.$refs.allLines.getBoundingClientRect().width / 2,
        y: this.canvasDimensions.y / 2 - this.$refs.allLines.getBoundingClientRect().height / 2 - diff / 2,
      }
    },
    position() {
      if (this.useAutoPos) {
        return this.autoPos;
      } else {
        return this.directPos;
        // return {
        //   x: this.directPos.x,
        //   y: this.directPos.y + -this.posOffsetY
        // };
      }
    },
    posOffsetY() {
      let result = 9999999;
      this.parsedInput.forEach((line, i) => {
        const yOffset = i * -20 + this.lineOffsets[i] * 80;
        if (yOffset < result) result = yOffset;
      });
      return result;
    },
    parsedInput() {
      // convert to lowercase
      let input = this.input.toLowerCase();

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
    exportAsPng() {
      saveSvgAsPng(this.$refs.svgContainer, "imse export.png");
    },
    exportAsSvg() {
      const svgData = this.$refs.svgContainer.outerHTML;
      const svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = "imse export.svg";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    },
    swapColours() {
      const temp = this.fgCol;
      this.fgCol = this.bgCol;
      this.bgCol = temp;
    },
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

html {
  background: #fce4ec;
}

#app {
  display: flex;
  height: 100vh;
  padding: 20px;
  overflow-y: hidden;
}

#controls-parent {
  width: 350px;
  padding-right: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

#controls {
  flex-grow: 1;
  overflow-y: scroll;
}

textarea {
  width: 100%;
}
</style>
