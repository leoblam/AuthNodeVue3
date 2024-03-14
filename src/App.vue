<template>
  <div>
    <div v-show="isLoggedIn" style="position: fixed; top: 2rem; right: 2rem">
      <button @click="logout">Se deconnecter</button>
    </div>
    <div style="position: fixed; top: 2rem; right: 2rem">
      <div v-show="!isLoggedIn">
        <div class="button-container">
          <button
            @click.stop="
              showLoginForm = true;
              showRegisterForm = false;
            "
          >
            Se connecter
          </button>
          <button
            @click.stop="
              showRegisterForm = true;
              showLoginForm = false;
            "
          >
            Creer un compte
          </button>
          <!-- <button @click="$emit('close')">X</button> -->
        </div>
        <!-- <div v-click-outside="hideForms"> -->
        <RegisterFormVue
          v-if="showRegisterForm"
          @close="showRegisterForm = false"
        />
        <LoginFormVue
          v-if="showLoginForm"
          @close="showLoginForm = false"
          @login-success="isLoggedIn = true"
        />
      </div>
    </div>
  </div>
  <div>
    <p>Email de l'utilisateur : {{ userEmail }}</p>
  </div>
</template>

<script>
import RegisterFormVue from "./components/Register.vue";
import LoginFormVue from "./components/Login.vue";
import axios from "axios";

export default {
  data() {
    return {
      showRegisterForm: false,
      showLoginForm: false,
      isLoggedIn: true,
      userEmail: null,
    };
  },
  watch: {
    isLoggedIn(newVal, oldVal) {
      console.log("isLoggedIn updated from", oldVal, "to", newVal);
    },
  },

  created() {
    this.checkTokenValidity();
  },
  methods: {
    // Cette fonction vérifie la validité du token stocké dans le localStorage
    async checkTokenValidity() {
      // Récupère le token du localStorage
      const token = localStorage.getItem("token");
      console.log("Token found in localStorage:", token);
      // Si un token est trouvé
      if (token) {
        try {
          // Envoie une requête GET à l'endpoint '/verify-token' du serveur avec le token dans les headers d'autorisation
          const response = await axios.get("/verify-token", {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("User ID:", response.data.id);
          console.log("User Email:", response.data.email);
          console.log("User Name:", response.data.name);
          console.log("Response Status:", response.status);
          // Si le serveur répond avec un statut de succès (200), cela signifie que le token est valide
          if (response.status === 200) {
            this.id = response.data.id;
            this.userEmail = response.data.email;
            this.username = response.data.name;
            this.isLoggedIn = true;
            console.log(this.id, this.userEmail, response.data.name);
            console.log("Try if");
          } else {
            // Si le serveur ne répond pas avec un statut de succès, cela signifie que le token n'est pas valide
            this.isLoggedIn = false;
            console.log("Token is not valid");
            console.log("Try else");
          }
        } catch (error) {
          // Si une erreur se produit lors de l'envoi de la requête au serveur, cela signifie que le token n'est pas valide
          this.isLoggedIn = false;
          console.error("Error while verifying token:", error);
          console.log("Catch");
        }
      } else {
        // Si aucun token n'est trouvé dans le localStorage, cela signifie que l'utilisateur n'est pas connecté
        this.isLoggedIn = false;
        console.log("No token found in localStorage");
      }
    },
    hideForms() {
      this.showRegisterForm = false;
      this.showLoginForm = false;
    },
    login() {
      hideForms();
      // Mettez à jour isLoggedIn lorsque l'utilisateur se connecte
      this.isLoggedIn = true;
    },
    async logout() {
      // supprimer le token enregistré dans le serveur
      await axios.post("http://localhost:3000/logout", {
        token: localStorage.getItem("token"),
      });
      // Mettez à jour isLoggedIn lorsque l'utilisateur se déconnecte
      this.isLoggedIn = false;
    },
  },
  components: {
    RegisterFormVue,
    LoginFormVue,
  },
};
</script>
<style>
template {
  width: 100vw;
}
.button-container {
  gap: 0.5rem;
  display: flex;
  padding-bottom: 0.5rem;
  width: 384px;
  justify-content: space-between;
}
</style>
./components/Doggo.vue
