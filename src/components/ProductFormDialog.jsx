import { useEffect, useState } from "react";
import {
  Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText, Stack, TextField,
} from "@mui/material";
import AddPhotoAlternateOutlined from "@mui/icons-material/AddPhotoAlternateOutlined";
import ProductImage from "./ProductImage";

const emptyForm = {
  name: "",
  price: "",
  stock: "",
  category: "",
  description: "",
};

const MAX_IMAGE_MB = 2;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ProductFormDialog({
  open, product, saving = false, serverError = "", serverErrors = {}, onClose, onSave,
}) {
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});

  // Fill the form when editing, or reset it when adding
  useEffect(() => {
    if (open) {
      setForm(
        product
          ? {
              name: product.name ?? "",
              price: String(product.price ?? ""),
              stock: String(product.stock ?? ""),
              category: product.category ?? "",
              description: product.description ?? "",
            }
          : emptyForm
      );
      setImageFile(null);
      setPreview(product?.image_url ?? "");
      setErrors({});
    }
  }, [open, product]);

  // Local error first, then any error the API sent back for that field
  const fieldError = (name) => errors[name] || serverErrors[name] || "";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  // Keeps the chosen picture as a File, which is uploaded to the API when saving
  const handleFile = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrors((current) => ({ ...current, image: "Choose a JPG, PNG or WEBP image." }));
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setErrors((current) => ({ ...current, image: `Image is too large. Choose one under ${MAX_IMAGE_MB} MB.` }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageFile(file);
      setPreview(String(reader.result));
      setErrors((current) => ({ ...current, image: "" }));
    };
    reader.readAsDataURL(file);
  };

  const removeNewImage = () => {
    setImageFile(null);
    setPreview(product?.image_url ?? "");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!form.name.trim()) nextErrors.name = "Product name is required.";
    if (form.price === "" || !Number.isFinite(price) || price < 0) {
      nextErrors.price = "Enter a valid price of zero or more.";
    }
    if (form.stock === "" || !Number.isInteger(stock) || stock < 0) {
      nextErrors.stock = "Enter a whole number of zero or more.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSave({
      name: form.name.trim(),
      price,
      stock,
      category: form.category.trim() || "Uncategorized",
      description: form.description.trim(),
      image: imageFile,
    });
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle sx={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700 }}>
          {product ? "Edit product" : "Add product"}
        </DialogTitle>
        <DialogContent>
          {serverError && <Alert severity="error" sx={{ mt: 1 }}>{serverError}</Alert>}

          <TextField
            autoFocus margin="normal" fullWidth label="Product name"
            name="name" value={form.name} onChange={handleChange}
            error={Boolean(fieldError("name"))} helperText={fieldError("name")}
            required
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 0, sm: 2 }}>
            <TextField
              margin="normal" fullWidth label="Price (PHP)" name="price"
              type="number" slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
              value={form.price} onChange={handleChange}
              error={Boolean(fieldError("price"))} helperText={fieldError("price")}
              required
            />
            <TextField
              margin="normal" fullWidth label="Stock" name="stock"
              type="number" slotProps={{ htmlInput: { min: 0, step: "1" } }}
              value={form.stock} onChange={handleChange}
              error={Boolean(fieldError("stock"))} helperText={fieldError("stock")}
              required
            />
          </Stack>

          <TextField
            margin="normal" fullWidth label="Category" name="category"
            value={form.category} onChange={handleChange}
            error={Boolean(fieldError("category"))}
            helperText={fieldError("category") || "For example: Sneakers, Audio, Accessories"}
          />

          {/* Image: uploaded with the form */}
          <Box sx={{ mt: 2 }}>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Box sx={{ width: 96, height: 72, borderRadius: 2, overflow: "hidden", border: "1px solid", borderColor: "divider", flexShrink: 0 }}>
                <ProductImage key={preview} src={preview} alt="Product preview" sx={{ height: "100%" }} />
              </Box>
              <Stack spacing={1} sx={{ alignItems: "flex-start" }}>
                <Button component="label" variant="outlined" startIcon={<AddPhotoAlternateOutlined />}>
                  {product ? "Change image" : "Upload image"}
                  <input hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} />
                </Button>
                {imageFile && (
                  <Button size="small" color="inherit" onClick={removeNewImage}>
                    Remove new image
                  </Button>
                )}
              </Stack>
            </Stack>
            {fieldError("image") && <FormHelperText error sx={{ mt: 1 }}>{fieldError("image")}</FormHelperText>}
            {!fieldError("image") && (
              <FormHelperText sx={{ mt: 1 }}>JPG, PNG or WEBP, up to {MAX_IMAGE_MB} MB. Optional.</FormHelperText>
            )}
          </Box>

          <TextField
            margin="normal" fullWidth label="Description" name="description"
            value={form.description} onChange={handleChange}
            error={Boolean(fieldError("description"))} helperText={fieldError("description")}
            multiline minRows={3}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button color="inherit" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Saving..." : product ? "Save changes" : "Add product"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}