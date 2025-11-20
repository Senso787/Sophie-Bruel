import { getWorks, getCategories } from "./apiClient.js";

/* ----------------------------------------------------
   INITIALISATION
---------------------------------------------------- */

async function init() {
  const works = await getWorks();
  await displayWorks(works);
  await setupFilters();
}

/* ----------------------------------------------------
   AFFICHAGE DES PROJETS
---------------------------------------------------- */

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

/* ----------------------------------------------------
   FILTRES
---------------------------------------------------- */

async function setupFilters() {
  const works = await getWorks();
  const categories = await getCategories();

  const filtersContainer = document.createElement("div");
  filtersContainer.classList.add("filters");

  const portfolio = document.querySelector("#portfolio");
  const gallery = document.querySelector(".gallery");
  portfolio.insertBefore(filtersContainer, gallery);

  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  allButton.classList.add("active");
  filtersContainer.appendChild(allButton);

  categories.forEach((cat) => {
    const button = document.createElement("button");
    button.textContent = cat.name;
    button.dataset.categoryId = cat.id;
    filtersContainer.appendChild(button);
  });

  // Gestion des clics
  const buttons = filtersContainer.querySelectorAll("button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      if (button.textContent === "Tous") {
        displayWorks(works);
      } else {
        const filtered = works.filter(
          (work) => work.category.name === button.textContent
        );
        displayWorks(filtered);
      }
    });
  });
}

init();
