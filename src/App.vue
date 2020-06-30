<template>
  <div id="app">
    <div class="top-nav">
      <div class="block-left">
        <router-link to="/"><div class="nav-element" v-on:click="homeClicked">Home</div></router-link>
        <dropdown v-if="isLoggedIn" :title="`${this.$store.state.user.name}▼`">
          <div class="dropdown-content">
            <router-link :to="{ name: 'owner', params: {owner_id: this.$store.state.user.id}}">
              <div class="nav-element dropdown-element">Profile</div>
            </router-link>
            <div class="nav-element dropdown-element" v-on:click="signOut">Log Out</div>
          </div>
        </dropdown>
      </div>

      <div class="block-right">
        <dropdown v-if="isLoggedIn && this.$store.state.userDogs.length > 1" :title="'Your Dogs▼'">
          <div class="dropdown-content">
            <router-link v-for="dog in this.$store.state.userDogs"
                         :to="{ name: dogRouteName, params: {dog_id: dog.id}}"
                         v-bind:key="dog.id">
              <div class="nav-element dropdown-element">{{dog.name}}</div>
            </router-link>
          </div>
        </dropdown>

        <router-link :to="{ name: dogRouteName, params: {dog_id: this.$store.state.userDogs[0].id}}" v-if="this.$store.state.userDogs.length === 1">
          <div class="nav-element" v-if="isLoggedIn">{{this.$store.state.userDogs[0].name}}</div>
        </router-link>

        <router-link to="/NewDog"><div class="nav-element right-el" v-on:click="addDogClicked" v-if="isLoggedIn">Add your dog!</div></router-link>

        <div class="placeholder-wide">
            <div id="google-signin-btn"></div>
        </div>
      </div>
    </div>
    <div class="pagebox">
      <router-view v-if="userDataLoaded"></router-view>
    </div>
  </div>

</template>

<script>
  import Dropdown from './components/Dropdown';
export default {


  name: 'app',
  components: {Dropdown},
  data() {
    return {
      gbtnHomeRenderRequest: false,
      user: {
        name: "",
        email: "",
        ID: "",
        tokenId: "",
      },
      isLoggedIn: false,
      response: "",
      windowWidth: 0,
      userDataLoaded: false,
      isHome: false,
      isPathNameResolved: false,
      isGoogleLoaded: false,
    }
  },
  mounted() {
    //alert(this.$route.name);
    //this.isHome = this.$route.name === 'home';
    window.addEventListener("google-loaded", () => {
      // eslint-disable-next-line no-undef
      if (!gapi.auth2) {
        // eslint-disable-next-line no-undef
        gapi.load('auth2', function() {
        // eslint-disable-next-line no-undef
        gapi.auth2.init();
      });
      }
      // eslint-disable-next-line no-undef
      //gapi.auth2.init();
      //if (!this.isLoggedIn) {
        //if (this.isHome) {
          //this.gbtnHomeRenderRequest = true;
      this.isGoogleLoaded = true;
          //this.$root.$emit('')
       // } else {
          //this.renderGBtn('google-signin-btn');
     //   }
      //}
    });
    this.loadUserInfo().catch(() => {});
  },
  watch: {
    $route: function () {
      this.isHome = this.$route.name === 'home';
      this.isPathNameResolved = true;
    },
    gbtnToRender (newValue) {
      //alert (newValue);
      //this.renderGBtn('google-signin-btn');
      switch (newValue) {
        case 'nav':
          //alert (newValue);
          this.renderGBtn('google-signin-btn');
          break;
        case 'home':
          //this.gbtnHomeRenderRequest = true;
          //this.hideNavGbtn();
          this.renderGBtn('google-signin-btn');
          break;
        default:
          this.hideNavGbtn();
          break;
      }
    }
  },
  computed: {
    dogRouteName() {
      switch (this.$route.name) {
        case 'dog_passport': return 'dog_passport';
        case 'dog_health': return 'dog_health';
        default: return 'dog_passport';
      }
    },
    gbtnToRender() {
      if (this.isGoogleLoaded && this.userDataLoaded && this.isPathNameResolved && !this.isLoggedIn)  {
        return this.isHome ? 'home' : 'nav';
      } else {
        return 'none';
      }

    },
  },
  methods: {
    homeClicked() {
      //this.$root.$emit('home_clicked');   //this event does not reach the child
      if (!this.isLoggedIn) {
       // this.gbtnHomeRenderRequest = true;
      }
    },
    hideNavGbtn() {
      const item = document.getElementById('google-signin-btn');
      item.innerHTML = '';
    },
    addDogClicked() {
      this.$root.$emit('new_dog_clicked');
    },

    loadUserInfo () {
      //alert('load user info');
      this.userDataLoaded = false;
      return new Promise ((resolve, reject) => {
        this.$store.dispatch('getUserInfo').then(() => {
          this.isLoggedIn = true;
          this.userDataLoaded = true;  // no further attempts to load user data
          resolve();
        }).catch(() => {
          reject();
          this.userDataLoaded = true;
        });
      });
    },

    signOut() {
      //this.dropdown.user = false;
      document.cookie = "auth_token=false; path=/";
      // eslint-disable-next-line no-undef
        let auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(() => {
          this.isLoggedIn = false;
          this.$store.commit('wipeUserData');
          //if (this.isHome){
            //this.renderGBtn('google-signin-btn-home')
          //} else {
            //alert(this.$route.name);
            //this.renderGBtn('google-signin-btn');

          //}
        });
    },
    onSignIn() {
      //alert('onSI');
      if (!this.isLoggedIn) {
        this.$store.dispatch('authRequest').then((msg) => {
          this.loadUserInfo().then(() => {

            if (msg === 'new_user') {     //this section generates a dog for any newcomer to boost user expirience
              let dog = {
                name: "Guard Dog",
                breed: "The Shepherd",
                sex: "Male",
                birthdate: '2016-04-12',
                color: "Black, Brown",
                tattoo: `TEST${this.$store.state.user.id}`
              };
              this.$store.dispatch('newDog', dog).then(() => {
                let medInfo1 = {
                  code: 1,
                  duration: 84,
                  date: '2020-05-22',
                  brand: `Test medication #${this.$store.state.user.id}`,
                  dogId: this.$store.state.dogs[0].id
                };
                let medInfo3 = {
                  code: 3,
                  duration: 365,
                  date: '2018-03-13',
                  brand: `Test vaccine #${this.$store.state.user.id}`,
                  dogId: this.$store.state.userDogs[0].id
                };
                this.$store.dispatch('updateMedication', medInfo1);
                this.$store.dispatch('updateMedication', medInfo3);
                alert ('Guard Dog has joined you. Check it out!')
              });
            }
          });
        });
      }
    },
    onSignInFailure() {
     // this.isLoggedIn = false;
    },
    renderGBtn(buttonId) {
      const item = document.querySelector('google-signin-btn');
      if (item?.innerHTML) {return;}
      // eslint-disable-next-line no-undef
      gapi.signin2.render(buttonId, { // this is the button "id"
        onsuccess: this.onSignIn,
        onfailure: this.onSignInFailure,
        height: 40,
        width: 110,
        scope: 'email',
        prompt: 'select_account',
      });
      this.googleBtnRendered = true; //this is nedeed... probably
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
  justify-content: space-between;
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


.placeholder-wide {
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
  position: absolute;
  z-index: 1;
  margin-top: 40px;
  flex-direction: column;
  min-width: 100%;
}

.dropdown-element {
  height: 40px;
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
  color: black;
  text-align: left;
  justify-content: space-between;

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
}
.flex-column {
  display: flex;
  flex-direction: column;
}
.flex-row-reverse {
  flex-direction: row-reverse;
}
.flex-space-between {
  justify-content: space-between; /*justify-content = main axis*/
}

.photo {
  max-width: 300px;
  min-height: 50px;
  background-color: #aaa;
  margin-left: 20px;
  margin-bottom: 20px;
  align-self: flex-start;
  line-height: 0;
  display: flex;
  align-items: stretch;
  flex-direction: column;
  flex-shrink: 0;
}

.photo-placeholder {
  display: flex;
  border-style: dashed;
  margin: 10px;
  flex: 1;
  align-items: center;
  justify-content: center;
}

.overview {
  display: flex;
  flex-direction: column;
  padding:0px;
  margin-top: 0px;
  height: 100%;
  width: 100%;
  position: relative;
  align-items: flex-start;
}

.pagename {
  background-color: #333333;
  display:flex;
  height: 60px;
  text-align: left;
  width: 100%;
  color: white;
  align-items: center;
}

.page {
  display: flex;
  width: 100%;
  color: black;
  text-align: left;
  flex-direction: row;
  justify-content: space-between;
}

.page-title {
  margin-left: 15px;
}

.image-photo {
  max-width: 100%;

  background-color: brown;
  line-height: 40px;
  align-self: flex-end;
}

.no-photo {
  min-height: 160px;
  min-width: 160px;
}

@media screen and (max-width: 600px) {
  .lowres-hidden {
    display: none !important;
  }
  .lowres-shown {
    display: flex !important;
  }
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
  .photo {
    margin-left: 0px;
    margin-right: auto;
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
  .block-left, .block-right {
    display: flex;
    height: 100%;
  }
</style>
