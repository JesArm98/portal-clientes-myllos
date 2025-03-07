import React from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EmailIcon from "@mui/icons-material/Email";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";

const ProviderPortalMessage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f6f9",
        margin:"auto"
      }}
    >
        <Paper
          elevation={3}
          sx={{
            padding: "2rem",
            borderRadius: "12px",
            backgroundColor: "white",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              color: "#262E66",
              textAlign: "center",
              marginBottom: "1.5rem",
              fontWeight: "bold",
            }}
          >
            Portal clientes de Operadora de Servicios Myllos
          </Typography>

          <Typography
            variant="body1"
            sx={{
              marginBottom: "1.5rem",
              textAlign: "center",
              color: "#555",
            }}
          >
            Estimados clientes, nos complace informarle que Myllos ha implementado un portal de Clientes con el objetivo de modernizar y optimizar nuestra comunicación y procesos de gestión.
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "#262E66",
              marginBottom: "1rem",
              fontWeight: "bold",
            }}
          >
            Información importante sobre portal:
          </Typography>

          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Proceso de Registro"
                secondary="Debe hacer clic en el botón 'Registrate' y completar el formulario con su información oficial."
                secondaryTypographyProps={{
                  style: {
                    color: "#42a5f5", // Cambia el color a rojo
                    fontWeight: "bold", // Aplica negritas
                  },
                }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <DoNotDisturbIcon color="error" />
              </ListItemIcon>
              <ListItemText
                primary="Acceso al portal"
                secondary="Ya registrado el proveedor, el ingreso al portal se hace mediante el correo de registro, no con su RFC."
                secondaryTypographyProps={{
                  style: {
                    color: "red", // Cambia el color a rojo
                    fontWeight: "bold", // Aplica negritas
                  },
                }}
              />
            </ListItem>
          </List>

          <Box
            sx={{
              marginTop: "1.5rem",
              textAlign: "center",
              border:"1px solid #3DC2CF",
              padding: "1rem",
              borderRadius: "8px",
              width: "fit-content",
              margin: "auto",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#555",
              }}
            >
              <EmailIcon sx={{ marginRight: "0.5rem" }} />
              Soporte: {" "}
              <a
                href="mailto:armando.aramburo75@gmail.com"
                style={{ textDecoration: "none" }}
              >
                armando.aramburo75@gmail.com
              </a>
            </Typography>
          </Box>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              textAlign: "center",
              marginTop: "1rem",
              color: "#888",
            }}
          >
            © {new Date().getFullYear()} Tuvanosa. Todos los derechos
            reservados.
          </Typography>
        </Paper>
    </Box>
  );
};

export default ProviderPortalMessage;
