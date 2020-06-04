<template>
  <div id="app">
    <div class="top-nav" v-if="loggedIn || $route.name !== 'home'">
      <router-link to="/"><div class="nav-element" v-on:click="homeClicked">Home</div></router-link>
      <router-link v-for="dog in this.$store.state.userDogs" :to="{ name: 'dog', params: {dog_id: dog.id, tab: $route.params.tab ? $route.params.tab: 'passport'}}" v-bind:key="dog.id"><div class="nav-element">{{dog.name}}</div></router-link>
      <div class="push">
        <router-link to="/NewDog"><div class="nav-element" v-on:click="addDogClicked" v-if="loggedIn">Add your dog!</div></router-link>
      </div>
      <router-link :to="{ path: userInfo.linkPath }" v-if="loggedIn"><div class="nav-element">{{userInfo.linkText}}</div></router-link>

      <div class="nav-element" v-if="loggedIn" v-on:click="signOut">Log Out</div>

      <div class="placeholder-wide">
          <div id="google-signin-btn" v-if="!loggedIn"></div>
      </div>
    </div>

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
      gbtnHomeRenderRequest: false,
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
    //this.renderGBtn('google-signin-btn');
    window.addEventListener("google-loaded", () => {
      this.renderGBtn('google-signin-btn');
    });

    this.$store.dispatch('getUserInfo').then(() => {  //same as loadUserInfo but not loadUserInfo (to avoid something recursion-like)
      this.loggedIn = true;
      this.$root.$emit('user_data_loaded');
      if (this.$route.name === 'home') {
        //this.$router.push({name: 'owner', params: {owner_id: this.$store.state.user.id}})
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
    homeClicked() {
      //this.$root.$emit('home_clicked');   //this event does not reach the child
      if (!this.loggedIn) {
        this.gbtnHomeRenderRequest = true;
      }
    },
    addDogClicked() {
      this.$root.$emit('new_dog_clicked');
    },

    loadUserInfo () {
      return new Promise ((resolve, reject) => {
        this.$store.dispatch('getUserInfo').then(() => {
          this.loggedIn = true;
          this.$root.$emit('user_data_loaded');       //
          resolve();
          //this.$store.dispatch('getOwnerDogs', this.$store.state.user.id); //no need
          if (this.$route.name === 'home') {
            //this.$router.push({name: 'owner', params: {owner_id: this.$store.state.user.id}})
          }
        }).catch(() => {reject();})
      });
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
          if (this.$route.name === 'home'){
            this.renderGBtn('google-signin-btn-home')
          } else {
            this.renderGBtn('google-signin-btn');
          }
        });
    //  } else {this.renderGBtn();}
    },
    onSignIn() {  //could be "user" inside
      if (!this.loggedIn) {
        this.$store.dispatch('authRequest').then((msg) => {
          this.loadUserInfo().then(() => {
            if (msg === 'new_user') {     //this section generates a dog for any newcomer to boost user expirience
              let dog = {
                name: "Guard Dog",
                breed: "The Shepherd",
                sex: "Male",
                birthdate: '2016-04-12',
                color: "Black, Brown",
                tattoo: "TEST" + this.$store.state.user.id
              };
              this.$store.dispatch('newDog', dog).then(() => {
                let medInfo1 = {
                  code: 1,
                  duration: 84,
                  date: '2020-05-22',
                  brand: 'Test medication #' + this.$store.state.user.id,
                  dogId: this.$store.state.dogs[0].id
                };
                let medInfo3 = {
                  code: 3,
                  duration: 365,
                  date: '2018-03-13',
                  brand: 'Test vaccine #' + this.$store.state.user.id,
                  dogId: this.$store.state.userDogs[0].id
                };
                this.$store.dispatch('updateMedication', medInfo1);
                this.$store.dispatch('updateMedication', medInfo3);
                alert ('Guard Dog has joined you. Check it out!')
              });
            }
          });
        });
      } else {
        this.loadUserInfo();
      }
    },
    onSignInFailure() {
     // this.loggedIn = false;
    },
    renderGBtn(buttonId) {
      // eslint-disable-next-line no-undef
      gapi.signin2.render(buttonId, { // this is the button "id"
        onsuccess: this.onSignIn,
        onfailure: this.onSignInFailure,
        height: 40,
        width: buttonId === 'google-signin-btn-home' ? 110 : 110,
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

span[id^=not_signed_]{
  visibility: hidden;
}

span[id^=not_signed_]:before {
  content: 'Sign in';
  visibility: visible;
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
  max-width: 1000px;

  margin-left: max((100% - 1000px)/2, 0.000000000000001px);
  margin-right: max((100% - 1000px)/2, 0.0000000000000001%);
  /*for some reason "0px" or "0%" translates to simple "0" and formula refuses to work
  there are more accurate ways to do what I wanted but whatever*/
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
    border-right-style: solid;
    border-width: 1px;
    border-color: #333333
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
  max-width: 1000px;
  width: 100%;
  position: relative;
  align-items: flex-start;
  align-self: center;
}

</style>
