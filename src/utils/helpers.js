// Shared helpers used by the card, details page and form.

export const formatPrice = (price) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number(price));

// Inline SVG so the placeholder works offline and never breaks.
export const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450">
      <rect width="600" height="450" fill="#F3F4EF"/>
      <path d="M170 320l95-115 75 85 60-70 100 100H170z" fill="#CBD3CE"/>
      <circle cx="235" cy="165" r="32" fill="#CBD3CE"/>
    </svg>`
  );