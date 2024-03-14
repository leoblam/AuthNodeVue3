<template>
  <form @submit.prevent="register" class="lr-form">
    <div class="form-group">
      <label for="username">Nom d'utilisateur :</label>
      <input
        type="text"
        id="username"
        v-model="username"
        placeholder="Entrez votre nom d'utilisateur ici"
        required
      />
    </div>
    <div class="form-group">
      <label for="email">Email :</label>
      <input
        type="email"
        id="email"
        v-model="email"
        placeholder="Entrez votre email ici"
        required
      />
    </div>
    <div class="form-group">
      <label for="password">Mot de passe :</label>
      <input
        type="password"
        id="password"
        v-model="password"
        placeholder="Entrez votre mot de passe ici"
        required
      />
    </div>
    <div class="form-group">
      <label for="password-confirm">Confirmation de mot de passe ::</label>
      <input
        type="password"
        id="password-confirm"
        v-model="password_confirmation"
        placeholder="Confirmez votre mot de passe ici"
        required
      />
    </div>
    <button type="submit" class="submit-button">Creer un compte</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      is_admin: null,
    };
  },
  methods: {
    async submitForm() {
      if (this.password !== this.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      try {
        const response = await axios.post("http://localhost:3000/register", {
          name: this.username,
          email: this.email,
          password: this.password,
          isAdmin: this.isAdmin,
        });
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
