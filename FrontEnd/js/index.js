import { getWorks, getCategories } from "./apiClient.js";

/* --------------------------------------------------
   INITIALISATION
--------------------------------------------------- */

async function init() {
  updateUIAuth();
  setupLogout();
  const works = await getWorks();
  await displayWorks(works);
  await setupFilters(works);
}

/* --------------------------------------------------
   AUTHENTIFICATION
-------------------------------------------------- */

function isLoggedIn() {
  return !!localStorage.getItem("token");
}

function updateUIAuth() {
  const editButton = document.querySelector(".edit-button");
  const logoutBtn = document.getElementById("logout-btn");

  if (!editButton) {
    console.error("Bouton Modifier introuvable dans le HTML !");
    return;
  }

  if (isLoggedIn()) {
    editButton.style.display = "inline-flex";
    logoutBtn.style.display = "block";
  } else {
    editButton.style.display = "none";
    logoutBtn.style.display = "none";
  }
}

/* -------------------------------------------------------
   LOGOUT
-------------------------------------------------- */

function setupLogout() {
  const logoutBtn = document.getElementById("logout-btn");
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    updateUIAuth();
  });
}

/* -------------------------------------------------------
   AFFICHAGE DES PROJETS
----------------------------------------------- */

async function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
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

function FilterButtons(categories) {
  const filtersContainer = document.createElement("div");
  filtersContainer.classList.add("filters");

  const portfolio = document.querySelector("#portfolio");
  const gallery = document.querySelector(".gallery");

  portfolio.insertBefore(filtersContainer, gallery);

  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  allButton.classList.add("active");
  allButton.dataset.categoryId = "all";
  filtersContainer.appendChild(allButton);

  categories.forEach((cat) => {
    const button = document.createElement("button");
    button.textContent = cat.name;
    button.dataset.categoryId = cat.id;
    filtersContainer.appendChild(button);
  });

  return filtersContainer;
}

async function setupFilters(allWorks) {
  const categories = await getCategories();
  const filtersContainer = FilterButtons(categories);

  const buttons = filtersContainer.querySelectorAll("button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const categoryId = button.dataset.categoryId;

      if (categoryId === "all") {
        displayWorks(allWorks);
      } else {
        const filtered = allWorks.filter(
          (work) => work.category.id == categoryId
        );
        displayWorks(filtered);
      }
    });
  });
}

/* ---------------------------------------------------
   LANCEMENT
------------------------------------------------------- */

init();
setupEditMode();
