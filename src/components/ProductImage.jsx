import { useState } from "react";
import { Box } from "@mui/material";
import { FALLBACK_IMAGE } from "../utils/helpers";

// Shows the product photo, and swaps to a neutral placeholder if the URL is empty or fails to load.
export default function ProductImage({ src, alt, sx, className }) {
  const [failed, setFailed] = useState(false);

  return (
    <Box
      component="img"
      className={className}
      src={!src || failed ? FALLBACK_IMAGE : src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      sx={{ width: "100%", display: "block", objectFit: "cover", bgcolor: "#F3F4EF", ...sx }}
    />
  );
}