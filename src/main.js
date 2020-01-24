import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

import App from './App.vue'
import Foo from './external.js';


Vue.use(VueRouter);
Vue.use(Vuex);

import byeWorld from './components/ByeWorld'
import helloWorld from './components/HelloWorld';
import overview from './components/Overview.vue';
import newDog from './components/NewDog.vue';

Vue.config.productionTip = false;

const store = new Vuex.Store({
  state: {
    count: 4,
    userId: 0,
    selectedDogId: 0,
    dogs: [
      { id: 0,
        name: "Rask",
        breed: "Border Collie",
        sex: "Male",
        birthDate: "2018-01-01",
        color: "Black and White",
        tattoo: "UDC123",
        ownerId: 0
      },
      { id: 1,
        name: "Laima",
        breed: "Karelo-finskaya laika",
        sex: "Female",
        birthDate: "2019-02-10",
        color: "Orange/Breeki",
        tattoo: "???",
        ownerId: 1
      },
    ],
    owners: [
      {
        id: 0,
        name: "Khromov Aleksei",
        country: "Russia",
        city: "Saint-Petersburg",
        email: "pts09a@ya.ru",
        phone: "888-88-88-88-88"
      }
    ]
  },
  getters: {
    userDogs: state => {                                                  //returns all your dogs
      return state.dogs.filter(dog => dog.ownerId === state.userId);
    },
    selectedDog: state => {                                               //returns the dog to view
      return state.dogs.find(dog => dog.id === state.selectedDogId)
    },
    dogById: state => id => {
      return state.dogs.find(dog => dog.id === id)
    },
    getOwner: state => id => {
      return state.owners.find (owner => owner.id === id)
    }
  },
  mutations: {
    dogPush(state, payload) {
      state.dogs.push(payload);
    },
    dogUpdate(state, payload) {
      let id = payload.id;      //this ID (not an index) of the dog to update
      let i = state.dogs.indexOf(state.dogs.find(dog => dog.id === id));  //this is dog's actual index in an array
      state.dogs.splice(i,1);
      state.dogs.push(payload);
      }
  }
})

const routes = [
  { path: '/bw', component: byeWorld },
  { path: '/hw', component: helloWorld, props: {msg: 'HELOL'} },
  { path: '/foo', component: Foo },
  { path: '/', name: 'home'},
  { path: '/dogs/:dog_id', name: 'dogs', component: overview},
  { path: '/NewDog', name: 'newdog', component: newDog},
  { path: '/edit/:dog_id', name: 'edit', component: newDog},
];

const router = new VueRouter({
  routes, // short for `routes: routes`
  mode: 'history'
})

new Vue({
  store,
  render: h => h(App),
  router,
}).$mount('#app')
