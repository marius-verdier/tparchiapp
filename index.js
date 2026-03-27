const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.static("public"));

let allMsgs = [
  {
    pseudo: "Alice",
    texte: "Bonjour à tous !",
    date: "2026-03-06 09:00"
  },
  {
    pseudo: "Bob",
    texte: "Bienvenue sur le site de messages.",
    date: "2026-03-06 09:10"
  },
  {
    pseudo: "Charlie",
    texte: "Le HTML structure la page.",
    date: "2026-03-06 09:20"
  }
];

// Route test
app.get("/test/*splat", function (req, res) {
  res.json({ msg: req.params.splat });
});

// Récupérer tous les messages
app.get("/msg/getAll", function (req, res) {
  res.json(allMsgs);
});

// Nombre de messages
app.get("/msg/nber", function (req, res) {
  res.json(allMsgs.length);
});

// Récupérer un message par id
app.get("/msg/get/:id", function (req, res) {
  const id = parseInt(req.params.id, 10);

  if (!Number.isInteger(id) || id < 0 || id >= allMsgs.length) {
    res.json({ code: 0 });
    return;
  }

  res.json({ code: 1, msg: allMsgs[id] });
});

// Poster un message
app.get("/msg/post/*splat", function (req, res) {
  try {
    const messageBrut = decodeURIComponent(req.params.splat);
    const messageObjet = JSON.parse(messageBrut);

    if (
      !messageObjet ||
      typeof messageObjet.pseudo !== "string" ||
      typeof messageObjet.texte !== "string" ||
      typeof messageObjet.date !== "string"
    ) {
      res.json({ code: 0 });
      return;
    }

    allMsgs.push(messageObjet);
    res.json({ code: 1, id: allMsgs.length - 1 });
  } catch (e) {
    res.json({ code: 0 });
  }
});

// Supprimer un message
app.get("/msg/del/:id", function (req, res) {
  const id = parseInt(req.params.id, 10);

  if (!Number.isInteger(id) || id < 0 || id >= allMsgs.length) {
    res.json({ code: 0 });
    return;
  }

  allMsgs.splice(id, 1);
  res.json({ code: 1 });
});

app.listen(PORT, function () {
  console.log("Serveur lancé sur http://localhost:" + PORT);
});
