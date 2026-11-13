import { useEffect, useState } from "react";
import {
  Alert, Box, Breadcrumbs, Button, Card, Chip, Divider, Skeleton, Stack, Typography,
} from "@mui/material";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import NavigateNextRounded from "@mui/icons-material/NavigateNextRounded";
import { Link as RouterLink, useParams } from "react-router-dom";
import ProductImage from "../components/ProductImage";
import { fetchProduct } from "../api/products";
import { describeError } from "../api/errors";
import { formatPrice } from "../utils/helpers";

export default function ProductDetailsPage({ products = [] }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [attempt, setAttempt] = useState(0);

  // Load this one product from the API whenever the page opens or the ID changes.
  // This also works when the details URL is opened or refreshed directly.
  useEffect(() => {
    let active = true;

    async function loadProduct() {
      setLoading(true);
      setError("");
      setNotFound(false);
      try {
        const data = await fetchProduct(id);
        if (active) setProduct(data);
      } catch (err) {
        if (active) {
          const info = describeError(err);
          setProduct(null);
          if (info.notFound) setNotFound(true);
          else setError(info.message);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProduct();
    return () => { active = false; };
  }, [id, attempt]);

  if (loading) {
    return (
      <main className="page-container" aria-busy="true">
        <Skeleton width={260} height={28} sx={{ mb: 3 }} />
        <Card sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.15fr 1fr" }, overflow: "hidden", borderRadius: { xs: 5, md: 6 } }}>
          <Skeleton variant="rectangular" sx={{ height: { xs: 300, md: 480 } }} />
          <Box sx={{ p: { xs: 3, md: 6 } }}>
            <Skeleton width="30%" />
            <Skeleton width="80%" height={48} />
            <Skeleton width="40%" height={40} />
            <Skeleton width="100%" />
            <Skeleton width="90%" />
          </Box>
        </Card>
      </main>
    );
  }

  if (notFound || error || !product) {
    return (
      <main className="page-container">
        <Alert
          severity={notFound ? "warning" : "error"}
          action={
            !notFound && (
              <Button color="inherit" size="small" onClick={() => setAttempt((count) => count + 1)}>
                Retry
              </Button>
            )
          }
        >
          {notFound || !error ? "Product not found." : error}
        </Alert>
        <Button component={RouterLink} to="/" startIcon={<ArrowBackRounded />} sx={{ mt: 2 }}>
          Back to products
        </Button>
      </main>
    );
  }

  const related = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 3);

  const specs = [
    ["Category", product.category || "Uncategorized"],
    ["Product ID", `#${product.id}`],
    ["Stock", product.stock > 0 ? `${product.stock} available` : "Out of stock"],
    ["Price", formatPrice(product.price)],
  ];

  return (
    <main className="page-container">
      <Breadcrumbs separator={<NavigateNextRounded fontSize="small" />} aria-label="Breadcrumb" sx={{ mb: 3 }}>
        <Box component={RouterLink} to="/" sx={{ color: "text.secondary", "&:hover": { color: "text.primary" } }}>
          Catalog
        </Box>
        <Box
          component={RouterLink}
          to={`/?category=${encodeURIComponent(product.category)}`}
          sx={{ color: "text.secondary", "&:hover": { color: "text.primary" } }}
        >
          {product.category}
        </Box>
        <Typography color="text.primary" sx={{ fontWeight: 600 }}>{product.name}</Typography>
      </Breadcrumbs>

      <Card sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.15fr 1fr" }, overflow: "hidden", borderRadius: { xs: 5, md: 6 } }}>
        <ProductImage
          src={product.image_url}
          alt={product.name}
          sx={{ height: { xs: 300, md: "100%" }, minHeight: { md: 480 } }}
        />
        <Stack spacing={2.5} sx={{ p: { xs: 3, md: 6 }, alignItems: "flex-start", justifyContent: "center" }}>
          <Chip
            label={product.category || "Uncategorized"}
            size="small"
            sx={{ bgcolor: "#F3F4EF", color: "secondary.main", textTransform: "uppercase", letterSpacing: "0.04em", fontSize: 11, fontWeight: 600 }}
          />
          <Typography variant="h3" component="h1" sx={{ fontSize: { xs: 32, md: 40 }, lineHeight: 1.1 }}>
            {product.name}
          </Typography>
          <Typography variant="h4" component="p">{formatPrice(product.price)}</Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
            {product.description || "No description provided."}
          </Typography>

          <Divider flexItem />

          <Box sx={{ width: "100%", display: "grid", gap: 1.25 }}>
            {specs.map(([label, value]) => (
              <Box key={label} sx={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <Box sx={{ color: "text.secondary" }}>{label}</Box>
                <Box sx={{ fontWeight: 600 }}>{value}</Box>
              </Box>
            ))}
          </Box>

          <Button component={RouterLink} to="/" variant="contained" size="large" startIcon={<ArrowBackRounded />}>
            Return to catalog
          </Button>
        </Stack>
      </Card>

      {related.length > 0 && (
        <Box sx={{ mt: 7 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
            More in {product.category}
          </Typography>
          <div className="product-grid">
            {related.map((item) => (
              <Card
                key={item.id}
                component={RouterLink}
                to={`/products/${item.id}`}
                sx={{
                  display: "block",
                  overflow: "hidden",
                  transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: "0 24px 44px -20px rgba(18,24,27,0.25)" },
                }}
              >
                <ProductImage src={item.image_url} alt={item.name} sx={{ aspectRatio: "4 / 3" }} />
                <Box sx={{ p: 2.5 }}>
                  <Typography variant="h6" component="h3" sx={{ fontSize: 17 }}>{item.name}</Typography>
                  <Typography sx={{ mt: 0.5, fontWeight: 700 }}>{formatPrice(item.price)}</Typography>
                </Box>
              </Card>
            ))}
          </div>
        </Box>
      )}
    </main>
  );
}