document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  const addPropertyBtn = document.getElementById("addPropertyBtn");

  // Verificar autenticación al cargar el dashboard
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html"; // Redirige al login si no hay token
    return;
  }

  // Botón de cerrar sesión
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });

  // Botón para ir al formulario de propiedad
  addPropertyBtn.addEventListener("click", () => {
    window.location.href = "form.html";
  });
});
