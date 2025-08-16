// server.js
import express from "express";
import fetch from "node-fetch";

const app = express();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.get("/callback", async (req, res) => {
    try {
        const code = req.query.code;
        if (!code) return res.status(400).send("Code manquant dans la requête");

        // Récupération du token OAuth2
        const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: "authorization_code",
                code,
                redirect_uri: REDIRECT_URI,
                scope: "identify"
            })
        });

        const data = await tokenResponse.json();

        if (data.error) {
            return res.status(400).send(`Erreur OAuth2 : ${data.error_description || data.error}`);
        }

        // Récupération des informations de l'utilisateur
        const userResponse = await fetch("https://discord.com/api/users/@me", {
            headers: { "Authorization": `Bearer ${data.access_token}` }
        });

        const user = await userResponse.json();

        // Affichage simple
        res.send(`
            <h1>Bienvenue ${user.username}</h1>
            <img src="https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128">
        `);

    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
});

app.listen(3000, () => console.log("Serveur lancé sur http://localhost:3000"));
