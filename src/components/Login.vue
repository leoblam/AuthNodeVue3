<template>
  <form @submit.prevent="login" class="lr-form">
    <div class="form-group">
      <label for="email">Email:</label>
      <input
        type="email"
        id="email"
        v-model="email"
        placeholder="Entrez votre email ici"
        required
      />
    </div>
    <div class="form-group">
      <label for="password">Password:</label>
      <input
        type="password"
        id="password"
        v-model="password"
        placeholder="Entrez votre mot de passe ici"
        required
      />
    </div>
    <button type="submit" class="submit-button">Se connecter</button>
  </form>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    login() {
      let email = this.email;
      let password = this.password;

      axios
        .post("http://localhost:3000/login", { email, password })
        .then((response) => {
          console.log("Emitting login-success event");
          this.$emit("login-success");
          // Handle successful login here, e.g. by storing the returned token and redirecting
          localStorage.setItem("token", response.data.accessToken);
          this.$router.push("/");
        })
        .catch((err) => {
          // Handle error here
          console.log(err);
        });
    },
  },
};
</script>

<style scoped></style>
