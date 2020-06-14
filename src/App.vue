<template>
  <div id="app">
    <div class="top-nav" v-if="loggedIn || $route.name !== 'home'">
      <router-link to="/"><div class="nav-element left-el" v-on:click="homeClicked">Home</div></router-link>

      <div class="dropdown" v-on:click="dropdown.user = !dropdown.user" v-click-outside="hideUserDropdown" v-if="loggedIn" >
        <div class="nav-element left-el">{{this.$store.state.user.name || ""}}▼</div>
        <div class="dropdown-content" v-bind:class="{'display-flex' : dropdown.user}" >
          <router-link :to="{ name: 'owner', params: {owner_id: this.$store.state.user.id}}">
            <div class="nav-element dropdown-element">Profile</div>
          </router-link>
          <div class="nav-element dropdown-element" v-on:click="signOut">Log Out</div>
        </div>
      </div>

      <div class="push"></div>

      <div class="dropdown" v-on:click="dropdown.dogs = !dropdown.dogs" v-click-outside="hideDogsDropdown" v-if="loggedIn && this.$store.state.userDogs.length > 1" >
        <div class="nav-element right-el">Your Dogs▼</div>
        <div class="dropdown-content" v-bind:class="{'display-flex' : dropdown.dogs}" >
          <router-link v-for="dog in this.$store.state.userDogs"
                       :to="{ name: 'dog', params: {dog_id: dog.id, tab: $route.params.tab ? $route.params.tab: 'passport'}}"
                       v-bind:key="dog.id">
            <div class="nav-element dropdown-element">{{dog.name}}</div>
          </router-link>
        </div>
      </div>

      <router-link :to="{ name: 'dog', params: {dog_id: this.$store.state.userDogs[0].id, tab: $route.params.tab ? $route.params.tab: 'passport'}}" v-if="this.$store.state.userDogs.length === 1">
        <div class="nav-element" v-if="loggedIn">{{this.$store.state.userDogs[0].name}}</div>
      </router-link>

      <router-link to="/NewDog"><div class="nav-element right-el" v-on:click="addDogClicked" v-if="loggedIn">Add your dog!</div></router-link>



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
      windowWidth: 0,
      userDataLoaded: false,
      dropdown: {
        user : false,
        dogs: false,
      },
    }
  },
  mounted() {
    //this.renderGBtn('google-signin-btn');
    window.addEventListener("google-loaded", () => {
      this.renderGBtn('google-signin-btn');
    });

    //this.$store.dispatch('getUserInfo').then(() => {  //same as loadUserInfo but not loadUserInfo (to avoid something recursion-like)
     // this.loggedIn = true;
     // this.$root.$emit('user_data_loaded');
    //}).catch(() => {})
    this.loadUserInfo();
    //document.addEventListener('click', this.close);
    //this.$nextTick(() => {
      //this.windowWidth = window.innerWidth;
    //});

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
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    hideUserDropdown() {
      this.dropdown.user = false;
    },
    hideDogsDropdown() {
      this.dropdown.dogs = false;
    },

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
      //alert('load user info');
      this.userDataLoaded = false;
      return new Promise ((resolve, reject) => {
        this.$store.dispatch('getUserInfo').then(() => {
          this.loggedIn = true;
          //this.$root.$emit('user_data_loaded');       //
          this.userDataLoaded = true;  // the point is "there will be no further attempts to load user data"
          resolve();
          //this.$store.dispatch('getOwnerDogs', this.$store.state.user.id); //no need
          if (this.$route.name === 'home') {
            //this.$router.push({name: 'owner', params: {owner_id: this.$store.state.user.id}})
          }
        }).catch(() => {
          reject();
          this.userDataLoaded = true;
        });
      });
    },

    signOut() {
      this.loggedIn = false;
      //this.dropdown.user = false;
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
        //this.loadUserInfo();
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
  background-color: black;
  position:relative;
  height: 40px;
  width: calc(100%);
  max-width: 1000px;
  align-self: center;
  display: flex;
}
.nav-element {
  background-color: black;
  height: 100%;
  padding-left: 12px;
  padding-right: 12px;
  display: flex;
  align-items: center;
  color: white;
  cursor: pointer;
  border-width: 1px;
  border-color: #000000
}

.left-el {
  border-right-style: solid;
}

.right-el {
  border-left-style: solid;
}

.top-nav .placeholder-wide {
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


.dropdown {
  display: flex;
  position: relative;
}

.dropdown-content {
  display:none;
  position: absolute;
  z-index: 1;
  margin-top: 40px;
  flex-direction: column;
  min-width: 100%;
}

.dropdown-element {
  height: 40px;
  border-bottom-style: solid;
  border-left-style: solid;
  border-right-style: solid;
}

.display-flex {
  display: flex;
}

.passport-info {
  margin: 20px !important;
  line-height: 30px;

  display: flex;
  flex-direction: column;
  width: 100%;
}
.passport-info-record {
  position: relative;
  padding-bottom: 50px !important;
  width: 100%;
}
.record {
  color: brown;
}
.button-commit {
  display: inline;
  height: 30px;
  width: auto;
  padding-left: 8px !important;
  padding-right: 8px !important;
  font-size: 20px;
}
.flex-row {
  display: flex;
  flex-direction: row;
  flex: 1;
}
.flex-column {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.flex-row-reverse {
  flex-direction: row-reverse;
}
.flex-space-between {
  justify-content: space-between; /*justify-content = main axis*/
}

@media screen and (max-width: 600px) {
  .lowres-column {
    flex-direction: column !important;
  }
  .lowres-row {
    flex-direction: row !important;
  }
  .lowres-column-reverse {
    flex-direction: column-reverse !important;
  }
  .passport-info-record {
    padding-bottom: 15px !important;
  }
  .button-commit {
    font-size: 17px;
  }
  .widescreen-only {
    display: none;
  }
}

@media screen and (min-width: 600px) {

}


.link-like {
  cursor: pointer;
  text-decoration: underline;
  color: darkblue;
  font-weight: bold;
}
</style>
