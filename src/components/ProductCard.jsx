import {
  Box, Button, Card, CardContent, Chip, IconButton, Tooltip, Typography,
} from "@mui/material";
import EditOutlined from "@mui/icons-material/EditOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import { Link as RouterLink } from "react-router-dom";
import ProductImage from "./ProductImage";
import { formatPrice } from "../utils/helpers";

// Round glass button used for the edit and delete tools on the photo
const toolSx = {
  bgcolor: "rgba(255,255,255,0.92)",
  backdropFilter: "blur(6px)",
  boxShadow: "0 4px 14px -4px rgba(18,24,27,0.25)",
  "&:hover": { bgcolor: "#fff" },
};

export default function ProductCard({ product, onEdit, onDelete }) {
  const inStock = product.stock > 0;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 28px 50px -20px rgba(18,24,27,0.26), 0 8px 16px -8px rgba(18,24,27,0.08)",
        },
        "&:hover .card-photo": { transform: "scale(1.05)" },
        // Tools stay visible on touch screens, and appear on hover or keyboard focus on desktop
        "& .card-tools": { opacity: 1, "@media (hover: hover)": { opacity: 0, transform: "translateY(-4px)" } },
        "&:hover .card-tools, &:focus-within .card-tools": { opacity: 1, transform: "none" },
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
          "&:hover": { transform: "none" },
          "&:hover .card-photo": { transform: "none" },
        },
      }}
    >
      <Box sx={{ position: "relative", overflow: "hidden", bgcolor: "#F3F4EF" }}>
        <Box component={RouterLink} to={`/products/${product.id}`} aria-label={`View ${product.name}`} sx={{ display: "block" }}>
          <ProductImage
            src={product.image_url}
            alt={product.name}
            className="card-photo"
            sx={{ aspectRatio: "4 / 3", transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)" }}
          />
        </Box>

        <Chip
          label={product.category || "Uncategorized"}
          size="small"
          sx={{
            position: "absolute",
            top: 14,
            left: 14,
            bgcolor: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(6px)",
            color: "secondary.main",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        />

        <Box
          className="card-tools"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            display: "flex",
            gap: 0.75,
            transition: "opacity 0.3s, transform 0.3s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <Tooltip title="Edit product">
            <IconButton size="small" aria-label={`Edit ${product.name}`} onClick={() => onEdit(product)} sx={toolSx}>
              <EditOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete product">
            <IconButton size="small" color="error" aria-label={`Delete ${product.name}`} onClick={() => onDelete(product)} sx={toolSx}>
              <DeleteOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2.5, display: "flex", flexDirection: "column", gap: 1, "&:last-child": { pb: 2.5 } }}>
        <Typography variant="h6" component="h2" sx={{ fontSize: 18, lineHeight: 1.3 }}>
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.6,
          }}
        >
          {product.description}
        </Typography>
        <Typography variant="caption" sx={{ color: inStock ? "secondary.main" : "error.main", fontWeight: 600 }}>
          {inStock ? `${product.stock} in stock` : "Out of stock"}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1, pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
          <Typography variant="h6" component="p" sx={{ fontSize: 20, fontWeight: 700 }}>
            {formatPrice(product.price)}
          </Typography>
          <Button
            component={RouterLink}
            to={`/products/${product.id}`}
            color="inherit"
            size="small"
            endIcon={<ArrowForwardRounded fontSize="small" />}
            sx={{ fontWeight: 600, "&:hover": { bgcolor: "rgba(255,122,41,0.12)" } }}
          >
            Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}