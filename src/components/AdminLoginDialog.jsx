import { useEffect, useState } from "react";
import {
  Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField,
} from "@mui/material";
import { describeError } from "../api/errors";

export default function AdminLoginDialog({ open, onClose, onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({ email: "", password: "" });
      setErrors({});
      setError("");
    }
  }, [open]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    if (!form.password) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setBusy(true);
    setError("");
    try {
      await onLogin(form.email.trim(), form.password);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        setError("Incorrect email or password.");
      } else {
        const info = describeError(err);
        setError(info.message);
        setErrors(info.fields);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onClose={busy ? undefined : onClose} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle sx={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700 }}>
          Admin login
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 1 }}>
            Adding, editing and deleting products is for admins only.
          </DialogContentText>
          {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
          <TextField
            autoFocus margin="normal" fullWidth label="Email" name="email" type="email"
            value={form.email} onChange={handleChange}
            error={Boolean(errors.email)} helperText={errors.email}
          />
          <TextField
            margin="normal" fullWidth label="Password" name="password" type="password"
            value={form.password} onChange={handleChange}
            error={Boolean(errors.password)} helperText={errors.password}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button color="inherit" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={busy}>
            {busy ? "Logging in..." : "Log in"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}