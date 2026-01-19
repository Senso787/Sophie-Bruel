const BASE_URL = "http://localhost:5678/api";

/* ----------------------------
   WORKS
---------------------------- */

// Récupérer tous les projets
export async function getWorks() {
  const response = await fetch(BASE_URL + "/works");
  if (!response.ok) {
    throw new Error("Impossible de récupérer les projets");
  }
  return response.json();
}

// Créer un projet
/**
 *Créer un projet
 * @param {string} formData
 * @param {string} token
 * @returns
 */
export async function createWork(formData, token) {
  const response = await fetch(BASE_URL + "/works", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Impossible de créer le projet");
  }

  return response.json();
}

// Supprimer un projet par son id
/**
 * Supprimer un projet "works" selon son id
 * @param {Number} id
 * @param {String} token
 * @returns boleen
 */
export async function deleteWork(id, token) {
  const response = await fetch(BASE_URL + "/works/" + id, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    throw new Error("Impossible de supprimer le projet");
  }

  return true;
}

/* ----------------------------
   CATEGORIES
---------------------------- */

// Récupérer toutes les catégories
export async function getCategories() {
  const response = await fetch(BASE_URL + "/categories");
  if (!response.ok) {
    throw new Error("Impossible de récupérer les catégories");
  }
  return response.json();
}

/* ----------------------------
   LOGIN
---------------------------- */

// Se connecter
export async function login(email, password) {
  const response = await fetch(BASE_URL + "/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Email ou mot de passe incorrect");
  }

  return response.json();
}
