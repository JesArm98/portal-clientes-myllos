import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";
import ReorderIcon from "@mui/icons-material/Reorder";
import CloseIcon from "@mui/icons-material/Close";
import ClickableAvatar from "@/Components/Avatar/ClickableAvatar";
import { useLocation } from "react-router-dom"; // 🔥 Hook para obtener la ruta
import { useEffect, useState } from "react";

const Navbar = ({ onMenuClick, isSidebarOpen }) => {
  const [nombreEmpleado, setNombreEmpleado] = useState("Jesus Armando Estrada Aramburo");
  const location = useLocation(); // 🔥 Obtener la ubicación actual (ruta)

  // Función para convertir la ruta a un nombre amigable
  const getOptionName = (path) => {
    // Si la ruta es solo la raíz, devuelve un texto vacío
    if (path === "/") return "";

    // Convierte la ruta en un nombre amigable con mayúsculas y sin "/"
    return path
      .replace("/", "") // Eliminar la barra inicial
      .toUpperCase(); // Convertir a mayúsculas
  };

  useEffect(() => {
    // Obtener el dato del localStorage
    const datoGuardado1 = localStorage.getItem("nombreEmpleado");
    if (datoGuardado1) {
      setNombreEmpleado(datoGuardado1);
    }
  }, []);

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor:"#000",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.08)",
        zIndex: 1201, // 🔥 Asegura que esté por encima del Sidebar
        height: "60px",
        transition: "margin-left 0.3s ease-in-out", // 🔥 Animación para empujar
        marginLeft: isSidebarOpen ? "280px" : "0px", // 🔥 Se mueve cuando el Sidebar está abierto
      }}
    >
      <Toolbar
        sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}
      >
        <Button color="inherit" onClick={onMenuClick}>
          {isSidebarOpen ? <CloseIcon /> : <ReorderIcon />}
        </Button>
        <Typography fontWeight={700} fontSize={"1.5em"}>
          {location.pathname !== "/" && "OPCIÓN DE "}{" "}
          {getOptionName(location.pathname)}
        </Typography>
        <Box sx={{ display: "flex", gap: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              margin: "auto",
            }}
          >
            <Typography fontWeight={500} fontSize={"1em"}>
              {nombreEmpleado}
            </Typography>
          </Box>
          <ClickableAvatar />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
