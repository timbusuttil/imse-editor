<template lang="html">
  <div>
    <label>Search (Imse and English)</label><br>
    <input v-model="query"><br><br>
    <label>Filter by tags</label><br>
    <div style="columns: 5;">
      <div v-for="tag in allTags" :key="tag" >
        <input type="checkbox" :id="`tag-${tag}`" v-model="tags[tag]">
        <label :for="`tag-${tag}`">{{ tag }}</label><br>
      </div>
    </div>
    <br>
    <label>{{ filteredVocabulary.length }} {{ filteredVocabulary.length === 1 ? 'result' : 'results' }}</label>
    <div class="word-container">
      <!-- <pre>{{ filteredVocabulary }}</pre> -->
      <div v-for="word in filteredVocabulary" class="dictionary-entry" :key="word.imse">
        <p>{{ word.imse }} ({{ clean(word.imse) }})</p>
        <ol>
          <li v-for="definition in word.definitions" :key="definition">{{ definition }}</li>
        </ol>
        <p>Derivations:</p>
        <pre>{{ word.derivations }}</pre>
        <p v-if="word.tags.length > 0">Tags:
          <span v-for="(tag, i) in word.tags" :key="tag">{{ tag }}{{ i !== word.tags.length - 1 ? ', ' : '' }}</span>
        </p>
        <p v-if="word.seeAlso.length > 0">See also:
          <span v-for="(alsoWord, i) in word.seeAlso" :key="alsoWord">{{ alsoWord }}{{ i !== word.seeAlso.length - 1 ? ', ' : '' }}</span>
        </p>
        <!-- <pre>{{ word }}</pre> -->
      </div>
    </div>
  </div>
</template>

<script>
import vocabulary from '@/vocabulary.json';
import { clean } from '@/parse';

export default {
  data() {
    return {
      query: '',
      tags: [],
    }
  },
  computed: {
    filteredVocabulary() {
      return vocabulary.words.filter(word => {
        // check imse word for match
        const imseMatch = word.imse.includes(this.query);

        // check cleaned imse word for match
        const imseCleanedMatch = clean(word.imse).includes(this.query);

        // check all english definitions for match
        let englishMatch = false;
        word.definitions.forEach((def) => {
          if (def.includes(this.query)) englishMatch = true;
        });

        // check if matches any selected tags
        // let hasMatchingTag = false;
        // if (this.activeTags.length !== 0) {
        //   word.tags.forEach((tag) => {
        //     if (this.activeTags.includes(tag)) hasMatchingTag = true;
        //   });
        // } else {
        //   hasMatchingTag = true;
        // }

        // check if matches all selected tags
        let tagsToMatch = JSON.parse(JSON.stringify(this.activeTags));
        word.tags.forEach((tag) => {
          let index = tagsToMatch.indexOf(tag);
          if (index !== -1) tagsToMatch.splice(index, 1);
        });
        const tagMatch = tagsToMatch.length === 0;

        // return result
        return (
          (imseMatch || imseCleanedMatch || englishMatch) && tagMatch
        )
      });
    },
    allTags() {
      let result = [];
      vocabulary.words.forEach((word) => {
        word.tags.forEach((tag) => {
          if (!result.includes(tag)) result.push(tag);
        });
      });
      return result;
    },
    activeTags() {
      let result = [];
      Object.entries(this.tags).forEach((tag) => {
        if (tag[1]) result.push(tag[0]);
      });
      return result;
    },
  },
  methods: {
    clean: clean,
  },
  mounted() {
    let result = {};
    this.allTags.forEach((tag) => {
      result[tag] = false;
    });
    this.tags = result;
  }
}
</script>

<style lang="css" scoped>
.word-container {
  padding-bottom: 50px;
}

.dictionary-entry {
  border: 1px solid black;
  border-radius: 6px;
  padding: 0 1rem;
  margin: 1rem 0;
}
</style>
