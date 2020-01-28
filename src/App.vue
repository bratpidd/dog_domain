<template>
  <div id="app">
    <div class="top-nav">

      <router-link :to="{ name: 'dog', params: {dog_id: this.$store.state.selectedDogId}}"><div class="nav-element">{{selectedDog.name}}</div></router-link>
      <router-link to="/dog/1"><div class="nav-element">Dog#1</div></router-link>
      <router-link to="/dog/2"><div class="nav-element">Dog#2</div></router-link>
      <div class="push">
        <router-link to="/NewDog"><div class="nav-element" v-on:click="addDogClicked" v-if="loggedIn">Add your dog!</div></router-link>
      </div>
      <router-link :to="{ path: userInfo.linkPath }" v-if="loggedIn"><div class="nav-element">{{userInfo.linkText}}</div></router-link>

      <div class="nav-element" v-if="loggedIn" v-on:click="signOut">Log Out</div>

      <div id="google-signin-btn"></div>
      <div class="nav-element gbutton-placeholder" v-bind:class="{ 'placeholder-wide': !loggedIn, 'placeholder-wide' : loggedIn }">PLACEHOLDER</div>
    </div>{{loggedIn}}
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
        tokenID: "",
      },
      loggedIn: false,
    }
  },
  mounted() {
    this.renderGBtn();
  },
  created() {
    this.loggedIn = (this.getCookie('isLoggedIn') === 'true');
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
      let owner = this.$store.getters.ownerById(this.$store.state.userId);
      if (owner !== undefined) {
        //linkText = owner.name;
        linkText = this.user.name;
        linkPath = '/owner/' + owner.id;
      }
      return {linkText, linkPath};
    }
  },
  methods: {
    addDogClicked() {
      this.$root.$emit('new_dog_clicked');
    },
    getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    },
    signOut() {
      let auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(() => {
        document.cookie = "isLoggedIn=false";
        this.loggedIn = false;
        //
      });
    },
    onSignIn(user) {
      const profile = user.getBasicProfile();
      //alert(profile.getName());
      this.user.name = profile.getName();
      this.user.email = profile.getEmail();
      this.user.ID = profile.getId();
      this.user.tokenID = user.getAuthResponse().id_token;
      this.loggedIn = true;
      document.cookie = "isLoggedIn=true";
    },
    onSignInFailure() {
      this.loggedIn = false;
      document.cookie = "isLoggedIn=false";
    },
    renderGBtn() {
      gapi.signin2.render('google-signin-btn', { // this is the button "id"
        onsuccess: this.onSignIn,
        onfailure: this.onSignInFailure,
        height: 40,
        width: 110,
        scope: 'email',
        prompt: 'select_account',
      });
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
  position: absolute;
  height: 100%;
  width: 100%;
 overflow: hidden;
}

body {
  margin: 0;
}



.top-nav {
  background-color: gray;
  position:relative;
  height: 40px;
  width: calc(100% + 110px);
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
    width: 110px;
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
