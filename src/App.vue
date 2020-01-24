<template>
  <div id="app">
    <div class="top-nav">

      <router-link :to="{ name: 'dogs', params: {dog_id: this.$store.state.selectedDogId}}"><div class="nav-element">{{selectedDog.name}}</div></router-link>
      <router-link to="/dogs/1"><div class="nav-element">Dog#1</div></router-link>
      <router-link to="/dogs/2"><div class="nav-element">Dog#2</div></router-link>
      <div class="push"><router-link to="/NewDog"><div class="nav-element" v-on:click="addDogClicked">Add your dog!</div></router-link></div>

    </div>
    <!-- route outlet -->
    <!-- component matched by the route will render here -->
    <div class="pagebox">
        <router-view></router-view>
      </div>
  </div>
</template>

<script>

export default {
  name: 'app',
  computed: {
    str_a() {
      return this.$store.state.count;
    },
    selectedDog() {
      return this.$store.getters.selectedDog;
    },
  },
  methods: {
    addDogClicked() {
      this.$root.$emit('new_dog_clicked');
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  margin: 0px;
  padding: 0px;
  background-color: #333333;
  display: flex;
  flex-direction: column;
  position: absolute;
  height: 100%;
  width: 100%;
  align-items: center;
}

body {
  margin: 0px;
}

.top-nav {
  background-color: gray;
  position:relative;
  height: 40px;
  width: 100%;
  margin: 0px;
  padding: 0px;
  display: flex;



}


  .top-nav .nav-element {

    background-color: black;
    height: 100%;
    padding-left: 12px;
    padding-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .nav-element:hover {
    background-color: #444444;
  }

  .top-nav a {
    display: block;
    height: 100%;
    text-decoration: none;
  }

  .push{
    margin-left: auto;
  }

.pagebox {
  display: flex;
  flex-direction: column;
  background-color: lightgray;
  padding:000px;
  margin-top: 0px;
  height: 100%;
  width: 1000px;
  position: relative;
  align-items: flex-start;
}

</style>
