require("./bootstrap");

import {
    Button,
    HasError,
    AlertError,
    AlertErrors,
    AlertSuccess,
} from "vform/src/components/bootstrap5";
import Swal from "sweetalert2";

window.Vue = require("vue").default;

// sweetalert 2
window.Swal = Swal;

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
});
window.Toast = Toast;

// progressbar
import VueProgressBar from "vue-progressbar";

Vue.use(VueProgressBar, {
    color: "#198754",
    failedColor: "red",
    height: "2px",
    thickness: "5px",
    location: "top",
});

Vue.component(Button.name, Button);
Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);
Vue.component(AlertErrors.name, AlertErrors);
Vue.component(AlertSuccess.name, AlertSuccess);

Vue.component("pagination", require("laravel-vue-pagination"));
Vue.component(
    "example-component",
    require("./components/ExampleComponent.vue").default
);
Vue.component(
    "product-component",
    require("./components/ProductComponent.vue").default
);

const app = new Vue({
    el: "#app",
});
