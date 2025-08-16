const express = require("express");
const fetch = require("node-fetch");
const app = express();

const CLIENT_ID = "TON_CLIENT_ID";
const CLIENT_SECRET = "TON_CLIENT_SECRET";
const REDIRECT_URI = "https://project-delta.fr/project-igma.html";

app.get("/callback", async (req, res) => {
    const code = req.query.code;
    const data = await fetch("https://discord.com/api/oauth2/token", {
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
    }).then(r => r.json());

    const user = await fetch("https://discord.com/api/users/@me", {
        headers: { "Authorization": `Bearer ${data.access_token}` }
    }).then(r => r.json());

    res.send(`<h1>Bienvenue ${user.username}</h1><img src="https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128">`);
});

app.listen(3000, () => console.log("Serveur lancé sur http://localhost:3000"));
