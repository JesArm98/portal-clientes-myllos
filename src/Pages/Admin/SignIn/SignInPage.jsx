import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignInPage.css";
import RegisterForm from "./RegisterForm";

// Material-UI imports
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CustomDialog from "@/Components/Custom/CustomDialog";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AccountCircle } from "@mui/icons-material";
import KeyIcon from "@mui/icons-material/Key";
import Backdrop from "@mui/material/Backdrop";
import { Alert, CircularProgress, Link, Snackbar, Stack } from "@mui/material";
import ProviderPortalMessage from "../../Sistema/Contabilidad/Facturas/ProviderPortalMessage";

export default function SignInPage() {
  const [correo, setCorreo] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValidMail, setIsValidMail] = useState(false);
  const [isValidMail2, setIsValidMail2] = useState(false);
  const [isValidPass, setIsValidPass] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [errorModal, setErrorModal] = useState("");
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openAviso, setOpenAviso] = useState(true);
  const [correoModal, setCorreoModal] = useState("");
  const [openSnack, setOpenSnack] = useState(false);
  const [openSnackError, setOpenSnackError] = useState(false);
  const [nombreEmpleado, setNombreEmpleado] = useState("");
  const [mostrar, setMostrar] = useState("login"); // 'login' o 'register'

  const navigate = useNavigate();

  // const handleRedirect = () => {
  //   navigate("/evento-altar");
  // };

  const [isLocked, setIsLocked] = useState(false);

  localStorage.clear();

  const handleOpenModalPass = () => {
    setOpenModal(true);
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return; // No cerrar si el usuario hace clic fuera del Snackbar
    }
    setOpenSnack(false); // Actualiza el estado para cerrar el Snackbar
  };

  const imagenPortada =
    "https://firebasestorage.googleapis.com/v0/b/fir-adminsdk-documents.appspot.com/o/Myllos.jpg?alt=media&token=0826d865-cfb9-4b80-9477-53c669611ac4";

  const handleLogin = async () => {
    if (attempts >= 4) {
      setIsLocked(true);
      setError(
        `Límite de intentos alcanzado. Usa "Olvidaste la contraseña" o contacta a soporteweb@tuvanosa.com.
        `
      );
      setOpen(true);
    }
  };

  const handleSubmitModalPass = async (event) => {
    event.preventDefault();
    setErrorModal("");

    const URL = import.meta.env.VITE_API_URL;

    try {
      await axios.post(
        `https://${URL}/WS/TuvanosaSeguridad/Api/AuthProveedor/ForgetPassword`,
        {
          correo: correoModal,
        }
      );

      setOpenModal(false);
      setOpenSnack(true);
      setCorreoModal("");
    } catch (error) {
      if (error.response) {
        setErrorModal(`${error.response.data}`);
        setOpenSnackError(true);
      } else {
        setErrorModal("Error al realizar la solicitud (500)");
        setOpenSnackError(true);
      }
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value.toLowerCase().replace(/\s/g, "");
    setOpen(false);
    setCorreo(value);

    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const hasSpecialChars = /[<>"'\\/]/.test(value);

    if (
      value.length <= 55 &&
      value.length >= 17 &&
      !value.includes(" ") &&
      emailPattern.test(value) &&
      !hasSpecialChars
    ) {
      setIsValidMail(true);
    } else {
      setIsValidMail(false);
    }
  };

  const handleEmailChange2 = (e) => {
    const value = e.target.value.toLowerCase().replace(/\s/g, "");
    setOpen(false);
    setCorreoModal(value);

    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const hasSpecialChars = /[<>"'\\/]/.test(value);

    if (
      value.length <= 55 &&
      value.length >= 8 &&
      !value.includes(" ") &&
      emailPattern.test(value) &&
      !hasSpecialChars
    ) {
      setIsValidMail2(true);
    } else {
      setIsValidMail2(false);
    }
  };

  const handleClose = () => {
    setOpenModal(false);
    setCorreoModal(""); // Considera resetear el estado solo si es necesario
    // Otras acciones necesarias al cerrar el modal
  };

  const handlePassChange = (e) => {
    const value = e.target.value.replace(/\s/g, "");
    setOpen(false);
    setPassword(value);

    if (value.length <= 35 && value.length >= 8) {
      setIsValidPass(true);
    } else {
      setIsValidPass(false);
    }
  };

  // Manejador de evento Submit en formulario Login
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Abrir el Backdrop y mostrar el spinner
    setLoading(true);
    try {
      const URL = import.meta.env.VITE_API_URL;
      const response = await axios.post(
        `https://${URL}/WS/TuvanosaSeguridad/Api/Login`,
        {
          correo,
          password,
        }
      );
      setToken("Estoesuntokendeprueba")
      setTimeout(() => {
        if (response.status === 200) {
          setError(null);
          //setToken(response.data.token);
          //setNombreEmpleado(response.data.usuario.nombre);
        }
        setLoading(false);
        setAttempts(1);
      }, 500);
    } catch (error) {
      setToken("Estoesuntokendeprueba")
      {/*setAttempts((attempts) => attempts + 1);
      // Manejo de errores
      if (error.response) {
        setLoading(false);
        // Configura el mensaje de error basado en la respuesta del servidor
        setError(
          [
            `${error.response.data} Numero de intentos restantes ${
              4 - attempts
            }`,
          ].map((item, index) => <p key={index}>{item}</p>)
        );

        setOpen(true);
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        setError("La solicitud fue hecha pero no se recibió respuesta");
        setLoading(false);
        setOpen(true);
      } else {
        // Un error ocurrió al configurar la solicitud
        setError("Error al realizar la solicitud");
        setOpen(true);
      }*/}
    }
  };

  function Copyright(props) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Copyright © "}
        <Link
          sx={{ color: "#262E66", margin: "2px" }}
          color="inherit"
          href="https://myllos.netlify.app"
          target="_blank"
        >
          Myllos
        </Link>
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }

  // Check de correo y token
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      const mailcheck = correo.split("@")[1];
      localStorage.setItem("mailcheck", mailcheck);
      localStorage.setItem("nombreEmpleado", nombreEmpleado);

      navigate("/");
    }
  }, [correo, token, navigate]);

  const handleClose23 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const isVotedState = false;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
        bgcolor: "white",
      }}
    >
      <Grid container sx={{ height: "100vh", width: "100%" }}>
        <Grid
          item
          xs={12}
          sm={12}
          md={7}
          sx={{
            overflow: "hidden",
            height: "100%",
            display: { xs: "none", md: "block" },
            order: { xs: 1 },
          }}
        >
          <img
            src={imagenPortada}
            style={{ height: "100%", width: "100%" }}
            alt="imagenPortada"
          />
        </Grid>
        <Grid item xs={12} sm={12} md={5} sx={{ order: { xs: 1 } }}>
          <Box sx={{}}>
            <Container
              sx={{
                display: mostrar === "login" ? "flex" : "none",
                width: "100%",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                order: { sm: 1 },
              }}
            >
              <Box
                component="img"
                src="/images/myllos-logo.svg"
                sx={{
                  width: { xs: 180,sm:300, md: 300 },
                  height: { xs: 120, md: 200 },
 
                }}
              />

              <>
                <Typography
                  sx={{ marginTop: "12px" }}
                  component="h1"
                  variant="h4"
                ></Typography>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 1 }}
                >
                  <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                    <AccountCircle
                      sx={{ color: "action.active", mr: 1, my: 4.3 }}
                    />
                    <TextField
                      placeholder="email@dominio.com"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                      required
                      value={correo}
                      onChange={handleEmailChange}
                      fullWidth
                      id="email"
                      label="Correo"
                      name="email"
                      autoComplete="email"
                      error={!isValidMail && correo.length > 0}
                      helperText={
                        !isValidMail && correo.length > 0
                          ? "Por favor ingrese un correo electrónico válido"
                          : "Para ingresar se hace con el correo que se uso al momento de registrarse."
                      }
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-end",
                      width: "100%",
                    }}
                  >
                    <KeyIcon sx={{ color: "action.active", mr: 1, my: 2.1 }} />
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      placeholder="Introduce tu contraseña"

                      margin="normal"
                      required
                      value={password}
                      onChange={handlePassChange}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            aria-label="toggle password visibility"
                            onMouseDown={() => setShowPassword(true)}
                            onMouseUp={() => setShowPassword(false)}
                            onMouseLeave={() => setShowPassword(false)}
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        ),
                      }}
                      name="password"
                      label="Contraseña"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      autoComplete="current-password"
                    />
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 3 }}
                  >
                    <Button
                      disabled={!isValidMail || !isValidPass || isLocked}
                      onClick={handleLogin}
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "fit-content",
                        borderRadius: "10px",
                        mt: 3,
                        mb: 2,
                        backgroundColor: loading ? "#3DC2CF" : "#3DC2CF",
                        "&:hover": {
                          backgroundColor: "#6977E5",
                        },
                      }}
                      startIcon={loading ? <CircularProgress size={20} /> : null}
                      >
                      <Typography
                        component="h1"
                        fontSize={"16px"}
                        textTransform={"none"}
                      >
                        {loading ? "Procesando Informacion" : "Iniciar sesión"}
                      </Typography>
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      width: "full",
                      display: "flex",
                      alignContent: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Snackbar
                      open={open}
                      autoHideDuration={8000}
                      onClose={handleClose23}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                    >
                      <Alert
                        onClose={handleClose23}
                        severity="error"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          fontFamily: "Roboto",
                          fontSize: "16px",
                          justifyContent: "center",
                          height: "30px",
                          width: "auto",
                          minWidth: "fit-content",
                        }}
                      >
                        {error}
                      </Alert>
                    </Snackbar>
                  </Box>
                  <Grid container direction="column">
                    <Grid
                      item
                      xs={12}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          width: "100%",
                          alignItems: "center",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <Link
                          onClick={handleOpenModalPass}
                          style={{
                            textDecoration: "none",
                            color: "red",
                            fontWeight: "800",
                            cursor: "pointer",
                          }}
                        >
                          <strong>Olvidaste la contraseña</strong>
                        </Link>
                        <Button
                          onClick={() => setMostrar("register")}
                          variant="outlined"
                          sx={{
                            display: { xs: "none", md: "flex" },
                            color: "#262E66",
                            padding: " 8px 16px 8px 16px",
                            textTransform: "none",
                            borderColor: "transparent",
                            borderRadius: "30px",
                            height: "40px",
                            animation: "pulse 3s infinite",
                            transition: "transform 0.3s ease",
                            "@keyframes pulse": {
                              "0%": {
                                boxShadow: "0 0 0 3px rgba(0, 159, 227, 0.8)",
                              },
                              "50%": {
                                boxShadow: "0 0 10px 2px rgba(0,159,227, 0.8)",
                              },
                              "100%": {
                                boxShadow: "0 0 0 3px rgba(0,159,227, 0.8)",
                              },
                            },
                            "&:hover": {
                              transform: "scale(0.90)",
                              borderColor: "#009FE3",
                              borderWidth: "2px",
                            },
                          }}
                        >
                          <strong>Registrarse</strong>
                        </Button>
                      </Box>
                    </Grid>
                    <br />
                    <Grid item xs>
                      <Typography
                        sx={{
                          textAlign: "center",
                          marginTop: "18px",
                        }}
                      >
                        {" "}
                        Tienes algun problema? Comunícate con:{"  "}
                        <a href="mailto:armando.aramburo75@gmail.com">
                        <strong>armando.aramburo75@gmail.com</strong>{" "}
                        </a>
                      </Typography>
                    </Grid>
                    <Backdrop
                      sx={{
                        color: "#fff",
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                      }}
                      open={loading}
                    >
                      <Stack
                        sx={{ color: "white" }}
                        spacing={2}
                        direction="row"
                      >
                        {" "}
                        <CircularProgress color="inherit" size={60} />
                      </Stack>
                    </Backdrop>
                  </Grid>
                </Box>
                <Box>
                  <CustomDialog
                    open={openModal}
                    onClose={handleClose}
                    title="Ingrese su correo"
                    onSubmit={handleSubmitModalPass}
                    submitDisabled={!isValidMail2}
                  >
                    {" "}
                    <form onSubmit={handleSubmitModalPass}>
                      <TextField
                        autoFocus
                        placeholder="correo@dominio.com"
                        margin="dense"
                        id="correo"
                        label="Correo Electrónico"
                        type="email"
                        fullWidth
                        value={correoModal}
                        onChange={handleEmailChange2}
                        error={!isValidMail && correoModal.length > 0}
                        helperText={
                          !isValidMail && correoModal.length > 0
                            ? "Por favor ingrese un correo electrónico válido"
                            : ""
                        }
                      />
                    </form>
                  </CustomDialog>
                </Box>
                <Snackbar
                  open={openSnack}
                  autoHideDuration={6000}
                  onClose={handleCloseSnack}
                >
                  <Alert
                    onClose={handleCloseSnack}
                    severity="success"
                    sx={{ width: "100%" }}
                  >
                    Se a enviado un correo de recuperacion de contraseña.
                  </Alert>
                </Snackbar>

                <Snackbar
                  open={openSnackError}
                  autoHideDuration={4000}
                  onClose={() => setOpenSnackError(false)}
                >
                  <Alert
                    onClose={() => setOpenSnackError(false)}
                    severity="error"
                    sx={{ width: "100%" }}
                  >
                    {errorModal}
                  </Alert>
                </Snackbar>
              </>

              <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>

            <CustomDialog
              open={openAviso}
              onClose={() => setOpenAviso(false)}
              title="Aviso importante portal Clientes Myllos"
              onPdfPreview={true}
              width="md"
            >
              <ProviderPortalMessage />
            </CustomDialog>

            {/* 🔹 Formulario de Registro */}
            <Container
              sx={{
                display: mostrar === "register" ? "flex" : "none",
                width: "100%",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
              }}
            >
              <RegisterForm onBack={() => setMostrar("login")} />
            </Container>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
