<template>
    <div class="flex-column">
        <div class="flex-row">
            <div class="text-up">{{getTitle}}</div>
            <div class="text-up push">{{isNoData ? '' : data.brand}}</div>
        </div>
        <div>
            <canvas v-bind:id="canvasId" v-bind:width="stripWidth*2" v-bind:height="stripHeight*2" class="canvas-style"></canvas>
        </div>
        <div class="flex-row">
            <div class="text-down">{{isNoData ? '' : data.date}}</div>
            <div class="text-down push">{{isNoData ? '' : 'Expire'+((daysLeft &lt; 0) ? 'd: ' : 's: ')+expires}}</div>   <!--this awesome &lt; is because Lint is against '<' -->
        </div>
    </div>
</template>

<script>
    export default {
        name: "Countdown",
        props: {
           // date: String,
           // duration: String,      //it refuses to get HTML parameter as a number
          //  title: String,
          //  brand: String,
            data: {},
        },
        data() {
          return {
              stripHeight: 42,
              stripWidth: 500,
              realWidth: 0,
              canvasEl: '',
          }
        },
        watch: {
            data() {
                this.canvasDraw();
            },
        },

        created() {
            window.addEventListener("resize", this.resizeHandler);
        },
        destroyed() {
            window.removeEventListener("resize", this.resizeHandler);
        },

        mounted() {
            this.resizeHandler();
        },
        computed: {

            isNoData() {
                return (!this.data.date || !this.data.duration);
            },

            canvasId() {
                return this.data?.code || 'kuk';
            },
            expires() {
                if (!this.isNoData) {
                    let date2 = new Date (this.data.date);
                    date2.setDate(date2.getDate()+Number(this.data.duration));
                    return date2.toISOString().substring(0, 10);
                } else {return 0;}
            },
            daysLeft() {
                let delta = new Date (new Date(this.data?.date) - new Date()); //delta in milliseconds
                let days = Math.round(delta/24/3600000 + Number(this.data?.duration));
                return days;
            },
            getTitle() {
                switch (this.data?.code) {
                    case '1':
                        return 'Flea and Tick';
                    case '2':
                        return 'Intestinal parasites';
                    case '3':
                        return 'Vaccination';
                    default:
                        return ''
                }
            },
        },

        methods: {
            resizeHandler() {
                this.getCanvasDOM();
                this.$nextTick(() => {
                    let newWidth = this.canvasEl.clientWidth;
                    if (this.stripWidth !== newWidth) {
                        this.stripWidth = this.canvasEl.clientWidth;
                        this.canvasDraw();
                    }
                });
            },

            getCanvasDOM() {
                this.canvasEl = document.getElementById(this.canvasId);
            },

            canvasDraw() {
                this.$nextTick(() => {
                    let canvasElement = document.getElementById(this.canvasId);
                    if (canvasElement) {
                        let days = (this.daysLeft < 0) ? 0 : this.daysLeft;
                        let width = this.stripWidth*2;
                        let height = this.stripHeight*2;
                        let strip = this.stripHeight*2-2; //strip fill height
                        let percentage = (days+1)/(Number(this.data?.duration)+1);
                        if (days === 0) {percentage = 0;}
                        let canvas = canvasElement.getContext("2d");
                        let r = Math.round(40+120*(1-percentage)).toString(16);
                        let g = Math.round(130+70*(percentage)).toString(16);
                        g = ("0" + g).slice(-2); //makes '01' instead of '1' etc
                        r = ("0" + r).slice(-2);
                        let b = "33";
                        canvas.fillStyle = "#"+r+g+b;
                        //canvas.translate(0.5, 0.5); // <-- this creates a mess while resizing
                        canvas.fillRect((width-2)*(1-percentage),2,(width-2)*percentage,strip-2);
                        canvas.strokeRect(1,1,width-2,height-2);
                        canvas.fillStyle = "#000000";
                        canvas.font="40px arial";
                        let letterS = Math.abs(this.daysLeft) === 1 ? '' : 's';
                        let timeLeftMsg = (days === 0)
                            ? `EXPIRED ${-this.daysLeft} day${letterS} ago`
                            : `${String(this.daysLeft)} day${letterS} left`;
                        if (this.isNoData) {
                            timeLeftMsg = 'NO DATA';
                        }
                        canvas.textBaseline = 'middle';
                        canvas.textAlign = "center";
                        canvas.fillText(timeLeftMsg, width/2, height/2);
                    }
                });
            }
        },
    }
</script>

<style scoped>
    body, html {
        margin: 0;
    }

    .push{
        margin-left: auto;
        padding-left: 10px;
    }

    .text-up {
        display: flex;
        font-size: 19px;
    }

    .text-down {
        display: flex;
        font-size: 13px;
    }

    .canvas-style {
        display: inline-block;
        width: 100%;
        image-rendering: crisp-edges;
    }

    @media screen and (max-width: 600px) {
        .text-up {
            font-size: 17px;
        }

        .text-down {
            font-size: 12px;
        }

    }
</style>