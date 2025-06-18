document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const response = await fetch("https://surpropiedades-backend.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      return showAlert("Credenciales incorrectas o error de servidor", "danger");
    }

    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    showAlert("Ocurrió un error inesperado", "danger");
  }
});

function showAlert(message, type = "info") {
  const alertContainer = document.getElementById("alertContainer");
  alertContainer.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
}
