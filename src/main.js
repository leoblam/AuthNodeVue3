import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import "./style.css";
import App from "./App.vue";

import HomeComponent from "./components/Home.vue";
import LoginComponent from "./components/Login.vue";
import RegisterComponent from "./components/Register.vue";
import Doggo from "./components/Doggo.vue";

const routes = [
  {
    path: "/",
    component: HomeComponent,
    children: [
      { path: "login", component: LoginComponent },
      { path: "register", component: RegisterComponent },
      { path: "doggo", component: Doggo },
    ],
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// const clickOutside = {
//   beforeMount: (el, binding) => {
//     el.clickOutsideEvent = (event) => {
//       if (!(el === event.target || el.contains(event.target))) {
//         binding.value(event);
//       }
//     };
//     document.body.addEventListener("click", el.clickOutsideEvent);
//   },
//   unmounted: (el) => {
//     document.body.removeEventListener("click", el.clickOutsideEvent);
//   },
// };

const app = createApp(App);
app.use(router);
// app.directive("click-outside", clickOutside);
app.mount("#app");
