<template>
  <div>
    <br />
    <div class="select">
      <select v-model="selectedBreed" @change="fetchdog">
        <option value="">Random Dog</option>
        <option v-for="(value, breed) in breeds" :key="breed" :value="value">
          {{ value.display }}
        </option>
      </select>
    </div>
    <div class="conatainer_pic">
      <img :src="dogImage" alt="Dog Image" v-if="dogImage" />
      <p v-if="imageError">Failed to load image</p>
      <button class="generateDog" @click="fetchdog">Woof</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dogImage: null,
      breeds: {},
      selectedBreed: "",
      imageError: false,
      nom1: "Nom1",
      nom2: "Nom2",
      nom3: "Nom3",
      checkedNames: [],
    };
  },
  methods: {
    fetchData(url) {
      return fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .catch((error) => {
          console.error("Error:", error);
          this.handleImageError();
        });
    },
    fetchdog() {
      let url = "https://dog.ceo/api/breeds/image/random";
      if (this.selectedBreed && this.selectedBreed.value !== "") {
        url = `https://dog.ceo/api/breed/${this.selectedBreed.value}/images/random`;
      }
      this.fetchData(url).then((data) => {
        this.dogImage = data.message;
      });
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    fetchbreeds() {
      let url = "https://dog.ceo/api/breeds/list/all";
      this.fetchData(url).then((data) => {
        let breeds = {};
        for (let breed in data.message) {
          breeds[breed] = {
            value: breed,
            display: this.capitalizeFirstLetter(breed),
          };
        }
        this.breeds = breeds;
      });
    },

    handleImageError() {
      this.imageError = true;
    },
  },
  mounted() {
    this.fetchdog();
    this.fetchbreeds();
  },
};
</script>

<style scoped>
div {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.conatainer_pic {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  gap: 1rem;
}
img {
  height: 20rem;
  max-width: 40rem;
}

select {
  background-color: #1a1a1a;
  border: none;
  padding: 0 1em 0 0;
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  cursor: inherit;
  line-height: inherit;
  outline: none;
  color: white;
  width: 100%;
}
:root {
  --select-border: #777;
  --select-focus: blue;
  --select-arrow: var(--select-border);
}
.select {
  width: 15rem;
  border: 1px solid var(--select-border);
  border-radius: 0.25em;
  padding: 0.25em 0.5em;
  font-size: 1.25rem;
  cursor: pointer;
  line-height: 1.1;
  background-color: #1a1a1a;
}
</style>
