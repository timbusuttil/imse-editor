<template>
  <div id="editor">
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

        <p>Effects</p>
        <select v-model="activeEffect">
          <option value="none">None</option>
          <option v-for="effect in effects" :value="effect.key" :key="effect.key">{{ effect.name }}</option>
        </select><br><br>
        <!-- <input type="checkbox" id="shadow" v-model="effects.shadow.active"> -->
        <!-- <label for="shadow">Drop shadow</label><br> -->
        <!-- <div v-show="effects.shadow.active"> -->
        <div v-show="activeEffect === 'shadow'">
          <input type="color" name="shadowCol" v-model="effects.shadow.color">
          <label for="shadowCol">Shadow Colour</label><br>
          <input type="range" min="0" max="1" name="bgCol" step="0.05" v-model="effects.shadow.opacity">
          <label for="bgCol">Shadow Opacity: {{ effects.shadow.opacity }}</label><br>
          <input type="number" name="dx" v-model="effects.shadow.dx">
          <label for="dx">X Offset</label><br>
          <input type="number" name="dy" v-model="effects.shadow.dy">
          <label for="dy">Y Offset</label><br>
          <input type="number" name="blur" min="0" v-model="effects.shadow.blur">
          <label for="blur">Blur: {{ effects.shadow.blur }}</label><br>
        </div>

        <!-- <input type="checkbox" id="erode" v-model="effects.erode.active"> -->
        <!-- <label for="erode">Erode/dilate</label><br> -->
        <!-- <div v-show="effects.erode.active"> -->
        <div v-show="activeEffect === 'erode'">
          <input type="number" name="radius" v-model="effects.erode.radius">
          <label for="radius">Radius: {{ effects.erode.radius }}</label><br>
        </div>

        <!-- <input type="checkbox" id="displacement" v-model="effects.displacement.active"> -->
        <!-- <label for="displacement">Displacement</label><br> -->
        <!-- <div v-show="effects.displacement.active"> -->
        <div v-show="activeEffect === 'displacement'">
          <input type="range" min="0.001" max="0.1" name="baseFrequency" step="0.001" v-model="effects.displacement.baseFrequency">
          <label for="baseFrequency">Base frequency: {{ effects.displacement.baseFrequency }}</label><br>
          <input type="number" name="numOctaves" min="1" v-model="effects.displacement.numOctaves">
          <label for="numOctaves">Num octaves: {{ effects.displacement.numOctaves }}</label><br>

          <input type="number" name="scale" min="1" v-model="effects.displacement.scale">
          <label for="scale">Scale: {{ effects.displacement.scale }}</label><br>
        </div>
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
        <g ref="allLines" :transform="`translate(${position.x}, ${position.y}) scale(${textScale * 0.01})`" :filter="svgFilter">
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

        <!-- filter defs -->
        <defs>
          <filter id="shadow">
            <feDropShadow :dx="effects.shadow.dx" :dy="effects.shadow.dy" :stdDeviation="effects.shadow.blur" :flood-color="effects.shadow.color" :flood-opacity="effects.shadow.opacity" />
          </filter>
          <filter id="erode">
            <feMorphology :operator="effects.erode.radius < 0 ? 'erode' : 'dilate'" :radius="effects.erode.radius < 0 ? effects.erode.radius * -1 : effects.erode.radius"/>
          </filter>
          <filter id="displacement">
            <feTurbulence type="fractalNoise" :baseFrequency="effects.displacement.baseFrequency" :numOctaves="effects.displacement.numOctaves" result="turbulence"/>
            <feDisplacementMap in2="turbulence" in="SourceGraphic" :scale="effects.displacement.scale" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
      </svg>
    </div>
  </div>
</template>

<script>
import { saveSvgAsPng } from 'save-svg-as-png';
import { parse, clean } from '@/parse';

import CharacterDefs from '@/components/CharacterDefs';

export default {
  components: {
    CharacterDefs
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
      activeEffect: 'none',
      effects: {
        shadow: {
          name: 'Drop Shadow',
          key: 'shadow',
          active: false,
          color: '#000000',
          opacity: 0.2,
          dx: 5,
          dy: 5,
          blur: 0,
        },
        erode: {
          name: 'Erode/dilate',
          key: 'erode',
          active: false,
          radius: 4,
        },
        displacement: {
          name: 'Displacement',
          key: 'displacement',
          active: false,
          baseFrequency: 0.008,
          numOctaves: 7,
          scale: 20,
        }
      },
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
    svgFilter() {
      if (this.activeEffect === 'none') {
        return '';
      } else {
        return `url(#${this.activeEffect})`;
      }
    }
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

<style lang="css">
#editor {
  display: flex;
  height: calc(100vh - 90px);
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
