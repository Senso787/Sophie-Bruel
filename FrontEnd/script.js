// script.js
// Récupération des projets depuis l'API
async function recupererProjets() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const projets = await response.json();
    console.log("Projets récupérés :", projets);
    return projets;
  } catch (error) {
    console.error("Erreur lors de la récupération des projets :", error);
    return [];
  }
}

// Fonction pour afficher les projets dans la galerie
function afficherProjets(projets) {
  const galerie = document.querySelector(".gallery");
  galerie.innerHTML = ""; // On vide la galerie

  projets.forEach((projet) => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = projet.imageUrl;
    img.alt = projet.title;

    const legende = document.createElement("figcaption");
    legende.textContent = projet.title;

    figure.appendChild(img);
    figure.appendChild(legende);
    galerie.appendChild(figure);
  });
}

// Fonction pour générer dynamiquement les filtres
function creerFiltres(projets) {
  const conteneurFiltres = document.querySelector(".filters");
  conteneurFiltres.innerHTML = ""; // Nettoyage avant génération

  // On commence avec la catégorie "Tous"
  const categories = [{ id: "all", name: "Tous" }];

  // Parcours des projets pour remplir les catégories
  for (let i = 0; i < projets.length; i++) {
    const cat = projets[i].category;
    // Si la catégorie existe et qu'elle n'est pas déjà dans le tableau
    let existe = false;
    for (let j = 0; j < categories.length; j++) {
      if (categories[j].id === cat?.id) {
        existe = true;
        break;
      }
    }
    if (cat && !existe) {
      categories.push(cat);
    }
  }

  categories.forEach((category) => {
    const bouton = document.createElement("button");
    bouton.textContent = category.name;
    bouton.classList.add("filter-btn");

    if (category.id === "all") bouton.classList.add("active");

    bouton.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((btn) => btn.classList.remove("active"));
      bouton.classList.add("active");

      const projetsFiltres =
        category.id === "all"
          ? projets
          : projets.filter(
              (projet) => projet.category && projet.category.id === category.id
            );

      afficherProjets(projetsFiltres);
    });

    conteneurFiltres.appendChild(bouton);
  });
}

(async function init() {
  const projets = await recupererProjets();
  creerFiltres(projets);
  afficherProjets(projets);
})();

const formulaire = document.getElementById("login-form");
const messageErreur = document.getElementById("error-message");

formulaire.addEventListener("submit", async (e) => {
  e.preventDefault();

  messageErreur.classList.remove("visible");

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      window.location.href = "index.html";
    } else {
      messageErreur.classList.add("visible");
    }
  } catch (error) {
    console.error("Erreur de connexion:", error);
    messageErreur.classList.add("visible");
  }
});
