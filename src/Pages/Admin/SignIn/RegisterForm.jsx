import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "@/Context/SnackbarContext";
import axios from "axios";

export default function RegisterForm({ onBack }) {
  const [rfc, setRfc] = useState("");
  const [email, setEmail] = useState("");
  const [isValidRfc, setIsValidRfc] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const URL = import.meta.env.VITE_API_URL;

  // 🔹 Validación del RFC
  const handleRfcChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/\s/g, "");
    setRfc(value);

    const rfcPattern = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
    setIsValidRfc(rfcPattern.test(value));
  };

  // 🔹 Validación del Correo
  const handleEmailChange = (e) => {
    const value = e.target.value.toLowerCase().replace(/\s/g, "");
    setEmail(value);

    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    setIsValidEmail(emailPattern.test(value));
  };

  // 🔹 Envía el formulario al backend
  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `https://${URL}/WS/TuvanosaSeguridad/Api/AuthProveedor/CreateUsuario`,
        { rfc, correo: email }
      );

      if (response.status === 200) {
        showSnackbar("Usuario registrado con éxito", "success");
        setRfc("");
        setEmail("");
      }
    } catch (error) {
      showSnackbar(
        `${error.response?.data || "Error en el registro"}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        mx: "auto",
        py: 4,
        px: 3,
        borderRadius: 3,
        textAlign: "center",
      }}
    >
      {/* Logo */}
      <Box
        component="img"
        src="/images/myllos-logo.svg"
        sx={{
          width: { xs: 180,sm:300, md: 300 },
          height: { xs: 100, md: 150 },
          borderRadius: "50%",
          mb: 2,
        }}
      />

      {/* Título */}
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Registro de Usuario
      </Typography>

      {/* Campo RFC */}
      <Box
        sx={{ display: "flex", alignItems: "flex-end", width: "100%", mb: 2 }}
      >
        <AssignmentIndIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
        <TextField
          label="RFC"
          placeholder="Introduce tu RFC"
          variant="standard"
          fullWidth
          value={rfc}
          onChange={handleRfcChange}
          error={rfc.length > 0 && !isValidRfc}
          helperText={rfc.length > 0 && !isValidRfc ? "RFC inválido" : ""}
        />
      </Box>

      {/* Campo Correo */}
      <Box
        sx={{ display: "flex", alignItems: "flex-end", width: "100%", mb: 2 }}
      >
        <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
        <TextField
          label="Correo"
          placeholder="email@tuvanosa.com"
          variant="standard"
          fullWidth
          value={email}
          onChange={handleEmailChange}
          error={email.length > 0 && !isValidEmail}
          helperText={
            email.length > 0 && !isValidEmail ? "Correo inválido" : ""
          }
        />
      </Box>
      <Typography sx={{ fontSize: "12px", mt: 2 }}>
        *Al registrarse le llegara un correo a su bandeja de entrada para que
        pueda confirmar su usuario y proporcionar su contraseña
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          width: "100%",
          mt: 4,
        }}
      >
        {/* Botón para regresar */}
        <Button
          variant="text"
          onClick={onBack}
          startIcon={<ArrowBackIcon />}
          sx={{
            color: "#262E66",
            fontWeight: "bold",
            textTransform: "none",
            borderRadius: "20px",
          }}
        >
          Volver al inicio
        </Button>
        {/* Botón de Registro */}
        <Button
          variant="contained"
          fullWidth
          disabled={!isValidRfc || !isValidEmail || loading}
          onClick={handleRegister}
          sx={{
            backgroundColor: loading ? "#2e6626" : "#262E66",
            "&:hover": { backgroundColor: "#6977E5" },
            borderRadius: "20px",
            textTransform: "none",
            py: 1.2,
            width: "fit-content",
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Registrarse"
          )}
        </Button>
      </Box>
    </Paper>
  );
}
