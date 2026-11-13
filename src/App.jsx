import { useCallback, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";
import {
  createProduct as createProductRequest,
  deleteProduct as deleteProductRequest,
  fetchAllProducts,
  updateProduct as updateProductRequest,
} from "./api/products";

// App owns the products array. The backend is the source of truth: the list is loaded
// from the API, and the screen changes only after a create, update or delete succeeds.
export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setProducts(await fetchAllProducts());
    } catch (err) {
      setError("Unable to load products. Check the API connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // These throw if the request fails, so the page can show the error and keep the list unchanged.
  const createProduct = async (values) => {
    const created = await createProductRequest(values);
    setProducts((current) => [...current, created]);
    return created;
  };

  const updateProduct = async (id, values) => {
    const updated = await updateProductRequest(id, values);
    setProducts((current) =>
      current.map((product) => (product.id === id ? { ...product, ...updated } : product))
    );
    return updated;
  };

  const removeProduct = async (id) => {
    await deleteProductRequest(id);
    setProducts((current) => current.filter((product) => product.id !== id));
  };

  return (
    <Routes>
      <Route element={<MainLayout products={products} />}>
        <Route
          path="/"
          element={
            <ProductListPage
              products={products}
              loading={loading}
              error={error}
              onReload={loadProducts}
              onCreate={createProduct}
              onUpdate={updateProduct}
              onRemove={removeProduct}
            />
          }
        />
        <Route
          path="/products/:id"
          element={<ProductDetailsPage products={products} />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}