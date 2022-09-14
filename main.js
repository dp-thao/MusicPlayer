const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const app = {
    songs: [],

    render: function() {
        console.log(123);
    },

    start : function() {
        this.render();
    },
}

app.start();