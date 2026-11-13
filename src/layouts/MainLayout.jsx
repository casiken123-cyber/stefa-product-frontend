import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayout({ products = [] }) {
  const categories = [...new Set(products.map((product) => product.category))];

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header categories={categories} />
      <Box sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Footer categories={categories} />
    </Box>
  );
}