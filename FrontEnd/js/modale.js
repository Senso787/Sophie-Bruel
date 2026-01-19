import {
  getWorks,
  getCategories,
  createWork,
  deleteWork,
} from "./apiClient.js";

const btnModifier = document.getElementById("btn-modifier-projets");
const overlay = document.getElementById("modal-overlay");
const container = document.getElementById("modal-container");

/* ------------------------------------------------------
   INIT
--------------------------------------------------------- */
function initModal() {
  btnModifier.addEventListener("click", openModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
}

/* ------------------------------------------------------
   OUVERTURE / FERMETURE MODALE
-------------------------------------------------- */
function openModal() {
  overlay.style.display = "flex";
  showGallery();
}

function closeModal() {
  overlay.style.display = "none";
}

/* -------------------------------------------------------
   AFFICHAGE GALERIE
----------------------------------------------------------- */
async function showGallery() {
  container.innerHTML = `
    <div class="modal-header">
      <h2>Galerie photo</h2>
      <span class="modal-close">&times;</span>
    </div>

    <div class="modal-gallery"></div>
     <div class="modal-divider"></div>

    <button id="open-add-modal" class="modal-btn-primary">Ajouter une photo</button>
  `;

  container.querySelector(".modal-close").addEventListener("click", closeModal);
  container
    .querySelector("#open-add-modal")
    .addEventListener("click", showAddForm);

  const works = await getWorks();
  const modalGallery = container.querySelector(".modal-gallery");

  works.forEach((work) => {
    const item = document.createElement("div");
    item.classList.add("modal-item");
    item.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}">
      <button class="modal-delete" data-id="${work.id}"><i class="fa-solid fa-trash-can"></i></button>
    `;
    modalGallery.appendChild(item);
  });

  container.querySelectorAll(".modal-delete").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const token = localStorage.getItem("token");
      try {
        await deleteWork(id, token);
        showGallery();
        window.refreshGallery();
      } catch (err) {
        alert("Erreur lors de la suppression");
        console.error(err);
      }
    });
  });
}

/* ----------------------------------------------------
   FORMULAIRE AJOUT PHOTO
-------------------------------------------------- */
async function showAddForm() {
  const categories = await getCategories();

  let categoryOptions = '<option value="">-- Choisir --</option>';
  for (let i = 0; i < categories.length; i++) {
    categoryOptions +=
      '<option value="' +
      categories[i].id +
      '">' +
      categories[i].name +
      "</option>";
  }

  container.innerHTML = `
    <div class="modal-header">
      <span class="modal-back">&larr;</span>
      <h2>Ajout photo</h2>
      <span class="modal-close">&times;</span>
    </div>

    <form class="modal-form">
      <div class="modal-upload">
        <div class="upload-preview" id="preview-container">
         <span class="upload-placeholder">
            <i class="fa-regular fa-image"></i>
            <button type="button" class="upload-btn">+ Ajouter photo</button>
            <span class="upload-help">jpg, png : 4mo max</span>
        </span>
        </div>
        <input type="file" id="image-input" accept="image/*" hidden>
      </div>

      <label>Titre</label>
      <input type="text" id="title-input">

      <label>Catégorie</label>
      <select id="category-input">
        ${categoryOptions}
      </select>

      <div class="modal-divider"></div>
      <button id="submit-photo" class="modal-btn-disabled" disabled>Valider</button>
    </form>
      `;

  container.querySelector(".modal-close").addEventListener("click", closeModal);
  container.querySelector(".modal-back").addEventListener("click", showGallery);

  const titleInput = container.querySelector("#title-input");
  const selectCat = container.querySelector("#category-input");
  const submitBtn = container.querySelector("#submit-photo");
  const imageInput = container.querySelector("#image-input");
  const preview = container.querySelector("#preview-container");

  preview.addEventListener("click", () => imageInput.click());

  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 4 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      alert("Format invalide. Seuls les fichiers JPG et PNG sont autorisés.");
      imageInput.value = "";
      return;
    }

    if (file.size > maxSize) {
      alert("Fichier trop volumineux. Taille maximale : 4 Mo.");
      imageInput.value = "";
      return;
    }

    preview.innerHTML = "";
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    preview.appendChild(img);

    validateForm();
  });

  function validateForm() {
    if (titleInput.value && selectCat.value && imageInput.files.length > 0) {
      submitBtn.disabled = false;
      submitBtn.className = "modal-btn-disabled enabled";
    } else {
      submitBtn.disabled = true;
      submitBtn.className = "modal-btn-disabled";
    }
  }

  titleInput.addEventListener("input", validateForm);
  selectCat.addEventListener("change", validateForm);

  container
    .querySelector(".modal-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", imageInput.files[0]);
      formData.append("title", titleInput.value);
      formData.append("category", selectCat.value);

      try {
        await createWork(formData, token);
        showGallery();
        window.refreshGallery();
      } catch (err) {
        alert("Erreur lors de l'ajout du projet");
        console.error(err);
      }
    });
}

/* ----------------------------------------------------
   DÉMARRAGE
---------------------------------------------------- */
document.addEventListener("DOMContentLoaded", initModal);
