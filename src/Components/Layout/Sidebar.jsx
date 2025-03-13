import { useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import HomeIcon from "@mui/icons-material/Home";

const Sidebar = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate(); // 🔥 Hook para navegación

  // Definir las rutas y los iconos
  const menuItems = [
    { text: "INICIO", path: "/", icon: <HomeIcon sx={{color:"#3DC2CF"}}  /> },
    {
      text: "DIRECCIONES",
      path: "/direcciones",
      icon: <ReceiptLongIcon sx={{color:"#3DC2CF"}} />,
    },
    //{ text: "EGRESOS", path: "/egresos", icon: <CreditScoreIcon /> },
    //{ text: "GASTOS", path: "/gastos", icon: <LocalGasStationIcon /> },
    //{ text: "INGRESOS", path: "/ingresos", icon: <LocalAtmIcon /> },
    //{ text: "TRASLADOS", path: "/traslados", icon: <LocalShippingIcon /> },
  ];

  const handleNavigation = (path) => {
    navigate(path); // 🔥 Redirige a la ruta correspondiente
    if (isMobile) {
      onClose(); // 🔥 Cierra el sidebar en dispositivos móviles
    }
  };

  return (
    <Drawer
      anchor="left"
      variant={isMobile ? "temporary" : "persistent"}
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: isMobile ? "65%" : "280px",
          backgroundColor: theme.palette.background.paper,
          transition: "width 0.3s ease-in-out",
          marginTop: isMobile ? "0" : "60px",
        },
      }}
    >
      <div role="presentation">
        <List>
          {menuItems.map(({ text, path, icon }) => (
            <ListItem
              button
              key={text}
              onClick={() => handleNavigation(path)} // 🔥 Llamamos a la función de navegación
            >
              <ListItemIcon sx={{ color: "black" }}>{icon}</ListItemIcon>{" "}
              {/* Mostrar el ícono */}
              <ListItemText
                primary={text}
                sx={{
                  textAlign: "left",
                  "& .MuiTypography-root": {
                    // Aplica el estilo a la tipografía dentro de ListItemText
                    fontWeight: "bold",
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
};

export default Sidebar;
