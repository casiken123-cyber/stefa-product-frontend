import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Alert, Box, Button, Card, Skeleton, Snackbar, Stack, Typography,
} from "@mui/material";
import AddRounded from "@mui/icons-material/AddRounded";
import RefreshRounded from "@mui/icons-material/RefreshRounded";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import ProductFormDialog from "../components/ProductFormDialog";
import DeleteProductDialog from "../components/DeleteProductDialog";
import { describeError } from "../api/errors";
import { useAdmin } from "../context/AdminContext";

// Grey placeholder cards shown while the products load from the API
function LoadingGrid() {
  return (
    <div className="product-grid" aria-busy="true" aria-label="Loading products">
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <Card key={item} sx={{ overflow: "hidden" }}>
          <Skeleton variant="rectangular" sx={{ aspectRatio: "4 / 3", height: "auto" }} />
          <Box sx={{ p: 2.5 }}>
            <Skeleton width="70%" height={28} />
            <Skeleton width="100%" />
            <Skeleton width="55%" />
            <Skeleton width="35%" height={32} sx={{ mt: 2 }} />
          </Box>
        </Card>
      ))}
    </div>
  );
}

export default function ProductListPage({
  products, loading, error, onReload, onCreate, onUpdate, onRemove,
}) {
  const { requireAdmin, expireSession } = useAdmin();

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [deletingProduct, setDeletingProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [notice, setNotice] = useState("");
  const [sort, setSort] = useState("default");

  // Search text and category live in the URL, so links and the header menu can drive them
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const category = params.get("category") ?? "All";

  const setParam = (key, value, emptyValue) => {
    const next = new URLSearchParams(params);
    if (!value || value === emptyValue) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const categories = useMemo(
    () => ["All", ...new Set(products.map((product) => product.category))],
    [products]
  );
  const counts = useMemo(() => {
    const result = { All: products.length };
    products.forEach((product) => {
      result[product.category] = (result[product.category] || 0) + 1;
    });
    return result;
  }, [products]);

  // If the chosen category no longer exists (its last product was deleted), fall back to All
  const activeCategory = categories.includes(category) ? category : "All";

  const visibleProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    const list = products.filter(
      (product) =>
        (activeCategory === "All" || product.category === activeCategory) &&
        String(product.name ?? "").toLowerCase().includes(term)
    );

    if (sort === "price-asc") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...list].sort((a, b) => b.price - a.price);
    if (sort === "name-asc") return [...list].sort((a, b) => a.name.localeCompare(b.name));
    return [...list].sort((a, b) => b.id - a.id);
  }, [products, query, activeCategory, sort]);

  // Add, edit and delete need an admin login. requireAdmin asks for it first if needed.
  const openAdd = () =>
    requireAdmin(() => {
      setEditingProduct(null);
      setFormError("");
      setFieldErrors({});
      setFormOpen(true);
    });

  const openEdit = (product) =>
    requireAdmin(() => {
      setEditingProduct(product);
      setFormError("");
      setFieldErrors({});
      setFormOpen(true);
    });

  const askDelete = (product) =>
    requireAdmin(() => {
      setDeleteError("");
      setDeletingProduct(product);
    });

  const closeForm = () => {
    setFormOpen(false);
    setEditingProduct(null);
  };

  // Submit event: send the form to the API, and only update the screen if it worked
  const handleSave = async (values) => {
    setSaving(true);
    setFormError("");
    setFieldErrors({});
    try {
      if (editingProduct) {
        await onUpdate(editingProduct.id, values);
        setNotice("Product updated successfully.");
      } else {
        await onCreate(values);
        setNotice("Product added successfully.");
      }
      closeForm();
    } catch (err) {
      const info = describeError(err);
      if (info.authFailed) expireSession();
      setFormError(info.message);
      setFieldErrors(info.fields);
    } finally {
      setSaving(false);
    }
  };

  // Confirm click: the DELETE request is sent only here, never when Cancel is pressed
  const handleDelete = async () => {
    if (!deletingProduct) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await onRemove(deletingProduct.id);
      setDeletingProduct(null);
      setNotice("Product deleted successfully.");
    } catch (err) {
      const info = describeError(err);
      if (info.authFailed) expireSession();
      setDeleteError(info.message);
    } finally {
      setDeleting(false);
    }
  };

  const stat = (value) => (loading ? "â€“" : value);

  return (
    <main className="page-container">
      {/* Hero */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: { xs: 5, md: 6 },
          p: { xs: 3.5, md: 7 },
          mb: 5,
          color: "#fff",
          background:
            "radial-gradient(900px 340px at 88% -10%, rgba(255,122,41,0.38), transparent 60%), linear-gradient(135deg, #0E4C47 0%, #0A3A36 55%, #12181B 100%)",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { md: "flex-end" },
          justifyContent: "space-between",
          gap: 4,
        }}
      >
        <Box sx={{ maxWidth: 560 }}>
          <Typography variant="overline" sx={{ letterSpacing: "0.16em", color: "rgba(255,255,255,0.7)" }}>
            STEFA CATALOG
          </Typography>
          <Typography variant="h3" component="h1" sx={{ fontSize: { xs: 36, md: 52 }, lineHeight: 1.05, mt: 1 }}>
            Elevate your style.
          </Typography>
          <Typography sx={{ mt: 2, color: "rgba(255,255,255,0.78)", lineHeight: 1.7 }}>
            Browse the collection, then add, edit or remove products as your store grows.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddRounded />}
            onClick={openAdd}
            sx={{ mt: 3.5 }}
          >
            Add product
          </Button>
        </Box>

        <Stack direction="row" spacing={4}>
          <Box>
            <Typography variant="h4" component="p" sx={{ fontWeight: 700 }}>{stat(products.length)}</Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>Products</Typography>
          </Box>
          <Box>
            <Typography variant="h4" component="p" sx={{ fontWeight: 700 }}>{stat(categories.length - 1)}</Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>Categories</Typography>
          </Box>
        </Stack>
      </Box>

      {loading ? (
        <LoadingGrid />
      ) : error ? (
        <Alert
          severity="error"
          action={<Button color="inherit" size="small" onClick={onReload}>Retry</Button>}
        >
          {error}
        </Alert>
      ) : products.length === 0 ? (
        <Alert
          severity="info"
          action={<Button color="inherit" size="small" onClick={openAdd}>Add product</Button>}
        >
          There are no products yet. Add your first product.
        </Alert>
      ) : (
        <>
          <Typography variant="h4" component="h2" sx={{ mb: 2.5 }}>Catalog Collection</Typography>

          <ProductFilters
            query={query}
            onQueryChange={(value) => setParam("q", value, "")}
            categories={categories}
            counts={counts}
            category={activeCategory}
            onCategoryChange={(value) => setParam("category", value, "All")}
            sort={sort}
            onSortChange={setSort}
          />

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5 }}>
            <Typography variant="body2" color="text.secondary" aria-live="polite">
              Showing {visibleProducts.length} of {products.length} products
            </Typography>
            <Button size="small" color="inherit" startIcon={<RefreshRounded />} onClick={onReload}>
              Refresh
            </Button>
          </Box>

          {visibleProducts.length === 0 ? (
            <Alert severity="info">No products match your search or filter.</Alert>
          ) : (
            <div className="product-grid">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={openEdit}
                  onDelete={askDelete}
                />
              ))}
            </div>
          )}
        </>
      )}

      <ProductFormDialog
        open={formOpen}
        product={editingProduct}
        saving={saving}
        serverError={formError}
        serverErrors={fieldErrors}
        onClose={closeForm}
        onSave={handleSave}
      />

      <DeleteProductDialog
        product={deletingProduct}
        loading={deleting}
        error={deleteError}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDelete}
      />

      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={3000}
        onClose={() => setNotice("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setNotice("")} severity="success" variant="filled">
          {notice}
        </Alert>
      </Snackbar>
    </main>
  );
}