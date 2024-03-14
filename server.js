import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

let users = [
  // users will be stored here
];

app.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = {
    id: uuidv4(),
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  };
  users.push(user);
  res.status(201).json({ message: "User registered successfully" });
});

// Définition d'une route POST pour la connexion des utilisateurs
app.post("/login", async (req, res) => {
  // Recherche de l'utilisateur dans le tableau 'users' en utilisant l'email fourni dans la requête
  const user = users.find((user) => user.email === req.body.email);

  // Si l'utilisateur n'est pas trouvé, renvoie une erreur 400
  if (user == null || undefined) {
    return res.status(400).send("Cannot find user");
  }
  try {
    // Si l'utilisateur est trouvé, compare le mot de passe fourni dans la requête avec le mot de passe haché de l'utilisateur
    if (await bcrypt.compare(req.body.password, user.password)) {
      // Création du payload du token avec les informations de l'utilisateur
      const userForToken = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      // Si les mots de passe correspondent, génère un token d'accès en utilisant JWT
      const accessToken = jwt.sign(
        userForToken,
        process.env.ACCESS_TOKEN_SECRET
      );

      // Stocke le token d'accès dans l'objet 'user'
      user.accessToken = accessToken;
      console.log(user.id);
      console.log(user.name);
      console.log(user.email);
      console.log(accessToken);
      // Renvoie le token d'accès dans la réponse
      res.json({
        accessToken: accessToken,
        id: user.id,
        name: user.name,
        email: user.email,
      });
    } else {
      // Si les mots de passe ne correspondent pas, renvoie une réponse "Not Allowed"
      res.send("Not Allowed");
    }
  } catch {
    // Si une erreur se produit lors de la comparaison des mots de passe ou de la génération du token, renvoie une erreur 500
    res.status(500).send();
  }
});
app.post("/logout", (req, res) => {
  console.log(req.body); // Log the entire request body
  console.log(req.body.email); // Log just the email

  // Trouver l'utilisateur basé sur un critère, par exemple l'email
  const user = users.find((user) => user.token === req.body.token);

  // Si l'utilisateur est trouvé
  if (user) {
    // Supprime le token d'accès de l'objet 'user'
    user.accessToken = null;
    console.error(user.accessToken);
    // Renvoie une réponse indiquant que la déconnexion a réussi
    res.send({ status: "success", message: "Logged out successfully" });
  } else {
    // Si l'utilisateur n'est pas trouvé, renvoie une erreur
    res.status(400).send("User not found");
  }
});

app.get("/users", (req, res) => {
  const usersWithoutPasswords = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    token: user.accessToken,
  }));
  res.json(usersWithoutPasswords);
});

// Définition d'une route GET pour la vérification des tokens
app.get("/verify-token", (req, res) => {
  // Récupération du header d'autorisation de la requête
  const authHeader = req.headers["authorization"];
  // Extraction du token du header d'autorisation
  const token = authHeader && authHeader.split(" ")[1];

  // Si aucun token n'est fourni, renvoie une erreur 401
  if (token == null) return res.sendStatus(401).send("No token provided");

  // Vérification du token avec JWT
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // Si une erreur se produit lors de la vérification, renvoie une erreur 403
    if (err) return res.sendStatus(403).send("Invalid token");
    // Si le token est valide, renvoie un statut de succès (200)
    res.json({ id: user.id, name: user.name, email: user.email });
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
