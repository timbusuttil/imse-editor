<template lang="html">
  <div>
    <label>Search (Imse and English)</label><br>
    <input v-model="query"><br><br>
    <label>Filter by tags</label><br>
    <div v-for="tag in allTags" :key="tag">
      <input type="checkbox" :id="`tag-${tag}`" v-model="tags[tag]">
      <label :for="`tag-${tag}`">{{ tag }}</label><br>
    </div>
    <br>
    <label>{{ filteredVocabulary.length }} {{ filteredVocabulary.length === 1 ? 'result' : 'results' }}</label>
    <pre>{{ filteredVocabulary }}</pre>
  </div>
</template>

<script>
import vocabulary from '@/vocabulary.json';

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

        // check all english definitions for match
        let englishMatch = false;
        word.definitions.forEach((def) => {
          if (def.includes(this.query)) englishMatch = true;
        });

        // if any tags selected, check for matching tags
        let hasMatchingTag = false;
        if (this.activeTags.length !== 0) {
          word.tags.forEach((tag) => {
            if (this.activeTags.includes(tag)) hasMatchingTag = true;
          });
        } else {
          hasMatchingTag = true;
        }

        // return result
        return (
          (imseMatch || englishMatch) && hasMatchingTag
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
</style>
