import axios from "axios";

// owner - any registered human
// user - verified owner that uses the website right now
export default {
    state: {
        userDataLoaded: false,
        isLoggedIn: false,
        userId: 0,
        idToken: "",
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
        dogById: state => id => {
            return state.dogs.find(dog => dog.id === id)
        },
        ownerById: state => id => {
            return state.owners.find(owner => owner.id === id)
        }
    },
    mutations: {
        medicationPush(state, payload) {
            state.medication.push(payload);
        },
        medicationStoreUpdate(state, payload) {
            const oldEl = state.medication.find(m => (m.code === payload.code));
            if (oldEl) {
                const index = state.medication.indexOf(oldEl);
                state.medication.splice(index, 1);
            }
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
        userUpdate(state, payload) {
            state.user = Object.assign({}, payload);
        },
        wipeData(state) {
            state.dogs = [];
            state.owners = [];
            state.medication = [];
        },
        wipeUserData(state) {
            state.user = {};
            state.userDogs = [];
        },
        wipeMedication(state) {
            state.medication = [];
        }
    },
    actions: {
        authRequest() {                 //sends a request to back-end to renew authorization cookie. uses Google id_token to identify user.
            return new Promise((resolve, reject) => {
                // eslint-disable-next-line no-undef
                let GoogleAuth = gapi.auth2.getAuthInstance();

                GoogleAuth.then(() => {
                    let googleUser = GoogleAuth.currentUser.get();
                    let idToken = googleUser.getAuthResponse().id_token;
                    axios.get('/server.php', {
                        params: {
                            action: 'auth_request',
                            id_token: idToken
                        }
                    }).then((response) => {
                        //alert (response.data.msg);
                        let msg = response.data.msg;
                        if ((msg === 'new_user') || (msg === 'auth_token_updated')) {
                            resolve(msg);
                        } else {
                            reject();
                        }
                    });
                })
            });
        },

        uploadImage(context, payload) {    //request to upload image for 'owner' or 'dog' (specified in 'entity')
            return new Promise((resolve, reject) => {
                axios.post('/server.php', payload.image, {
                    headers: {
                        'ACTION': 'upload_image',
                        'ENTITY': payload.entity,
                        'ID': payload.id
                    }
                }).then((response => {
                    if (response.statusText === 'OK') {
                        resolve();
                        //alert ('resolved');
                    } else {
                        reject()
                    }
                }));
            });
        },

        getMedicationInfo(context, dogId) {
            return new Promise((resolve, reject) => {
                axios.get('/server.php', {
                    params: {
                        action: 'get_medication_info',
                        dogId: dogId
                    }
                }).then((response) => {
                    if (response.data.msg === 'ok') {
                        let medication = response.data.medication;
                        //alert(JSON.stringify(medication));
                        context.commit('wipeMedication');
                        medication.forEach(med => {
                            context.commit('medicationPush', med);
                        });
                        resolve();
                    } else {
                        reject();
                    }
                });
            });
        },

        updateMedication(context, payload) {
            return new Promise((resolve, reject) => {
                axios.get('/server.php', {
                    params: {
                        action: 'update_medication',
                        medication: payload
                    }
                }).then((response) => {
                    if (response.data.msg === 'ok') {
                        //alert(response.data.msg);
                        resolve();
                        context.commit('medicationStoreUpdate', payload);
                    } else {
                        reject();
                    }
                });
            });
        },

        updateDog(context, payload) { //along with 'dogUpdate' mutation this is brilliant
            return new Promise((resolve, reject) => {
                axios.get('/server.php', {params: {action: 'update_dog', dog: payload}}).then((response) => {
                    //alert(response.data);
                    if (response.data.msg === 'ok') {
                        resolve();
                    } else {
                        reject();
                    }
                });
            });
        },

        updateUser(context, payload) {
            return new Promise((resolve, reject) => {
                axios.get('/server.php', {
                    params: {
                        action: 'update_user',
                        id: context.state.user.id,
                        name: payload.name,
                        country: payload.country, //<-- terrible practice, see updateDog
                        city: payload.city,
                        email: payload.email,
                        phone: payload.phone
                    }
                }).then((response) => {
                    //alert(response.data.msg);
                    if (response.data.msg === 'ok') {
                        context.commit('userUpdate', payload);
                        resolve();
                    } else {
                        reject();
                    }
                });
            });
        },

        getUserInfo(context) {   //REFRESH info about the current user and his dogs. -Very similar to getOwnerInfo
            return new Promise((resolve, reject) => {
                axios.get('/server.php', {params: {action: 'get_current_user'}}).then((response) => {
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
                    } else {
                        reject();
                    }
                })
            })
        },

        getOwnerInfo(context, ownerId) {   //LOAD owner AND his dogs (to owners, dogs)
            return new Promise((resolve, reject) => {
                axios.get('/server.php', {
                    params: {
                        action: 'get_owner_info',
                        ownerId: ownerId
                    }
                }).then((response) => {
                    context.commit('wipeData');
                    //alert(JSON.stringify(response.data));
                    let owner = response.data.owner;
                    let dogs = response.data.dogs;
                    if (response.data.msg === 'ok') {
                        context.commit('ownerPush', owner);
                        dogs.forEach(dog => {
                            context.commit('dogPush', dog);
                        });
                        resolve();
                    } else {
                        reject();
                    }
                })
            })
        },

   /*     getOwnerDogs(context, ownerId) {      //!! MAY BE UNUSED   !!IS USED RIGHT BELOW!!!      //LOAD owner's dogs AND (if it is user) reload user's dogs //may be not that necessary but whatever
            return new Promise((resolve, reject) => {
                axios.get('/server.php', {
                    params: {
                        action: 'get_owner_dogs',
                        ownerId: ownerId
                    }
                }).then((response) => {
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
                    } else {
                        reject();
                    }
                });
            });
        },*/

        newDog(context, payload) {
            return new Promise((resolve, reject) => {
                axios.get('/server.php', {params: {action: 'new_dog', dogInfo: payload}}).then((response) => {
                    if (response.data.msg === 'ok') {
                        let dogId = response.data.dog_id;
                        const newDog = payload;
                        newDog.id = dogId;
                        context.commit('dogPushUser', newDog);
                        resolve(dogId);
                    } else {
                        reject();
                    }
                });
            });
        },

        getDog(context, id) {
            return new Promise((resolve, reject) => {
                axios.get('/server.php', {params: {action: 'get_dog', dogId: id}}).then((response) => {
                    //alert(JSON.stringify(response.data));
                    if (response.data.msg === 'ok') {
                        let dog = response.data.dog;
                        dog.imgUrl = response.data.photo_url;
                        let owner = response.data.owner;
                        //alert(JSON.stringify(dog));
                        context.commit('wipeData');
                        context.commit('dogPush', dog);
                        context.commit('ownerPush', owner);
                        resolve();
                    } else {
                        reject();
                    }
                });
            });
        }
    }
}