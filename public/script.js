function fact(n) {
  if (n < 0) {
    throw new Error("La factorielle n'est pas définie pour un entier négatif.");
  }

  if (n === 0 || n === 1) {
    return 1;
  }

  let resultat = 1;
  for (let i = 2; i <= n; i++) {
    resultat *= i;
  }
  return resultat;
}

function applique(tab, f) {
  const resultat = [];
  for (let i = 0; i < tab.length; i++) {
    resultat.push(f(tab[i]));
  }
  return resultat;
}

console.log("Factorielle de 6 :", fact(6));

const nombres = [1, 2, 3, 4, 5];
console.log("Factorielle du tableau :", applique(nombres, fact));
console.log(
  "Tableau multiplié par 2 avec fonction non nommée :",
  applique(nombres, function (x) {
    return x * 2;
  })
);

const messageList = document.getElementById("messageList");
const sendBtn = document.getElementById("sendBtn");
const refreshBtn = document.getElementById("refreshBtn");
const themeBtn = document.getElementById("themeBtn");
const pseudoInput = document.getElementById("pseudo");
const messageInput = document.getElementById("messageInput");

function formatDate(date) {
  const annee = date.getFullYear();
  const mois = String(date.getMonth() + 1).padStart(2, "0");
  const jour = String(date.getDate()).padStart(2, "0");
  const heures = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${annee}-${mois}-${jour} ${heures}:${minutes}`;
}

function supprimerMessage(id) {
  fetch("/msg/del/" + id)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.code !== 1) {
        alert("Suppression impossible.");
        return;
      }

      chargerMessages();
    })
    .catch(function (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Impossible de supprimer le message.");
    });
}

function update(tableauMessages) {
  messageList.innerHTML = "";

  for (let i = 0; i < tableauMessages.length; i++) {
    const msg = tableauMessages[i];

    const li = document.createElement("li");
    li.className = "message-item";

    const header = document.createElement("div");
    header.className = "message-header";

    const author = document.createElement("span");
    author.className = "message-author";
    author.textContent = msg.pseudo;

    const date = document.createElement("span");
    date.className = "message-date";
    date.textContent = msg.date;

    const text = document.createElement("p");
    text.className = "message-text";
    text.textContent = msg.texte;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Supprimer";
    deleteBtn.type = "button";

    deleteBtn.addEventListener("click", function () {
      const confirmation = confirm("Voulez-vous vraiment supprimer ce message ?");
      if (confirmation) {
        supprimerMessage(i);
      }
    });

    header.appendChild(author);
    header.appendChild(date);

    li.appendChild(header);
    li.appendChild(text);
    li.appendChild(deleteBtn);

    messageList.appendChild(li);
  }
}

function chargerMessages() {
  fetch("/msg/getAll")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      update(data);
    })
    .catch(function (error) {
      console.error("Erreur lors du chargement des messages :", error);
      alert("Impossible de charger les messages.");
    });
}

function ajouterMessage() {
  const pseudo = pseudoInput.value.trim();
  const texte = messageInput.value.trim();

  if (pseudo === "" || texte === "") {
    alert("Veuillez remplir le pseudo et le message.");
    return;
  }

  const nouveauMessage = {
    pseudo: pseudo,
    texte: texte,
    date: formatDate(new Date())
  };

  const messageEncode = encodeURIComponent(JSON.stringify(nouveauMessage));

  fetch("/msg/post/" + messageEncode)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.code !== 1) {
        alert("Erreur lors de l'envoi du message.");
        return;
      }

      pseudoInput.value = "";
      messageInput.value = "";
      chargerMessages();
    })
    .catch(function (error) {
      console.error("Erreur lors de l'envoi du message :", error);
      alert("Impossible d'envoyer le message.");
    });
}

function changerTheme() {
  document.body.classList.toggle("dark");
}

sendBtn.addEventListener("click", ajouterMessage);
refreshBtn.addEventListener("click", chargerMessages);
themeBtn.addEventListener("click", changerTheme);

chargerMessages();
