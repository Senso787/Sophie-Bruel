import { login } from "./apiClient.js";

const form = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const data = await login(email, password);
    localStorage.setItem("token", data.token);
    window.location.href = "index.html";
  } catch (error) {
    errorMessage.style.display = "block";
  }
});
