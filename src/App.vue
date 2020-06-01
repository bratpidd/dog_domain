<template>
  <div id="app">
    <div class="top-nav">
      <router-link v-for="dog in this.$store.state.userDogs" :to="{ name: 'dog', params: {dog_id: dog.id, tab: $route.params.tab ? $route.params.tab: 'passport'}}" v-bind:key="dog.id"><div class="nav-element">{{dog.name}}</div></router-link>
      <div class="push">
        <router-link to="/NewDog"><div class="nav-element" v-on:click="addDogClicked" v-if="loggedIn">Add your dog!</div></router-link>
      </div>
      <router-link :to="{ path: userInfo.linkPath }" v-if="loggedIn"><div class="nav-element">{{userInfo.linkText}}</div></router-link>

      <div class="nav-element" v-if="loggedIn" v-on:click="signOut">Log Out</div>

      <div class="placeholder-wide">
          <div id="google-signin-btn"></div>
      </div>


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
  data() {
    return {
      user: {
        name: "",
        email: "",
        ID: "",
        tokenId: "",
      },
      loggedIn: false,
      response: "",
    }
  },
  mounted() {
    window.addEventListener("google-loaded", () => {
      this.renderGBtn();
    });

    this.$store.dispatch('getUserInfo').then(() => {  //same as loadUserInfo but not loadUserInfo (to avoid something recursion-like)
      this.loggedIn = true;
      this.$root.$emit('user_data_loaded');
      if (this.$route.name === 'home') {
        this.$router.push({name: 'owner', params: {owner_id: this.$store.state.user.id}})
      }
      //
      //this.$store.dispatch('getOwnerDogs', this.$store.state.user.id); //no need
    //  this.renderGBtn();
    }).catch(() => {})
  },
  created() {

  },
  computed: {
    str_a() {
      return this.$store.state.count;
    },
    selectedDog() {
      return this.$store.getters.selectedDog;
    },
    userInfo() {
      let linkText = "Sign In! (Google)";
      let linkPath = '/sign_in';
      let user = this.$store.state.user;
      linkText = user.name;
      linkPath = '/owner/' + user.id;
      return {linkText, linkPath};
    }
  },
  methods: {
    addDogClicked() {
      this.$root.$emit('new_dog_clicked');
    },
    loadUserInfo () {
      this.$store.dispatch('getUserInfo').then(() => {
        this.loggedIn = true;
        this.$root.$emit('user_data_loaded');       //
        //this.$store.dispatch('getOwnerDogs', this.$store.state.user.id); //no need
      }).catch(() => {})

    },
    signOut() {
      this.loggedIn = false;
      document.cookie = "auth_token=false; path=/";
//      this.googleBtnRendered = false;
  //    if (this.googleBtnRendered) {
      // eslint-disable-next-line no-undef
        let auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(() => {
          this.$store.commit('wipeUserData');
        });
    //  } else {this.renderGBtn();}
    },
    onSignIn() {  //could be "user" inside
      if (!this.loggedIn) {
        this.$store.dispatch('authRequest').then(() => {
          this.loadUserInfo();
        });
      } else {
        this.loadUserInfo();
      }
    },
    onSignInFailure() {
     // this.loggedIn = false;
    },
    renderGBtn() {
      // eslint-disable-next-line no-undef
      gapi.signin2.render('google-signin-btn', { // this is the button "id"
        onsuccess: this.onSignIn,
        onfailure: this.onSignInFailure,
        height: 40,
        width: 110,
        scope: 'email',
        prompt: 'select_account',
      });
      this.googleBtnRendered = true;
    },
    authRequest() {
      this.$store.dispatch('authRequest');
    },
    getUserInfo(){
      this.$store.dispatch('getUserInfo');
    }
  },

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
  align-items: stretch;
  align-content: stretch;
  width: 100%;
  height: auto;
  min-height: 100% !important;
}

.text-black {
  color: black;
}

body, html {
  margin: 0;
  height:100%
}

.top-nav {
  background-color: gray;
  position:relative;
  height: 40px;
  width: calc(100%);
  margin: 0;
  padding: 0;
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
    cursor: pointer;
  }

  .top-nav .placeholder-wide {

    padding: 0;
  }

  .top-nav .placeholder-narrow {
    width: 0;
    padding: 0;
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
  flex: 1;
  flex-direction: column;
  background-color: lightgray;
  padding:0px;
  margin-top: 0px;
  height: 100%;
  width: 100%;
  max-width: 1000px;
  position: relative;
  align-items: flex-start;
  align-self: center;
}

</style>
