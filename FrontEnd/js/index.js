import { getWorks, getCategories } from "./apiClient.js";

/* --------------------------------------------------
   VARIABLES GLOBALES
--------------------------------------------------- */
let allWorks = [];
let currentCategory = "all";

/* --------------------------------------------------
   INITIALISATION
--------------------------------------------------- */
async function init() {
  updateUIAuth();
  allWorks = await getWorks();
  await displayWorks(allWorks);
  await setupFilters();
}

/* --------------------------------------------------
   AUTHENTIFICATION
-------------------------------------------------- */
function isLoggedIn() {
  return !!localStorage.getItem("token");
}

function updateUIAuth() {
  const loginLink = document.getElementById("id-login");
  const editButton = document.getElementById("btn-modifier-projets");

  if (!loginLink) return;

  if (isLoggedIn()) {
    // ===== CONNECTÉ =====
    loginLink.textContent = "logout";
    loginLink.removeAttribute("href");
    loginLink.style.cursor = "pointer";

    if (editButton) editButton.style.display = "inline-flex";

    loginLink.onclick = (e) => {
      e.preventDefault(); // 🔥 BLOQUE TOUTE NAVIGATION
      localStorage.removeItem("token");
      updateUIAuth();
    };
  } else {
    // ===== DÉCONNECTÉ =====
    loginLink.textContent = "login";
    loginLink.href = "login.html";
    loginLink.style.cursor = "pointer";

    if (editButton) editButton.style.display = "none";

    loginLink.onclick = null; // comportement normal du lien
  }
}

/* -------------------------------------------------------
   AFFICHAGE DES PROJETS
----------------------------------------------- */
async function displayWorks(works) {
  const gallery = document.getElementById("id-gallery");
  gallery.innerHTML = "";

  works.forEach((work) => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const caption = document.createElement("figcaption");
    caption.textContent = work.title || "Sans titre";

    figure.appendChild(img);
    figure.appendChild(caption);

    gallery.appendChild(figure);
  });
}

/* -----------------------------------------------------
   FILTRES
--------------------------------------------------------- */
async function setupFilters() {
  const categories = await getCategories();
  const filtersContainer = document.getElementById("id-filters");

  if (!filtersContainer) return;

  filtersContainer.innerHTML = "";

  // Bouton Tous
  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  allButton.classList.add("active");
  allButton.dataset.categoryId = "all";
  filtersContainer.appendChild(allButton);

  // Boutons catégories
  categories.forEach((cat) => {
    const button = document.createElement("button");
    button.textContent = cat.name;
    button.dataset.categoryId = cat.id;
    filtersContainer.appendChild(button);
  });

  // Gestion clics
  const buttons =
    filtersContainer.querySelectorAll(
      "button"
    ); /* remplacer par getelementbyId*/
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      currentCategory = button.dataset.categoryId;
      applyFilter();
    });
  });
}

// Appliquer le filtre actuel
function applyFilter() {
  if (currentCategory === "all") {
    displayWorks(allWorks);
  } else {
    const filtered = allWorks.filter(
      (work) => work.category.id == currentCategory
    );
    displayWorks(filtered);
  }
}

/* ---------------------------------------------------
   RAFRAÎCHIR GALERIE (pour modale)
--------------------------------------------------- */
window.refreshGallery = async function () {
  allWorks = await getWorks();
  applyFilter(); // réappliquer le filtre actif
};

/* ---------------------------------------------------
   LANCEMENT
------------------------------------------------------- */
init();
setupEditMode();
