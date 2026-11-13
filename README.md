# STEFA Product Catalog: Activity #7 (React + Axios + REST API)

A responsive product catalog and management app built with React, Vite, Material UI (MUI), React Router and Axios.
Product data comes from a Laravel REST API, so the backend is the source of truth and changes persist after a refresh.

## Setup

1. Make sure the Laravel API is running (this project uses Laravel Herd, so it is served at `http://my-first-app.test`).
2. Install the packages:

```powershell
npm install
```

3. Create a `.env` file in the project root (next to `package.json`) with the API base URL. It must not contain any secrets:

```
VITE_API_BASE_URL=http://my-first-app.test/api
```

4. Start the app:

```powershell
npm run dev
```

5. Open the address printed in the terminal (usually http://localhost:5173, or 5174 if 5173 is busy).

Restart `npm run dev` after any change to `.env`.

Uploaded product pictures are served by Laravel from `/storage`, so run `php artisan storage:link` once in the backend project.

## Admin login

Reading products is public. Creating, updating and deleting products needs an admin account on the backend.
When you click Add, Edit or Delete without being logged in, an Admin login dialog opens first, then the action continues.
The token returned by the API is kept in the browser's `localStorage` and sent as a Bearer token on every request.
Use an admin email and password from the backend database. No credentials are stored in this project.

## Features

- List all products from the API (loads every page), with loading placeholders, an empty state and an error state with Retry
- View one product at `/products/:id`, loaded directly from the API, so a page refresh works
- Create a product with validation and an optional image upload
- Update a product without creating a duplicate
- Delete with a confirmation dialog (no request is sent when Cancel is pressed)
- Success and error messages after every action. The screen changes only after the API succeeds
- Search by name, filter by category, sort by price or name, and a Refresh button
- Responsive layout with a drawer menu on small screens

## API endpoints used

| Action | Method and endpoint | Notes |
|---|---|---|
| List products | `GET /api/products` | Paginated: the app requests every page |
| View one product | `GET /api/products/{id}` | Response is `{ "data": {...} }` |
| Create product | `POST /api/products` | Admin token, multipart form data |
| Update product | `POST /api/products/{id}` with `_method=PUT` | Admin token, multipart form data |
| Delete product | `DELETE /api/products/{id}` | Admin token |
| Admin login | `POST /api/admin/login` | Returns `{ admin, token }` |
| Admin logout | `POST /api/logout` | Admin token |

## Differences from the example API contract

- The list response is `{ data: [...], links, meta }` and is paginated (15 per page), not a plain array.
- Update: the backend route is `PUT /products/{id}`, but a PHP backend cannot read a file upload sent with PUT.
  The app sends a `POST` with a `_method=PUT` field, and Laravel treats it as a PUT request. There is no PATCH route.
- Product fields follow the backend ERD: `name`, `description`, `price`, `stock`, `category`, `image_url`.
  `stock` is required by the API, so the form has a Stock field.
- The image is uploaded as a file named `image` (JPG, PNG or WEBP, up to 2 MB) and returned as `image_url`.
  The API does not accept an image link.
- Create, update and delete require an admin Bearer token, so the app has an Admin login dialog.
- Validation errors (HTTP 422) from the API are shown next to the matching form field.

## Project structure

The structure from Activity #6 is kept. Required files are unchanged in name and role:
`components` (Header, ProductCard, ProductFormDialog, DeleteProductDialog), `layouts/MainLayout.jsx`,
`pages` (ProductListPage, ProductDetailsPage, NotFoundPage), `api/axios.js`, `App.jsx`, `main.jsx`, `index.css`.

Extra files added:

- `api/products.js`: the Axios calls for list, view, create, update, delete and admin login
- `api/errors.js`: turns API errors into friendly messages
- `context/AdminContext.jsx`: keeps the admin session and asks for login when needed
- `components/AdminLoginDialog.jsx`: the login form
- `components/ProductFilters.jsx`, `components/ProductImage.jsx`, `components/Footer.jsx`
- `theme/theme.js` and `utils/helpers.js`

`App.jsx` owns the products array. It loads the list with `useEffect` and `fetchAllProducts`,
and passes the create, update and remove functions to the pages through props.
The details page loads its own product by ID.

## Testing checklist

- List: the catalog shows products from the API
- View one: Details opens the right product, also after refreshing the page. An unknown ID shows "Product not found"
- Create: a valid product is saved and appears. A blank name or a negative price is rejected
- Update: the existing product changes and no duplicate appears
- Delete: Cancel keeps the product, Confirm removes it
- Refresh persistence: changes are still there after reloading the browser
- Error state: with the backend stopped, the page shows an error message with Retry instead of a blank page

## Troubleshooting

- Network error: check that Herd is running and that `VITE_API_BASE_URL` in `.env` is correct. Restart `npm run dev` after editing it.
- CORS error: the backend must allow the frontend origin (for example `http://localhost:5173`).
- 401 or 403: log in again with the Admin login button. Only admins can create, update or delete.
- 422: the API rejected a field. The message appears under that field.
- Uploaded images not showing: run `php artisan storage:link` in the Laravel project.