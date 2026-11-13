import {
  Box, Chip, InputAdornment, MenuItem, Stack, TextField,
} from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";
import TuneRounded from "@mui/icons-material/TuneRounded";

// Search box, category chips and a sort dropdown. State lives in the parent page.
export default function ProductFilters({
  query, onQueryChange, categories, counts, category, onCategoryChange, sort, onSortChange,
}) {
  return (
    <Stack spacing={2.5} sx={{ mb: 3 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          fullWidth
          placeholder="Search product name..."
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          slotProps={{
            htmlInput: { "aria-label": "Search products by name" },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          select
          label="Sort by"
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          sx={{ minWidth: { sm: 230 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <TuneRounded fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        >
          <MenuItem value="default">Newest added</MenuItem>
          <MenuItem value="price-asc">Price: low to high</MenuItem>
          <MenuItem value="price-desc">Price: high to low</MenuItem>
          <MenuItem value="name-asc">Name: A to Z</MenuItem>
        </TextField>
      </Stack>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {categories.map((name) => {
          const selected = name === category;
          return (
            <Chip
              key={name}
              clickable
              onClick={() => onCategoryChange(name)}
              color={selected ? "primary" : "default"}
              variant={selected ? "filled" : "outlined"}
              label={`${name}  ${counts[name] ?? 0}`}
              sx={{ fontWeight: 600, height: 36, px: 0.5, bgcolor: selected ? undefined : "background.paper" }}
            />
          );
        })}
      </Box>
    </Stack>
  );
}