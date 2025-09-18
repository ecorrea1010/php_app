const API_URL = "http://localhost:8080/api/Controllers/ProductController.php";
let editingId = null;

// ======================
// Sanitizar inputs
// ======================
function sanitizeInput(input) {
  const sanitized = input
    .trim()
    .replace(/['";`]/g, "")
    .replace(/(--|#|\/\*|\*\/)/g, "")
    .replace(/[<>]/g, "");

  // Si el valor original y el sanitizado difieren → posible intento de inyección
  if (sanitized !== input.trim()) {
    handleInvalidInput();
    return "";
  }
  return sanitized;
}

function sanitizePrice(price) {
  const clean = price.trim().replace(/[^0-9.,]/g, "");
  const parsed = parseFloat(clean) || 0;

  // Si el valor original tenía caracteres no permitidos
  if (clean !== price.trim()) {
    handleInvalidInput();
    return 0;
  }

  return parsed;
}

// ======================
// Manejar inputs inválidos
// ======================
function handleInvalidInput() {
  showAlert("Dato incorrecto detectado. Revisa tu entrada.", "danger");

  // Cerrar modal si está abierto
  const modalElement = document.getElementById("productModal");
  const modal = bootstrap.Modal.getInstance(modalElement);
  if (modal) {
    modal.hide();
  }

  // Resetear formulario
  document.getElementById("productForm").reset();
  editingId = null;
}

// ======================
// Mostrar mensajes
// ======================
function showAlert(message, type = "success") {
  const alertContainer = document.getElementById("alertContainer");
  alertContainer.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
}

// ======================
// Traer productos
// ======================
async function loadProducts() {
  try {
    const res = await fetch(API_URL);
    const products = await res.json();
    renderTable(products);
  } catch (error) {
    showAlert("Error cargando productos", "danger");
    console.error(error);
  }
}

// ======================
// Pintar tabla
// ======================
function renderTable(products) {
  const tableBody = document.getElementById("productTableBody");
  tableBody.innerHTML = "";

  products.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.name}</td>
      <td>$${p.price}</td>
      <td>
        <button class="btn btn-sm btn-warning me-2" onclick="editProduct(${p.id}, '${sanitizeInput(p.name)}', ${p.price})">✏️</button>
        <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.id})">🗑️</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// ======================
// Crear o actualizar
// ======================
async function saveProduct(e) {
  e.preventDefault();

  const rawName = document.getElementById("name").value;
  const rawPrice = document.getElementById("price").value;

  const name = sanitizeInput(rawName);
  const price = sanitizePrice(rawPrice);

  if (!name || !price) {
    showAlert("Por favor ingresa un nombre válido y un precio numérico", "warning");
    return;
  }

  try {
    let res;
    if (editingId) {
      res = await fetch(`${API_URL}?id=${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price })
      });
    } else {
      res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price })
      });
    }

    const data = await res.json();

    if (res.ok) {
      showAlert(data.message || "Operación exitosa");
      loadProducts();
      document.getElementById("productForm").reset();
      editingId = null;
      document.querySelector("#productModal .modal-title").innerText = "Agregar Producto";

      const modal = bootstrap.Modal.getInstance(document.getElementById("productModal"));
      modal.hide();
    } else {
      showAlert(data.error || "Error en la operación", "danger");
    }
  } catch (error) {
    showAlert("Error en la conexión con el servidor", "danger");
    console.error(error);
  }
}

// ======================
// Editar producto
// ======================
function editProduct(id, name, price) {
  editingId = id;
  document.getElementById("name").value = sanitizeInput(name);
  document.getElementById("price").value = price;
  document.querySelector("#productModal .modal-title").innerText = "Editar Producto";

  const modal = new bootstrap.Modal(document.getElementById("productModal"));
  modal.show();
}

// ======================
// Eliminar producto
// ======================
async function deleteProduct(id) {
  if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

  try {
    const res = await fetch(`${API_URL}?id=${id}`, { method: "DELETE" });
    const data = await res.json();

    if (res.ok) {
      showAlert(data.message || "Producto eliminado");
      loadProducts();
    } else {
      showAlert(data.error || "Error al eliminar producto", "danger");
    }
  } catch (error) {
    showAlert("Error en la conexión con el servidor", "danger");
    console.error(error);
  }
}

// ======================
// Eventos
// ======================
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  document.getElementById("productForm").addEventListener("submit", saveProduct);
});
