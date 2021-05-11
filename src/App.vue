<template>
  <div id="app">
    <div id="controls-parent">
      <!-- input -->
      <textarea v-model="input" rows="8"></textarea>
      <button @click="showParsed = !showParsed">{{ showParsed ? 'Hide' : 'Show' }} parsed</button>
      <pre v-show="showParsed">{{ cleanedInput }}</pre>
      <pre v-show="showParsed">{{ parsedInput }}</pre>

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
        <p>Font</p>
        <select v-model="selectedFont">
          <option v-for="font in fonts" :value="font" :key="font.key">{{ font.displayName }}</option>
        </select>
        <p>Designed by {{ selectedFont.designedBy }}</p>
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
        <hr>
        <p><a href="https://www.notion.so/Imse-ta-Vira-ka-Os-o-d3b2cc8a0fa2474f9af19e4fb1da05eb" target="_blank">Imse ta Vira ka Os-o</a> designed by <a href="https://twitter.com/timbusuttil" target="_blank">Tim Busuttil</a></p>
      </div>
    </div>

    <div class="">
      <!-- svg rendering -->
      <svg
        ref="svgContainer"
        xmlns="http://www.w3.org/2000/svg" version="1.1"
        :width="canvasDimensions.x"
        :height="canvasDimensions.y"
        :style="{ backgroundColor: bgCol, minWidth: `${canvasDimensions.x}px` }"
      >
        <g ref="allLines" :transform="`translate(${position.x}, ${position.y}) scale(${textScale * 0.01})`">
          <g v-for="(line, i) in parsedInput" :id="`line-group-${i}`" :transform="`translate(${i * 120}, ${i * -20 + lineOffsets[i] * 80})`" :key="i" >
            <g v-for="(character, j) in line" :transform="`translate(0, ${j * 80})`" :key="j">
              <use :href="`#${character.split('/')[0]}`" :fill="fgCol"></use>
              <use v-if="character.includes('initial')" href="#initial" :fill="fgCol"></use>
              <use v-if="character.includes('terminal')" :href="specialChar('terminal', character)" :fill="fgCol"></use>
              <use v-if="character.includes('wordend')" :href="specialChar('wordbreak', character)" :fill="fgCol"></use>
              <use v-if="!character.includes('wordend') && !character.includes('terminal')" :href="specialChar('charbreak', character)" :fill="fgCol"></use>
              <text v-show="showAnnotations" x="20" y="35" fill="red">{{ character }}</text>
            </g>
          </g>
        </g>

        <!-- character defs -->
        <CharacterDefs :font="selectedFont.key" ref="charDefs" />
      </svg>
      <br>
      <br>
      <Dictionary />
    </div>
  </div>
</template>

<script>
import { saveSvgAsPng } from 'save-svg-as-png';
import { parse, clean } from '@/parse';

import CharacterDefs from '@/components/CharacterDefs';
import Dictionary from '@/components/Dictionary';

export default {
  name: 'App',
  components: {
    CharacterDefs,
    Dictionary,
  },
  data() {
    return {
      input: 'jemboke gonboke\nki maika t:a\nodenda adenda\nki reva t:a',
      fgCol: '#2C4251',
      bgCol: '#C1C1C1',
      // fgCol: '#F18F01',
      // bgCol: '#006E90',
      // fgCol: '#FABC3C',
      // bgCol: '#444054',
      // fgCol: '#EFECCA',
      // bgCol: '#A9CBB7',
      lineOffsets: [0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      showAnnotations: false,
      textScale: 50,
      canvasDimensions: { x: 500, y: 500 },
      directPos: { x: 127.5, y: 87.5 },
      useAutoPos: false,
      forceRecalc: 0,
      showParsed: false,
      selectedFont: 'original',
      fonts: [],
    }
  },
  computed: {
    autoPos() {
      this.forceRecalc;
      console.log('calc autopos');

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
        y: this.canvasDimensions.y / 2 - this.$refs.allLines.getBoundingClientRect().height / 2 - diff,
      });

      return {
        x: this.canvasDimensions.x / 2 - this.$refs.allLines.getBoundingClientRect().width / 2,
        y: this.canvasDimensions.y / 2 - this.$refs.allLines.getBoundingClientRect().height / 2 - diff,
      }
      // return {
      //   x: this.canvasDimensions.x / 2 - this.$refs.allLines.getBoundingClientRect().width / 2,
      //   y: -diff + (this.canvasDimensions.y + this.$refs.allLines.getBoundingClientRect().height) / 2,
      // }
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
    cleanedInput() {
      return clean(this.input);
    },
    parsedInput() {
      return parse(clean(this.input));
    },
  },
  methods: {
    specialChar(type, character) {
      let terminalPosition = 4;
      if (['e', 'i', 'j', 'j.', 'l'].includes(character.split('/')[0])) terminalPosition = 3;
      if (['b', 's', 's.'].includes(character.split('/')[0])) terminalPosition = 2;
      if (['v'].includes(character.split('/')[0])) terminalPosition = 1;
      return `#${type}${terminalPosition}`
    },
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
  },
  watch: {
    lineOffsets() {
      this.forceRecalc++;
    },
    input() {
      this.forceRecalc++;
    }
  },
  mounted() {
    this.fonts = this.$refs.charDefs.fonts;
    this.selectedFont = this.fonts.find(font => font.key === 'original');
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
}

#controls-parent {
  min-width: 350px;
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
  min-height: 120px;
}
</style>
