import api from "./axios";

// The server address without "/api", used to build image links like /storage/products/x.jpg
export const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/api\/?$/, "");

export function resolveImage(url) {
  if (!url) return "";
  if (/^(https?:|data:|blob:)/.test(url)) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
}

// Makes the API's product match what the UI expects (numbers, full image URL)
function normalizeProduct(product) {
  return {
    ...product,
    price: Number(product.price),
    stock: Number(product.stock ?? 0),
    image_url: resolveImage(product.image_url),
  };
}

// The API wraps one product in { data: {...} }
const unwrap = (response) => response.data?.data ?? response.data;

// LIST: the API paginates (15 per page), so keep requesting pages until the last one.
export async function fetchAllProducts() {
  const items = [];
  let page = 1;
  let lastPage = 1;

  do {
    const response = await api.get("/products", { params: { page } });
    const body = response.data;
    items.push(...(Array.isArray(body) ? body : body.data ?? []));
    lastPage = body.meta?.last_page ?? 1;
    page += 1;
  } while (page <= lastPage);

  return items.map(normalizeProduct);
}

// VIEW ONE
export async function fetchProduct(id) {
  const response = await api.get(`/products/${id}`);
  return normalizeProduct(unwrap(response));
}

// The API accepts an uploaded image file, so product data is sent as multipart form data.
function toFormData(values) {
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("price", values.price);
  formData.append("stock", values.stock);
  formData.append("category", values.category ?? "");
  formData.append("description", values.description ?? "");
  if (values.image instanceof File) formData.append("image", values.image);
  return formData;
}

// Sent as multipart. The instance default is JSON, and Axios would turn a FormData body
// into JSON (losing the image file) unless the content type is set to multipart here.
const multipart = { headers: { "Content-Type": "multipart/form-data" } };

// CREATE
export async function createProduct(values) {
  const response = await api.post("/products", toFormData(values), multipart);
  return normalizeProduct(unwrap(response));
}

// UPDATE: the API route is PUT, but PHP cannot read a file upload sent with PUT,
// so we POST the form with _method=PUT and Laravel treats it as a PUT request.
export async function updateProduct(id, values) {
  const formData = toFormData(values);
  formData.append("_method", "PUT");
  const response = await api.post(`/products/${id}`, formData, multipart);
  return normalizeProduct(unwrap(response));
}

// DELETE
export async function deleteProduct(id) {
  await api.delete(`/products/${id}`);
}

// ADMIN LOGIN: returns { admin, token }
export async function adminLogin(email, password) {
  const response = await api.post("/admin/login", { email, password });
  return response.data;
}

export async function adminLogout() {
  await api.post("/logout");
}