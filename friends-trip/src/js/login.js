import $ from "jquery";
import app from "./app.js";

import "../styles/app.less";

function signin() {
  app.login(username.value, password.value);
}

function register() {
  app.register(username.value, password.value);
}

function onPageLoaded() {
  document.forms.login.onsubmit = function(event) {
    event.preventDefault();
    return false;
  };

  document.querySelector(".btn-login").addEventListener("click", signin);
  document.querySelector(".btn-login").addEventListener("click", register);
}

$(function() {
  app.init();
  onPageLoaded();
});
