import { Box, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function Footer({ categories = [] }) {
  return (
    <Box component="footer" sx={{ bgcolor: "#12181B", color: "#CFD6D3", mt: 8 }}>
      <Box
        sx={{
          width: "var(--page-width)",
          mx: "auto",
          py: { xs: 5, md: 7 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.4fr 1fr" },
          gap: 4,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ color: "#fff" }}>
            S<Box component="span" sx={{ color: "primary.main" }}>TEFA</Box>
          </Typography>
          <Typography sx={{ mt: 1.5, maxWidth: 360, color: "#9AA6A2", lineHeight: 1.7 }}>
            Elevate your style. A small catalog of everyday pieces, kept simple.
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ letterSpacing: "0.08em", color: "#7C8680" }}>
            BROWSE
          </Typography>
          <Stack spacing={1} sx={{ mt: 1.5 }}>
            <Box component={RouterLink} to="/" sx={{ color: "inherit", "&:hover": { color: "primary.main" }, transition: "color 0.2s" }}>
              All products
            </Box>
            {categories.map((name) => (
              <Box
                key={name}
                component={RouterLink}
                to={`/?category=${encodeURIComponent(name)}`}
                sx={{ color: "inherit", "&:hover": { color: "primary.main" }, transition: "color 0.2s" }}
              >
                {name}
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>

      <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <Typography variant="body2" sx={{ width: "var(--page-width)", mx: "auto", py: 2.5, color: "#7C8680" }}>
          Â© {new Date().getFullYear()} STEFA. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}