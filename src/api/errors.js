// Turns an Axios error into a friendly message the UI can show.
export function describeError(err) {
  if (!err.response) {
    return {
      message: "Cannot reach the API. Check that the backend is running and the URL in .env is correct.",
      fields: {},
    };
  }

  const { status, data } = err.response;

  if (status === 401 || status === 403) {
    return {
      message: "Admin login is required, or your session has expired. Please log in again.",
      fields: {},
      authFailed: true,
    };
  }

  if (status === 404) {
    return { message: "Product not found.", fields: {}, notFound: true };
  }

  if (status === 422 && data?.errors) {
    const fields = {};
    Object.entries(data.errors).forEach(([key, value]) => {
      fields[key] = Array.isArray(value) ? value[0] : String(value);
    });
    return { message: data.message || "Please fix the highlighted fields.", fields };
  }

  return { message: data?.message || `Request failed (${status}). Please try again.`, fields: {} };
}