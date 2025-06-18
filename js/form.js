// Verifica si el usuario está autenticado
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "index.html";
}

const apiUrl = "https://surpropiedades-backend.onrender.com/api/properties";
const uploadUrl = "https://surpropiedades-backend.onrender.com/api/upload";

const propertyForm = document.getElementById("propertyForm");
const searchBtn = document.getElementById("searchBtn");
const deleteBtn = document.getElementById("deleteBtn");
const resetBtn = document.getElementById("resetBtn");
const saveBtn = document.getElementById("saveBtn");
const updateBtn = document.getElementById("updateBtn");
const imageInput = document.getElementById("image");

// Mostrar alerta
function showAlert(message, type = "info") {
  const alertContainer = document.getElementById("alertContainer");
  alertContainer.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
}

// Buscar propiedad por código
searchBtn.addEventListener("click", async () => {
  const code = document.getElementById("code").value.trim();
  if (!code) return showAlert("Ingrese un código para buscar", "warning");

  try {
    const res = await fetch(`${apiUrl}/${code}`);
    if (!res.ok) throw new Error("No encontrado");
    const property = await res.json();

    Object.keys(property).forEach((key) => {
      const input = document.getElementById(key);
      if (input && key !== "image") {
        input.type === "checkbox"
          ? (input.checked = property[key])
          : (input.value = property[key]);
      }
    });

    propertyForm.setAttribute("data-id", property._id);
  } catch (err) {
    showAlert("Propiedad no encontrada", "danger");
  }
});

// Subir imagen a Storj
async function uploadImage() {
  const file = imageInput.files[0];
  if (!file) return null;

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Error al subir imagen");
  const data = await res.json();
  return data.url;
}

// Función común para guardar o actualizar
async function handleSubmit(id = null) {
  try {
    const imageUrl = await uploadImage();
    const method = id ? "PUT" : "POST";
    const url = id ? `${apiUrl}/${id}` : `${apiUrl}/create`;

    const formData = {
      code: document.getElementById("code").value.trim(),
      title: document.getElementById("title").value.trim(),
      type: document.getElementById("type").value.trim(),
      price: document.getElementById("price").value.trim(),
      bedrooms: document.getElementById("bedrooms").value.trim(),
      bathrooms: document.getElementById("bathrooms").value.trim(),
      area: document.getElementById("area").value.trim(),
      location: document.getElementById("location").value.trim(),
      city: document.getElementById("city").value.trim(),
      sector: document.getElementById("sector").value.trim(),
      advisorWhatsapp: document.getElementById("advisorWhatsapp").value.trim(),
      rent: document.getElementById("rent").checked,
      available: document.getElementById("available").checked,
      featured: document.getElementById("featured").checked,
    };

    if (imageUrl) formData.image = imageUrl;

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error("Error al guardar");

    showAlert(id ? "Propiedad actualizada" : "Propiedad creada", "success");
    propertyForm.reset();
    propertyForm.removeAttribute("data-id");
  } catch (err) {
    console.error("Error al guardar:", err);
    showAlert("Error al guardar la propiedad", "danger");
  }
}

// Botón para crear nueva propiedad
saveBtn.addEventListener("click", async () => {
  propertyForm.removeAttribute("data-id");
  await handleSubmit();
});

// Botón para actualizar propiedad existente
updateBtn.addEventListener("click", async () => {
  const id = propertyForm.getAttribute("data-id");
  if (!id)
    return showAlert(
      "Debe buscar primero una propiedad para actualizar",
      "warning"
    );
  await handleSubmit(id);
});

// Eliminar propiedad
deleteBtn.addEventListener("click", async () => {
  const id = propertyForm.getAttribute("data-id");
  if (!id) return showAlert("Busque una propiedad primero", "warning");

  if (!confirm("¿Está seguro de eliminar esta propiedad?")) return;

  try {
    const res = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Error al eliminar");

    showAlert("Propiedad eliminada correctamente", "success");
    propertyForm.reset();
    propertyForm.removeAttribute("data-id");
  } catch (err) {
    console.error("Error al eliminar:", err);
    showAlert("Error al eliminar la propiedad", "danger");
  }
});

// Reiniciar formulario
resetBtn.addEventListener("click", () => {
  propertyForm.reset();
  propertyForm.removeAttribute("data-id");
  showAlert("Formulario reiniciado", "info");
});
