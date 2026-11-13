import { Box, Button, Stack, Typography } from "@mui/material";
import StorefrontOutlined from "@mui/icons-material/StorefrontOutlined";
import { Link as RouterLink } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="page-container">
      <Stack spacing={2.5} sx={{ alignItems: "center", textAlign: "center", py: { xs: 6, md: 10 } }}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            bgcolor: "rgba(255,122,41,0.12)",
            color: "primary.dark",
          }}
        >
          <StorefrontOutlined fontSize="large" />
        </Box>
        <Typography variant="overline" sx={{ letterSpacing: "0.16em", color: "text.secondary" }}>
          ERROR 404
        </Typography>
        <Typography variant="h3" component="h1" sx={{ fontSize: { xs: 32, md: 44 } }}>
          Page not found
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 420, lineHeight: 1.7 }}>
          The page you requested does not exist. Head back to the catalog to keep browsing.
        </Typography>
        <Button component={RouterLink} to="/" variant="contained" size="large">
          Go to product catalog
        </Button>
      </Stack>
    </main>
  );
}