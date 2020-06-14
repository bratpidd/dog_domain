import Vue from 'vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter);

import Vuex from 'vuex'
Vue.use(Vuex);

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios);

import VModal from 'vue-js-modal'
Vue.use(VModal, { dynamic: true, dynamicDefaults: { clickToClose: false, height:"auto", width: 400, adaptive:true }, injectModalsContainer: true, dialog: true });

import App from './App.vue'
import Foo from './external.js';

import byeWorld from './components/ByeWorld'
import helloWorld from './components/HelloWorld';
import overview from './components/Overview.vue';
import newDog from './components/NewDog.vue';
import owner from './components/Owner.vue';
import ownerEdit from './components/OwnerEdit.vue';
import home from './components/Home.vue';

Vue.config.productionTip = false;


Vue.directive('click-outside', {
  // eslint-disable-next-line no-unused-vars
  bind: function (el, binding, vnode) {

    const handler = (e) => {
      if ((!el.contains(e.target) && el !== e.target)) {
        binding.value(e)
      }
    };
    el.clickOutsideEvent = handler;
    document.addEventListener('click', handler)
  },

  // eslint-disable-next-line no-unused-vars
  unbind: function (el, binding) {
    // Remove Event Listeners
    document.removeEventListener('click', el.clickOutsideEvent);
    el.clickOutsideEvent = null;
  }
});


// owner - any registered human
// user - verified owner that uses the website right now

const store = new Vuex.Store({
  state: {
    response: "",
    isLoggedIn: false,
    userId: 0,
    idToken: "",
    selectedDogId: 0,
    dogs: [],
    userDogs: [],
    user: {name: '', country: '', city: '', email: '', phone: '', id: ''},
    owners: [],
    medication: [],
  },
  getters: {
    getOwnerDogs: state => ownerId => {                                                  //returns all your dogs //OLD!!!!!!!!
      return state.dogs.filter(dog => dog.owner_id === ownerId);
    },
    selectedDog: state => {                                               //returns the dog to view //OLD!!!1111
      return state.dogs.find(dog => dog.id === state.selectedDogId)
    },
    dogById: state => id => {
      return state.dogs.find(dog => dog.id === id)
    },
    ownerById: state => id => {
      return state.owners.find (owner => owner.id === id)
    }
  },
  mutations: {
    medicationPush(state,payload) {
      state.medication.push(payload);
    },
    ownerPush(state, payload) { //pushes an owner object into state
      state.owners.push(payload);
    },
    dogPush(state, payload) { //pushes a dog object into state
      state.dogs.push(payload);
    },
    dogPushUser(state, payload) {
      state.userDogs.push(payload);
    },
    dogUpdate(state, payload) {
      let id = payload.id;      //this ID (not an index) of the dog to update
      let i = state.dogs.indexOf(state.dogs.find(dog => dog.id === id));  //this is dog's actual index in an array
      state.dogs.splice(i,1);
      state.dogs.push(payload);
    },
    userUpdate(state, payload) {
      state.user = Object.assign({},payload);
    },
    setIdToken(state, payload) {
      state.tokenId = payload.tokenId;
    },
    getResponse(state) {
      axios.get('/1.php', {params: {kek: 'zaga', id_token: state.idToken}}).then((response) => {
        state.response = response;
      })
    },
    wipeData(state){
      state.dogs = [];
      state.owners = [];
      state.medication = [];
    },
    wipeUserData(state){
      state.user = {};
      state.userDogs = [];
    },
    wipeMedication(state){
      state.medication = [];
    }
  },

  actions: {
    authRequest() {                 //sends a request to back-end to renew authorization cookie. uses Google id_token to identify user.
      return new Promise ((resolve, reject) => {
        // eslint-disable-next-line no-undef
        let GoogleAuth = gapi.auth2.getAuthInstance();
        let googleUser = GoogleAuth.currentUser.get();
        googleUser.reloadAuthResponse().then(()=>{
          let idToken = googleUser.getAuthResponse().id_token;
          axios.get('/1.php', {params: {action: 'auth_request', id_token: idToken}}).then((response) => {
            //alert (response.data.msg);
            let msg = response.data.msg;
            if ((msg === 'new_user')||(msg === 'auth_token_updated')) {
              resolve(msg);
            } else {reject();}
          });
        })
      });
    },

    getMedicationInfo(context, dogId) {
      return new Promise ((resolve, reject) => {
        axios.get('/1.php', {params: {action: 'get_medication_info', dogId: dogId}}).then((response) =>{
          if (response.data.msg === 'ok') {
            let medication = response.data.medication;
            //alert(JSON.stringify(medication));
            context.commit ('wipeMedication');
            medication.forEach(med => {
              context.commit('medicationPush', med);
            });
            resolve();
          } else {reject();}
        });
      });
    },

    updateMedication(context, payload) {
      return new Promise((resolve, reject) => {
        axios.get('/1.php', {params: {action: 'update_medication', medication: payload}}).then((response) => {
          if (response.data.msg ==='ok') {
            //alert(response.data.msg);
            resolve();
          } else {
            reject();
          }
        });
      });
    },

    updateDog(context, payload) { //along with 'dogUpdate' mutation this is brilliant
      return new Promise ((resolve, reject) => {
        axios.get('/1.php', {params: {action: 'update_dog', dog:payload}}).then((response) => {
          //alert(response.data);
          if (response.data.msg === 'ok') {
            resolve();
          } else {reject();}
        });
      });
    },

    updateUser(context, payload) {
      return new Promise ((resolve, reject) => {
        axios.get('/1.php', {params: {action: 'update_user', id: context.state.user.id, name: payload.name, country: payload.country, //<-- terrible practice, see updateDog
            city: payload.city, email: payload.email, phone: payload.phone}}).then((response) => {
              //alert(response.data.msg);
          if (response.data.msg === 'ok') {
            resolve();
          } else {reject();}
        });
      });
    },

    getUserInfo(context){   //REFRESH info about the current user and his dogs. -Very similar to getOwnerInfo
      return new Promise((resolve, reject) => {
        axios.get('/1.php', {params: {action: 'get_current_user'}}).then((response) => {
          let user = response.data.user;
          let dogs = response.data.dogs;
          //alert (user.msg);
          if (response.data.msg === 'ok') {
            context.commit('wipeUserData');
            context.commit('userUpdate', user);
            dogs.forEach(dog => {
              context.commit('dogPushUser', dog);
            });
            resolve();
          } else {reject();}
        })
      })
    },

    getOwnerInfo(context, ownerId){   //LOAD owner AND his dogs (to owners, dogs)
      return new Promise((resolve, reject) => {
        axios.get('/1.php', {params: {action: 'get_owner_info', ownerId: ownerId}}).then((response) => {
          //alert(JSON.stringify(response.data));
          let owner = response.data.owner;
          let dogs = response.data.dogs;
          if (response.data.msg === 'ok') {
            context.commit('ownerPush', owner);
            dogs.forEach(dog => {
              context.commit('dogPush', dog);
            });
            resolve();
          } else {reject();}
        })
      })
    },

    getOwnerDogs(context, ownerId) {      //!! MAY BE UNUSED   !!IS USED RIGHT BELOW!!!      //LOAD owner's dogs AND (if it is user) reload user's dogs //may be not that necessary but whatever
      return new Promise((resolve, reject) => {
        axios.get('/1.php', {params: {action: 'get_owner_dogs', ownerId: ownerId}}).then((response) => {
          let msg = response.data.msg;
          if (msg === 'ok') {
            let isUser = (ownerId === context.state.user.id);
            if (isUser) {
              context.state.userDogs = [];
            }
            response.data.dogs.forEach(dog => {
              context.commit('dogPush', dog);
              if (isUser) {
                context.commit('dogPushUser', dog);
              }
            });
            resolve();
          } else{reject();}
        });
      });
    },

    newDog (context, payload) {
      return new Promise ((resolve, reject) => {
        axios.get('/1.php', {params :{action: 'new_dog', dogInfo: payload}}).then((response) => {
          if (response.data.msg === 'ok') {
            //alert ('dog added');
            context.dispatch('getOwnerDogs', context.state.user.id).then(() => {
              resolve()
            });
          } else {reject();}
        });
      });
    },

    getDog(context, id) {
      return new Promise ((resolve, reject) => {
        axios.get('/1.php', {params: {action: 'get_dog', dogId: id}}).then((response) =>{
          if (response.data.msg === 'ok') {
            let dog = response.data.dog;
            let owner = response.data.owner;
            //alert(JSON.stringify(dog));
            context.commit('dogPush', dog);
            context.commit('ownerPush', owner);
            resolve();
          } else {reject();}
        });
      });
    }
  }
});

const routes = [
  { path: '/bw', component: byeWorld },
  { path: '/hw', component: helloWorld, props: {msg: 'HELOL'} },
  { path: '/foo', component: Foo },
  { path: '/', name: 'home', component: home},
  { path: '/dog/:dog_id/edit', name: 'dog_edit', component: newDog},
  { path: '/dog/:dog_id/:tab', name: 'dog', component: overview},
  { path: '/NewDog', name: 'dog_new', component: newDog},
  { path: '/owner/:owner_id', name: 'owner', component: owner},
  { path: '/edit_profile', name: 'owner_edit', component: ownerEdit },
];

const router = new VueRouter({
  routes, // short for `routes: routes`
  mode: 'history'
});

new Vue({
  store,
  render: h => h(App),
  router,
}).$mount('#app')
