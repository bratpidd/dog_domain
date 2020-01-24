<template>
    <div class="overview">
        <div class="pagename"><h2>Animal Passport</h2></div>
        <div class="page">
            <div class="passport-info"  v-if="!dogToView"><h1>Oops!<br><br>Noone lives here :(</h1></div>
            <div class="passport-info"  v-if="!!dogToView">
                <div class="passport-info-record">
                    <h1>{{dogToView ? dogToView.name : ""}}</h1>
                    <h3>{{dogToView ? dogToView.breed : ""}}</h3>
                    <h3>{{dogToView ? dogToView.sex : ""}}</h3>
                </div>
                <div class="passport-info-record">
                    <h2>Age: <span class="record">{{dogToView ? dogAge : ""}}</span></h2>
                    <div class="pushright">Birth Date: {{dogToView ? dogToView.birthDate : ""}}</div>
                </div>
                <div class="passport-info-record">
                    <h2>Color: <span class="record">{{dogToView ? dogToView.color : ""}}</span></h2>
                </div>
                <div class="passport-info-record">
                    <h2>Tattoo: <span class="record">{{dogToView ? dogToView.tattoo : ""}}</span></h2>
                </div>
                <div class="passport-info-record">
                    <h2>Owner: <span class="record">{{dogOwner ? dogOwner.name : ""}}</span></h2>
                    <div class="pushright">
                        {{dogOwner ? dogOwner.country : ""}}, {{dogOwner ? dogOwner.city : ""}} <br>
                        E-mail: {{dogOwner ? dogOwner.email : ""}} <br>
                        Phone: {{dogOwner ? dogOwner.phone : ""}}
                    </div>
                    <button class="button-commit" v-on:click="goToEdit" v-if="showEditButton">Edit</button>
                </div>

            </div>
            <div class="photo">PHOTO</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "overview",
        data() {
            return {
            }
        },
        computed: {
            userDogs() {
                return this.$store.getters.userDogs
            },
            dogToView() {
                let dog = this.$store.getters.dogById(Number(this.$route.params.dog_id));
                if (dog == null) {
                   // alert("null");
                }
                return dog;
            },
            dogAge() {
                let delta = new Date (new Date() - new Date(this.dogToView.birthDate)); //delta in milliseconds
                let years = delta.getFullYear()-1970;
                let months = delta.getMonth();
                return years + ' years, ' + months + ' months';
            },
            dogOwner() {
                return this.$store.getters.getOwner(this.dogToView.ownerId)
            },
            showEditButton() {
                return this.dogToView.ownerId === this.$store.state.userId;
            }
        },
        methods: {
            goToEdit() {
                this.$router.push({name: 'edit', params: {dog_id: this.$route.params.dog_id}});
            }
        }
    }
</script>

<style scoped>

    * {
        margin: 0;
        padding:0;
    }

    h1, h2 {
        margin-bottom: 5px;
        margin-top: 5px;
    }

    body {
        color: black;
    }

    .pagename {
        background-color: #333333;
        display:flex;
        height: 60px;
        padding-left: 0px;
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

    .photo {
        width: 200px;
        height: 300px;
        background-color: brown;
    }

    .passport-info {
        margin: 50px;
        line-height: 30px;
        display: flex;
        flex-direction: column;
        width: 600px;
    }

    .passport-info-record {
        position: relative;
        padding-bottom: 50px;
        width: 100%;
    }

    .record {
        color: brown;
    }

    .pushright{margin-left: 30px;}

    .button-commit {
        display: inline;
        height: 30px;
        width: auto;
        padding-left: 8px;
        padding-right: 8px;
        font-size: 20px;
        margin-top: 30px;
    }
</style>