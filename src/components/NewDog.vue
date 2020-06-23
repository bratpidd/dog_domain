<template>
    <div class="overview">
        <div class="pagename">
            <div class="page-title">
                <h2 v-if="editAllowed">Edit Your Pet Info</h2>
                <h2 v-if="newDogAllowed">Register A New Dog</h2>
            </div>
        </div>
        <div class="page" v-if="dataLoaded">
            <div class="passport-info">
                <div class="flex-row lowres-column">
                    <div class="passport-info-record">
                        <form name="fuckoff" autocomplete="off">
                                <div class="wannabe-h3">Name: </div><input autocomplete="jdty" v-model="dogInput.name"><br>
                                <div class="wannabe-h3">Breed: </div><input autocomplete="hasdf" v-model="dogInput.breed"><br>
                                <div class="wannabe-h3">Sex: </div>
                                <select id="sex" v-model="dogInput.sex">
                                    <option>Male</option>
                                    <option>Female</option>
                                </select><br>
                                <div class="wannabe-h3">Birth Date: </div><input autocomplete="ogds" type="date" v-model="dogInput.birthdate"><br>
                                <div class="wannabe-h3">Color: </div><input autocomplete="nfgcv" v-model="dogInput.color"><br>
                                <div class="wannabe-h3">Tattoo: </div><input autocomplete="jjfds" v-model="dogInput.tattoo"><br>
                        </form>
                        <div class="lowres-hidden" style="display: flex; margin-top: 15px;">
                            <button class="button-commit" v-on:click="commitNewDog" v-if="newDogAllowed">Create Profile</button>
                            <button class="button-commit" v-on:click="commitUpdate" v-if="editAllowed">Save</button>
                        </div>
                    </div>
                    <div class="photo" v-on:click="photoClick" id="photo" style="cursor: pointer" v-bind:class="{'no-photo': !imagePresent}">
                        <img class="image-photo" id="image-photo" :src="dogInput.imgUrl">
                        <div class="photo-placeholder" v-if="!imagePresent">Click to add photo</div>
                        <div class="under-photo" v-if="imagePresent">Click to change</div>
                    </div>
                </div>
                <div class="lowres-shown" style="display: none">
                    <button class="button-commit" v-on:click="commitNewDog" v-if="newDogAllowed">Create Profile</button>
                    <button class="button-commit" v-on:click="commitUpdate" v-if="editAllowed">Save</button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "newDog",
        mounted() {
            this.$root.$on('new_dog_clicked',() => {
                this.resetInputs();
            });
            if (this.editAllowed) {
                this.$store.dispatch('getDog', this.$route.params.dog_id).then(() => {
                    this.dogInput = JSON.parse(JSON.stringify(this.$store.state.dogs[0]));
                    this.imagePresent = this.dogInput.imgUrl !== '';
                    this.dataLoaded = true;
                });
            }
            if (this.newDogAllowed) {
                this.dataLoaded = true;
            }
        },
        data () {
            return {
                dogInput: {
                    name: "",
                    breed: "",
                    sex: "",
                    birthdate: "",
                    color: "",
                    tattoo: "",
                    imgUrl: '',
                },
                imagePresent: false,
                dogImage: false,
                dataLoaded: false,
            }
        },
        computed: {
            dogToEdit() {
                return this.$store.getters.dogById(Number(this.$route.params.dog_id))
            },
            editAllowed() {
                return this.$route.name === 'dog_edit';
            },
            newDogAllowed() {
                return this.$route.name === 'dog_new';
            },
        },
        methods: {
            photoClick() {
                let input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/jpeg,image/png,image/gif';

                // eslint-disable-next-line no-unused-vars
                input.onchange = (e => {
                    // getting a hold of the file reference
                    let file = e.target.files[0];

                    // setting up the reader
                    let reader = new FileReader();
                    reader.readAsDataURL(file); // this is reading as data url

                    // here we tell the reader what to do when it's done reading...
                    reader.onload = readerEvent => {
                        let content = readerEvent.target.result; // this is the content!
                        let img = new Image();
                        img.src = content;

                        img.onload = (() => {
                            //resizing the input image
                            let w = img.naturalWidth;
                            let h = img.naturalHeight;
                            let maxW = 300, maxH = 300;         //image size constraints
                            let aspectRatio = w / h;
                            let targetW, targetH;               //calculated image size
                            if ((w > maxW) || (h > maxH)) {
                                let excessW = w / maxW; //overflow percentage in given dimension
                                let excessH = h / maxH;
                                //the more excessful side is bound to its max constraint
                                targetW = excessW > excessH ? maxW : maxH * aspectRatio;
                                targetH = targetW / aspectRatio;
                            } else {
                                targetW = w;
                                targetH = h;
                            }

                            let canvas = document.createElement('canvas');
                            let canvasContext = canvas.getContext('2d');
                            canvas.setAttribute("style", 'opacity:0;position:absolute;z-index:-1;top: -100000000;left:-1000000000;width:' + targetW + 'px;height:' + targetH + 'px;');
                            canvas.setAttribute('height', targetH);
                            canvas.setAttribute('width', targetW);
                            document.body.appendChild(canvas);
                            canvasContext.drawImage(img, 0, 0, targetW, targetH);
                            let base64Image = canvas.toDataURL('image/png'); //this is server-ready data
                            let photo = document.getElementById('image-photo');
                            photo.src = base64Image;
                            this.dogImage = base64Image;
                            document.body.removeChild(canvas);
                            URL.revokeObjectURL(img.src);
                        });

                        this.imagePresent = true;
                    }
                });
                input.click();
            },

            commitNewDog() {
                let objectToPass = JSON.parse(JSON.stringify(this.dogInput));   //prevent dogInput from being linked to vuex store (although it must be safe here)
                if (this.newDogAllowed) {
                    this.$store.dispatch('newDog', objectToPass).then((dogId) => {
                        let imgPayload = {
                            image: this.dogImage,
                            entity: 'dog',
                            id: dogId
                        };
                        this.$store.dispatch('uploadImage', imgPayload);
                    });
                }
            },

            commitUpdate() {
                let objectToPass = JSON.parse(JSON.stringify(this.dogInput));   //need to prevent dogInput from being linked to vuex store. although it must be already unlinked, see "created" below
                let redirectIndex = String(this.dogInput.id);
                this.$store.dispatch('updateDog', objectToPass).then(() => {
                    let imgPayload = {
                        image: this.dogImage,
                        entity: 'dog',
                        id: this.dogInput.id
                    };
                    this.$store.dispatch('uploadImage', imgPayload);
                    this.$store.dispatch('getUserInfo');
                    if (this.editAllowed) {
                        //this.$store.commit('dogUpdate', objectToPass);
                        this.$router.push({path: `/dog/${redirectIndex}/passport`})
                    }
                });
            },

            resetInputs() {
                this.dogInput = {
                    name: "",
                    breed: "",
                    sex: "",
                    birthdate: "",
                    color: "",
                    tattoo: "",
                }
            }
        },
    }
</script>

<style scoped>

    h1, h2, h3, h4 {
        margin-bottom: 5px;
        margin-top: 5px;
        display: inline;
    }

    .wannabe-h3 {
        width: 130px;
        font-size: 1.17em;
        font-weight: bolder;
        display: inline-block;
    }

    .under-photo {
        line-height: 30px;
        align-self: center;
    }

    body {
        color: black;
    }

    @media screen and (max-width: 600px) {

    }

</style>